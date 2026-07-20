import { buildPrompt, buildImagePrompt } from '../utils/promptBuilder';

// We now call our local Vercel Serverless Functions to protect API keys.
// In development with Vite, you should run the app using `npx vercel dev` 
// so that the `/api` routes are served alongside the frontend.
const API_BASE = '/api';

/**
 * Strips markdown bold/italic markers from text.
 */
const cleanMarkdown = (text) => {
  if (!text) return text;
  return text
    .replace(/\*\*/g, '')   // Remove bold **
    .replace(/\*/g, '')     // Remove italic *
    .replace(/^#+\s*/gm, '') // Remove heading markers
    .trim();
};

/**
 * Attempts to repair truncated JSON by closing open brackets and braces.
 */
const repairTruncatedJSON = (text) => {
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') openBraces++;
    else if (ch === '}') openBraces--;
    else if (ch === '[') openBrackets++;
    else if (ch === ']') openBrackets--;
  }

  // If we're still inside a string, close it
  if (inString) text += '"';

  // Remove any trailing comma before we close
  text = text.replace(/,\s*$/, '');

  // Close any open brackets and braces
  while (openBrackets > 0) { text += ']'; openBrackets--; }
  while (openBraces > 0) { text += '}'; openBraces--; }

  return text;
};

/**
 * Parses the structured JSON response into a verdict object.
 * Handles truncated JSON, safety-blocked responses, and edge cases.
 */
const parseVerdict = (text) => {
  const fallback = {
    verdict: 'Insufficient Data',
    healthScore: 0,
    why: 'Failed to parse AI response. The server may have returned malformed data.',
    suggestion: 'Please try again.',
    goalNote: null,
    pros: [],
    cons: [],
    hiddenNasties: [],
    macros: null,
    ingredients: [],
    alternatives: []
  };

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.error("parseVerdict received empty or non-string input:", text);
    fallback.why = 'AI returned an empty response. This may be due to content safety filters. Please try a different image.';
    return fallback;
  }

  try {
    console.log("Raw AI Response:", text); // Debug logging

    // Extract the JSON object using curly braces to avoid markdown or conversational text
    let cleanText = text.trim();

    // Remove markdown code fences if present
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    const firstBrace = cleanText.indexOf('{');
    if (firstBrace === -1) {
      throw new Error("No JSON object found in response");
    }

    cleanText = cleanText.substring(firstBrace);

    // First attempt: direct parse
    let parsedData;
    try {
      parsedData = JSON.parse(cleanText);
    } catch (directParseError) {
      // Second attempt: try to find the last valid closing brace
      const lastBrace = cleanText.lastIndexOf('}');
      if (lastBrace !== -1) {
        try {
          parsedData = JSON.parse(cleanText.substring(0, lastBrace + 1));
        } catch (_) {
          // Third attempt: repair truncated JSON
          console.warn("JSON truncated, attempting repair...");
          const repaired = repairTruncatedJSON(cleanText);
          parsedData = JSON.parse(repaired);
        }
      } else {
        // No closing brace at all — try repair
        console.warn("No closing brace found, attempting repair...");
        const repaired = repairTruncatedJSON(cleanText);
        parsedData = JSON.parse(repaired);
      }
    }

    // Sanitize verdict to one of the known values
    let verdictStr = String(parsedData.verdict || 'Insufficient Data');
    let verdict = 'Insufficient Data';
    if (verdictStr.includes('Excellent')) verdict = 'Excellent';
    else if (verdictStr.includes('Good')) verdict = 'Good';
    else if (verdictStr.includes('Moderate')) verdict = 'Moderate';
    else if (verdictStr.includes('Poor')) verdict = 'Poor';
    else if (verdictStr.includes('Avoid')) verdict = 'Avoid';

    return {
      verdict,
      healthScore: parsedData.healthScore ?? null,
      why: parsedData.why || 'No explanation provided.',
      suggestion: parsedData.suggestion || null,
      goalNote: parsedData.goalNote || null,
      pros: Array.isArray(parsedData.pros) ? parsedData.pros : [],
      cons: Array.isArray(parsedData.cons) ? parsedData.cons : [],
      hiddenNasties: Array.isArray(parsedData.hiddenNasties) ? parsedData.hiddenNasties : [],
      macros: parsedData.macros || null,
      ingredients: Array.isArray(parsedData.ingredients) ? parsedData.ingredients : [],
      alternatives: Array.isArray(parsedData.alternatives) ? parsedData.alternatives : []
    };
  } catch (e) {
    console.error("Parse error:", e, "\nRaw text:", text.substring(0, 500));
    fallback.why = `Failed to parse AI response. Please try again or use a clearer image.`;
    return fallback;
  }
};

