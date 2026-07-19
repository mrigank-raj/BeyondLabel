import { buildImagePrompt } from '../src/utils/promptBuilder.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { base64Image, mimeType, goalId, model = 'gemini-2.0-flash' } = req.body;

  if (!base64Image || !mimeType || !goalId) {
    return res.status(400).json({ error: 'Missing base64Image, mimeType, or goalId' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    const prompt = buildImagePrompt(goalId);
    
    // Set a timeout for the fetch request just in case
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(`${API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
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
          maxOutputTokens: 4096,
          responseMimeType: "application/json"
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Gemini API Error (${model}):`, response.status, errorData);
      
      if (response.status === 404) {
        return res.status(404).json({ error: `Model ${model} is not supported or not found (404)` });
      }
      return res.status(response.status).json({ 
        error: errorData.error?.message || response.statusText || 'Failed to connect to Gemini' 
      });
    }

    const data = await response.json();
    
    const candidate = data.candidates?.[0];
    if (!candidate) {
      const blockReason = data.promptFeedback?.blockReason || 'Unknown';
      console.warn(`Gemini blocked response. Reason: ${blockReason}`, data);
      return res.status(400).json({ error: `AI response was blocked (reason: ${blockReason}). Try a clearer photo.` });
    }
    
    const finishReason = candidate.finishReason;
    if (finishReason === 'SAFETY') {
      console.warn('Gemini response blocked by safety filters.', candidate.safetyRatings);
      return res.status(400).json({ error: 'AI response was blocked by safety filters. Try a different image.' });
    }

    const rawText = candidate.content?.parts?.[0]?.text;
    
    if (!rawText || rawText.trim().length === 0) {
      console.warn('Gemini returned empty text. Finish reason:', finishReason);
      return res.status(500).json({ error: `Received empty response from Gemini (finishReason: ${finishReason}).` });
    }

    return res.status(200).json({ result: rawText });

  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out' });
    }
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
