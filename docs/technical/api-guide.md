# BeyondLabel — API Guide

## Overview

BeyondLabel uses two AI APIs in a hybrid architecture:

| API | Used For | Model | Speed | Free Tier |
|---|---|---|---|---|
| **Groq** | Text-based product analysis | Llama 3.1 70B | ~200ms | 30 RPM |
| **Gemini** | Image/label photo analysis | Gemini 1.5 Flash | ~2-5s | 15 RPM |

---

## 1. Groq API Setup

### Getting Your Key

1. Go to [console.groq.com/keys](https://console.groq.com/keys).
2. Sign in with Google or GitHub.
3. Click **"Create API Key"**.
4. Copy the key (starts with `gsk_...`).
5. Add it to your `.env` file as `VITE_GROQ_API_KEY`.

### Endpoint

```
POST https://api.groq.com/openai/v1/chat/completions
```

### Authentication

```
Authorization: Bearer <VITE_GROQ_API_KEY>
```

### Request Format

```json
{
  "model": "llama-3.1-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": "<full prompt from promptBuilder.js>"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 1024
}
```

### Response Format

```json
{
  "choices": [
    {
      "message": {
        "content": "VERDICT: Question It\nWHY: ...\nALTERNATIVE: ...\nGOAL NOTE: ..."
      }
    }
  ]
}
```

### Model Fallback Chain

1. `llama-3.1-70b-versatile` (primary — highest quality)
2. `llama3-70b-8192` (fallback — slightly older)
3. `llama-3.1-8b-instant` (last resort — fastest, lower quality)

---

## 2. Gemini API Setup

### Getting Your Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"**.
4. Select or create a Google Cloud project.
5. Copy the key (starts with `AIzaSy...`).
6. Add it to your `.env` file as `VITE_GEMINI_API_KEY`.

### Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}
```

### Authentication

API key is passed as a query parameter (`?key=...`).

### Request Format (Multimodal — Image + Text)

```json
{
  "contents": [
    {
      "parts": [
        {
          "inlineData": {
            "mimeType": "image/jpeg",
            "data": "<base64-encoded-image>"
          }
        },
        {
          "text": "<full prompt from promptBuilder.js>"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.3,
    "maxOutputTokens": 1024
  }
}
```

### Response Format

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "VERDICT: Avoid\nWHY: ...\nALTERNATIVE: ...\nGOAL NOTE: ..."
          }
        ]
      }
    }
  ]
}
```

### Model Fallback Chain

1. `gemini-1.5-flash` (primary — fast and capable)
2. `gemini-1.5-flash-latest` (fallback — latest version)
3. `gemini-1.5-pro` (last resort — higher quality, slower)

---

## 3. Prompt Structure

Both APIs receive the same prompt, built by `src/utils/promptBuilder.js`.

### System Instruction

The prompt instructs the AI to:
- Act as an **expert Indian nutritionist and food label analyst**.
- Look for **7 specific Indian food label manipulation tactics** (soy protein inflation, jaggery as "no refined sugar", serving size deception, "Added Whey" with minimal whey, maltodextrin as "complex carb", "0% Trans Fat" with hydrogenated oils, "Natural flavors" covering additives).
- Return a structured response in **exact format** (VERDICT / WHY / ALTERNATIVE / GOAL NOTE).
- Return `Insufficient Data` if the product is unknown or the image is unreadable.

### Goal Modifier

A goal-specific paragraph is appended to the prompt based on the user's selection:

| Goal | Focus |
|---|---|
| Muscle Gain | Protein quality (whey vs soy), protein-to-calorie ratio |
| Fat Loss | Hidden calories, added sugars, misleading serving sizes |
| General Health | Whole food ingredients vs ultra-processed additives |
| Diabetes Management | Added/hidden sugars, refined carbs, glycemic impact |

---

## 4. Error Handling

### Retry Strategy

The `fetchWithRetry` function handles transient errors:

| HTTP Status | Meaning | Action |
|---|---|---|
| `429` | Rate limit exceeded | Retry with exponential backoff |
| `503` | Service unavailable / high demand | Retry with exponential backoff |
| `500` | Server error | Retry with exponential backoff |
| `404` | Model not found | Skip to next model in fallback chain |
| Other | Unexpected error | Throw immediately |

### Backoff Schedule

- Attempt 1: 1.5s wait
- Attempt 2: 3.0s wait
- Attempt 3: 6.0s wait
- Random jitter: ±300ms added to each delay

### UI Feedback During Retries

The `onRetry` callback updates the submit button text in real-time:
- `"Analyzing label..."` → `"AI busy, retrying in 2s..."` → `"Connection issue, retrying in 3s..."`

---

## 5. Rate Limiting Considerations

| API | Free Tier Limit | Implication |
|---|---|---|
| Groq | ~30 requests/minute | Sufficient for MVP usage |
| Gemini | ~15 requests/minute | Image analysis may hit limits under heavy use |

**Mitigation strategies implemented**:
- Groq handles the more frequent text queries (lower rate limit pressure on Gemini).
- Exponential backoff with retries handles temporary spikes.
- Model fallback chains provide redundancy.

---

## 6. Environment Variables

```bash
# Required for text-based product analysis (Groq)
VITE_GROQ_API_KEY=gsk_your_groq_key_here

# Required for image/label photo analysis (Gemini)
VITE_GEMINI_API_KEY=AIzaSy_your_gemini_key_here
```

Both keys must be prefixed with `VITE_` to be accessible in the Vite frontend build.
