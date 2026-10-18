import { buildPrompt } from '../src/utils/promptBuilder.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Tried in order; any failure (retired model, rate limit, outage) falls through to the next.
// Swap models with the GROQ_MODELS env var (comma-separated) instead of editing code.
const MODELS = (process.env.GROQ_MODELS || 'openai/gpt-oss-120b,openai/gpt-oss-20b').split(',').map((m) => m.trim());

// Same product + goal → same answer, so repeat searches (trending chips) skip Groq.
// Stores the in-flight promise so a burst of identical taps makes one call.
// ponytail: per-instance memory, lost on cold start; move to Vercel Runtime Cache if hit rate matters.
const cache = new Map();
const CACHE_MAX = 200;

export default async function handler(req, res) {
  // CORS for local development if needed
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

  const { productName, goalId } = req.body;

  if (!productName || !goalId) {
    return res.status(400).json({ error: 'Missing productName or goalId' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  const key = `${goalId}|${String(productName).trim().replace(/\s+/g, ' ').toLowerCase()}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = callGroq(productName, goalId);
    cache.set(key, pending);
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
    // Only clean successes stay cached; errors and broken JSON retry live next time
    pending.then(({ status, body }) => {
      try { if (status === 200) return JSON.parse(body.result); } catch { /* fall through */ }
      cache.delete(key);
    });
  }
  const { status, body } = await pending;
  return res.status(status).json(body);
}

// Resolves to { status, body } and never throws, so a cached promise can't reject.
async function callGroq(productName, goalId) {
  try {
    const prompt = buildPrompt(productName, goalId);

    let response, model;
    for (model of MODELS) {
      response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 4096,
          response_format: { type: "json_object" }
        })
      });
      if (response.ok) break;
      console.warn(`Groq model ${model} failed (${response.status}), trying next model`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Groq API Error (${model}):`, response.status, errorData);
      return { status: response.status, body: {
        error: errorData.error?.message || response.statusText || 'Failed to connect to Groq AI'
      } };
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;

    if (!rawText) {
      return { status: 500, body: { error: 'Received empty response from Groq' } };
    }

    return { status: 200, body: { result: rawText } };

  } catch (error) {
    console.error('API Error:', error);
    return { status: 500, body: { error: error.message || 'Internal Server Error' } };
  }
}