/**
 * Helper to perform fetch requests with exponential backoff, jitter, and retry status callbacks.
 */
const fetchWithRetry = async (url, options, retries = 3, delay = 1500, onRetry = null) => {
  try {
    const response = await fetch(url, options);

    if (response.ok) {
      return response;
    }

    // Retrying on rate limits (429), server overloaded (503), or temporary gateway/server error (500)
    if ([429, 503, 500].includes(response.status) && retries > 0) {
      // Add random jitter of +/- 300ms to avoid stampeding
      const jitter = Math.random() * 600 - 300;
      const finalDelay = Math.max(500, delay + jitter);
      
      const statusText = `Taking a little longer than usual, hold tight...`;
      console.warn(`API responded with ${response.status}. Retrying... (${retries} attempts left)`);
      
      if (onRetry) {
        onRetry(statusText);
      }

      await new Promise((resolve) => setTimeout(resolve, finalDelay));
      return fetchWithRetry(url, options, retries - 1, delay * 2, onRetry);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      const jitter = Math.random() * 600 - 300;
      const finalDelay = Math.max(500, delay + jitter);
      
      const statusText = `Still analyzing your label, almost there...`;
      console.warn(`Fetch error: ${error.message}. Retrying... (${retries} attempts left)`);
      
      if (onRetry) {
        onRetry(statusText);
      }

      await new Promise((resolve) => setTimeout(resolve, finalDelay));
      return fetchWithRetry(url, options, retries - 1, delay * 2, onRetry);
    }
    throw error;
  }
};

/**
 * Analyzes a text product name using the backend API proxy.
 */
export const analyzeProduct = async (productName, goalId, onRetry = null) => {
  const models = ['llama-3.1-70b-versatile', 'llama3-70b-8192', 'llama-3.1-8b-instant'];
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Sending text query to backend API using model: ${model}`);
      const response = await fetchWithRetry(
        `${API_BASE}/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName,
            goalId,
            model
          })
        },
        2, // 2 retries per model before trying fallback model
        1500,
        onRetry
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Groq API Error (${model}):`, response.status, errorData);
        
        const errorMessage = errorData.error?.message || (typeof errorData.error === 'string' ? errorData.error : null) || response.statusText || 'Failed to connect to Groq';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const rawText = data.result;
      
      if (!rawText) throw new Error('Received empty response from API.');

      return parseVerdict(rawText);
    } catch (err) {
      console.warn(`Groq model ${model} failed, trying fallback model. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`Groq Analysis Failed: ${lastError?.message || 'Check your internet connection or API Key.'}`);
};

/**
 * Compresses an image before sending to the API. 
 * Drastically reduces payload size and upload time for mobile photos.
 */
const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_DIMENSION = 800; // Reduced from 1200 to prevent Vercel 10s timeouts
        
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress as JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve({
          base64: dataUrl.split(',')[1],
          mimeType: 'image/jpeg'
        });
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Analyzes an uploaded label image using the backend API proxy.
 */
export const analyzeImage = async (imageFile, goalId, onRetry = null) => {
  // Compress image to speed up upload and AI processing time
  const { base64: base64Image, mimeType } = await compressImage(imageFile);
  const models = ['gemini-2.0-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Sending image query to backend API using model: ${model}`);
      const response = await fetchWithRetry(
        `${API_BASE}/analyze-image`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image,
            mimeType,
            goalId,
            model
          })
        },
        2, // 2 retries per model before trying fallback model
        1500,
        onRetry
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Gemini Vision API Error (${model}):`, response.status, errorData);
        // If the model does not exist or isn't supported, proceed to next model immediately (no retry benefit)
        if (response.status === 404) {
          throw new Error(`Model ${model} is not supported or not found (404)`);
        }
        
        const errorMessage = errorData.error?.message || (typeof errorData.error === 'string' ? errorData.error : null) || response.statusText || 'Failed to connect to Gemini';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      const rawText = data.result;
      
      if (!rawText || rawText.trim().length === 0) {
        throw new Error(`Received empty response from API.`);
      }

      return parseVerdict(rawText);
    } catch (err) {
      console.warn(`Gemini model ${model} failed, trying fallback model. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`Gemini Image Analysis Failed: ${lastError?.message || 'Ensure your label photo is clear.'}`);
};

