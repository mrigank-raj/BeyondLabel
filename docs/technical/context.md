# BeyondLabel — Technical Context

## Overview

BeyondLabel is an AI-powered food label analyzer built specifically for Indian consumers. It is a client-side React Single Page Application (SPA) with no backend. The app uses two separate AI APIs — **Groq** for text-based analysis and **Google Gemini** for image/label photo analysis — to provide instant, personalized health verdicts on Indian packaged food products.

## Core User Flow

1. User lands on homepage.
2. User enters a **product name** (e.g. "Pintola Protein Oats") OR uploads a **photo of a food label**.
3. User selects their **health goal**: Muscle Gain, Fat Loss, General Health, or Diabetes Management.
4. User clicks **"Analyze Product"**.
5. The app routes the request:
   - **Text input** → Groq API (Llama 3.1 model via OpenAI-compatible endpoint)
   - **Image upload** → Google Gemini API (multimodal vision model)
6. The AI analyzes the product using a detailed prompt that instructs it to act as an expert Indian nutritionist, look for 7 specific Indian label manipulation tactics, and personalize the response to the user's health goal.
7. The response is parsed into a structured verdict object and displayed in a **VerdictCard**.
8. User can **copy** or **share** the verdict.

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 (Vite) | UI rendering, component architecture |
| Styling | Tailwind CSS 3 | Utility-first responsive styling |
| Text AI | Groq API (Llama 3.1) | Fast, free text-based product analysis |
| Image AI | Google Gemini API | Multimodal vision for label photo analysis |
| Build Tool | Vite 5 | Fast HMR, production bundling |
| Hosting | Vercel | Static SPA hosting |

## Architecture Decision: No Backend

For the MVP, all AI API calls are made directly from the browser (client-side). The API keys are exposed via `VITE_` environment variables, which is an accepted trade-off for an MVP to avoid backend infrastructure complexity. The implication is:

- API keys are visible in the browser's network tab.
- Rate limits are per-key, not per-user.
- For production scaling, a lightweight backend proxy would be needed to protect keys and add per-user rate limiting.

## Architecture Decision: Hybrid AI (Groq + Gemini)

Gemini's free tier has aggressive rate limits (15 RPM) and frequent demand spikes (503 errors). To solve this:

- **Text queries** are routed to Groq, which provides near-instant responses with generous free-tier limits.
- **Image queries** remain on Gemini because Groq's free tier does not support multimodal/vision input.
- Both APIs share the same prompt engineering system (`promptBuilder.js`) and response parser (`parseVerdict` in `geminiService.js`).

## Environment Variables

| Variable | Required For | How to Get |
|---|---|---|
| `VITE_GROQ_API_KEY` | Text product analysis | [console.groq.com/keys](https://console.groq.com/keys) |
| `VITE_GEMINI_API_KEY` | Image label analysis | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

## Design Aesthetic

- **Primary color**: Deep Forest Green (`#1B4332`)
- **Background**: Off-white (`#F9FAFB`)
- **Typography**: Inter (Google Fonts) — 400, 500, 600, 700, 800 weights
- **Tone**: Direct, no-nonsense. Verdicts feel like an honest friend telling you the truth.
- **Mobile-first**: Designed for users standing in a grocery store or browsing Blinkit on their phone.
