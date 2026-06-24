# BeyondLabel — Architecture Document

## Component Tree

```
App.jsx
├── Hero.jsx                  # Landing headline, animated badge
├── Error Banner              # Inline dismissable error (rendered in App.jsx)
├── AnalysisForm.jsx          # Form orchestrator
│   ├── TextInput             # Product name input (inline in AnalysisForm)
│   ├── ImageUpload.jsx       # Drag-and-drop upload + camera capture
│   └── GoalSelector.jsx      # 4 health goal buttons with icons
├── VerdictCard.jsx           # AI verdict display with copy/share
└── Footer.jsx                # Disclaimer and branding
```

## Folder Structure

```
src/
├── components/               # Presentational React components
│   ├── Hero.jsx              # Gradient heading, status badge, entrance animation
│   ├── AnalysisForm.jsx      # Form with inline validation, shake on error
│   ├── GoalSelector.jsx      # Goal buttons with emoji icons and check marks
│   ├── ImageUpload.jsx       # Drag-and-drop + click upload + camera capture with preview
│   ├── VerdictCard.jsx       # Verdict card with copy/share and auto-scroll
│   └── Footer.jsx            # Legal disclaimer and version info
├── services/
│   └── geminiService.js      # Dual API integration (Groq + Gemini)
│                               - analyzeProduct() → Groq API
│                               - analyzeImage() → Gemini API
│                               - fetchWithRetry() → exponential backoff
│                               - parseVerdict() → response parser
├── utils/
│   └── promptBuilder.js      # Prompt construction with system instructions
│                               - buildPrompt() → text analysis prompt
│                               - buildImagePrompt() → image analysis prompt
├── constants/
│   └── goals.js              # Health goal definitions and prompt modifiers
├── App.jsx                   # Root: state management, error handling, layout
├── main.jsx                  # React DOM entry point
└── index.css                 # Tailwind directives + custom animations
```

## Data Flow

```
User Input (Product Name / Image + Goal)
         │
         ▼
   AnalysisForm.jsx
   (validates input → calls App.handleAnalyze)
         │
         ▼
     App.jsx (handleAnalyze)
   ┌─────┴─────┐
   │            │
Text Input   Image Upload
   │            │
   ▼            ▼
promptBuilder  promptBuilder
.buildPrompt() .buildImagePrompt()
   │            │
   ▼            ▼
geminiService  geminiService
.analyzeProduct() .analyzeImage()
   │            │
   │ Groq API   │ Gemini API
   │ (Llama 3.1)│ (Vision)
   │            │
   └─────┬──────┘
         │
         ▼
   parseVerdict()
   (extracts VERDICT, WHY, ALTERNATIVE, GOAL NOTE)
         │
         ▼
   App.jsx → setVerdict(result)
         │
         ▼
   VerdictCard.jsx
   (renders styled verdict with copy/share)
```

## How Groq and Gemini Are Used

### Groq API (Text Analysis)

- **When**: User types a product name and clicks Analyze.
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Authentication**: `Authorization: Bearer <VITE_GROQ_API_KEY>`
- **Model fallback chain**: `llama-3.1-70b-versatile` → `llama3-70b-8192` → `llama-3.1-8b-instant`
- **Why Groq**: Groq provides near-instant inference (~200ms) with generous free-tier rate limits, solving the frequent 429/503 errors encountered with Gemini's free tier.

### Gemini API (Image Analysis)

- **When**: User uploads a label photo and clicks Analyze.
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=<KEY>`
- **Authentication**: API key as query parameter.
- **Model fallback chain**: `gemini-1.5-flash` → `gemini-1.5-flash-latest` → `gemini-1.5-pro`
- **Why Gemini**: Gemini is one of the few free-tier APIs that supports multimodal vision (image + text in a single request). Groq does not support image input on its free tier.

### Shared Infrastructure

Both APIs share:
- **Prompt builder** (`promptBuilder.js`): Same system instruction with 7 Indian label manipulation tactics, same output format requirements.
- **Response parser** (`parseVerdict` in `geminiService.js`): Same regex-based parser that extracts `VERDICT`, `WHY`, `ALTERNATIVE`, `GOAL NOTE`, and `SUGGESTION`.
- **Retry wrapper** (`fetchWithRetry`): Exponential backoff (1.5s → 3s → 6s) with random jitter (±300ms). Retries on 429, 503, and 500. Reports status to UI via `onRetry` callback.

## State Management

All state is managed via React `useState` hooks in `App.jsx`. No global state library is used for this MVP.

| State | Type | Purpose |
|---|---|---|
| `productName` | `string` | Text input value |
| `imageFile` | `File \| null` | Uploaded image file |
| `imagePreview` | `string \| null` | Object URL for image preview |
| `goal` | `string` | Selected health goal ID |
| `verdict` | `object \| null` | Parsed AI verdict |
| `isLoading` | `boolean` | Loading spinner state |
| `loadingStatus` | `string` | Dynamic loading text (e.g. "Retrying in 3s...") |
| `error` | `string \| null` | Error message for error banner |

## Resilience Strategy

1. **Per-model retries**: Each model in the fallback chain gets 2 retry attempts before moving to the next model.
2. **Exponential backoff**: Delays double on each retry (1.5s → 3s → 6s) with ±300ms random jitter.
3. **Model fallback**: If a model returns 404 or fails after retries, the next model in the chain is tried automatically.
4. **Live UI feedback**: The submit button text updates in real time during retries (e.g. "AI busy, retrying in 2s...").
5. **Graceful failure**: After all models and retries are exhausted, a clear error message is shown with a dismissable banner.
