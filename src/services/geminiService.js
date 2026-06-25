import { buildPrompt, buildImagePrompt } from '../utils/promptBuilder';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
 * Parses the structured JSON response into a verdict object.
 */
const parseVerdict = (text) => {
  try {
    console.log("Raw AI Response:", text); // Debug logging

    // Remove markdown code blocks if the AI accidentally added them
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    const parsedData = JSON.parse(cleanText);

    // Sanitize verdict to one of the known values
    let verdict = parsedData.verdict || 'Insufficient Data';
    if (verdict.includes('Excellent')) verdict = 'Excellent';
    else if (verdict.includes('Good')) verdict = 'Good';
    else if (verdict.includes('Moderate')) verdict = 'Moderate';
    else if (verdict.includes('Poor')) verdict = 'Poor';
    else if (verdict.includes('Avoid')) verdict = 'Avoid';
    else verdict = 'Insufficient Data';

    return {
      verdict,
      healthScore: parsedData.healthScore ?? null,
      why: parsedData.why || 'No explanation provided.',
      suggestion: parsedData.suggestion || null,
      goalNote: parsedData.goalNote || null,
      pros: parsedData.pros || [],
      cons: parsedData.cons || [],
      hiddenNasties: parsedData.hiddenNasties || [],
      macros: parsedData.macros || null,
      ingredients: parsedData.ingredients || [],
      alternatives: parsedData.alternatives || []
    };
  } catch (e) {
    console.error("Parse error:", e);
    // Fallback if parsing fails entirely
    return {
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
      
      const seconds = Math.round(finalDelay / 1000);
      const statusText = `AI busy, retrying in ${seconds}s...`;
      console.warn(`API responded with ${response.status}. ${statusText} (${retries} attempts left)`);
      
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
      
      const seconds = Math.round(finalDelay / 1000);
      const statusText = `Connection issue, retrying in ${seconds}s...`;
      console.warn(`Fetch error: ${error.message}. ${statusText} (${retries} attempts left)`);
      
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
 * Analyzes a text product name using Groq (Llama 3.1) for high-speed, rate-limit free queries.
 */
export const analyzeProduct = async (productName, goalId, onRetry = null) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.');
  }

  const prompt = buildPrompt(productName, goalId);
  const models = ['llama-3.1-70b-versatile', 'llama3-70b-8192', 'llama-3.1-8b-instant'];
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Sending text query to Groq using model: ${model}`);
      const response = await fetchWithRetry(
        GROQ_API_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1024,
            response_format: { type: "json_object" }
          })
        },
        2, // 2 retries per model before trying fallback model
        1500,
        onRetry
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Groq API Error (${model}):`, response.status, errorData);
        throw new Error(errorData.error?.message || response.statusText || 'Failed to connect to Groq');
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      
      if (!rawText) throw new Error('Received empty response from Groq.');

      return parseVerdict(rawText);
    } catch (err) {
      console.warn(`Groq model ${model} failed, trying fallback model. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`Groq Analysis Failed: ${lastError?.message || 'Check your internet connection or API Key.'}`);
};

/**
 * Analyzes an uploaded label image using Google Gemini API's native vision/multimodal capabilities.
 */
export const analyzeImage = async (imageFile, goalId, onRetry = null) => {
  if (!API_KEY) {
    throw new Error('Gemini API Key is missing. Please check your .env file.');
  }

  const base64Image = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const mimeType = imageFile.type;
  const prompt = buildImagePrompt(goalId);
  const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite'];
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Sending image query to Gemini using model: ${model}`);
      const response = await fetchWithRetry(
        `${API_URL}/${model}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { inlineData: { mimeType, data: base64Image } },
                  { text: prompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
              responseMimeType: "application/json"
            }
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
        throw new Error(errorData.error?.message || response.statusText || 'Failed to connect to Gemini');
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) throw new Error('Received empty response from Gemini.');

      return parseVerdict(rawText);
    } catch (err) {
      console.warn(`Gemini model ${model} failed, trying fallback model. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`Gemini Image Analysis Failed: ${lastError?.message || 'Ensure your label photo is clear.'}`);
};

