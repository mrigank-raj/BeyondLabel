# BeyondLabel — Environment Setup Guide

## Prerequisites

Before running BeyondLabel locally, make sure you have the following installed:

| Tool | Minimum Version | Check Command |
|---|---|---|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Git | Any | `git --version` |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/BeyondLabel.git
cd BeyondLabel
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs React, Vite, Tailwind CSS, and all other project dependencies.

---

## Step 3: Get Your API Keys

### Groq API Key (for text-based product analysis)

1. Go to [console.groq.com/keys](https://console.groq.com/keys).
2. Sign in with Google or GitHub (free account).
3. Click **"Create API Key"**.
4. Give it a name (e.g., "BeyondLabel").
5. Copy the key — it starts with `gsk_...`.

### Gemini API Key (for image/label photo analysis)

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"**.
4. If prompted, select or create a Google Cloud project (free tier is fine).
5. Copy the key — it starts with `AIzaSy...`.

> **Note**: Both APIs have free tiers. You do NOT need to enter credit card information.

---

## Step 4: Create Your `.env` File

```bash
cp .env.example .env
```

Then open `.env` and paste your keys:

```env
VITE_GROQ_API_KEY=gsk_your_actual_groq_key_here
VITE_GEMINI_API_KEY=AIzaSy_your_actual_gemini_key_here
```

> **Important**: The `.env` file is listed in `.gitignore` and will NOT be pushed to GitHub. Never commit real API keys.

---

## Step 5: Run the Development Server

```bash
npm run dev
```

The app will start at:

```
http://localhost:5173
```

Open this URL in your browser. You should see the BeyondLabel homepage.

---

## Step 6: Test the App

1. Type **"Pintola Protein Oats"** in the product name field.
2. Select **"Muscle Gain"** as your health goal.
3. Click **"Analyze Product"**.
4. You should see a verdict card with an AI-generated analysis.

---

## Common Errors and Fixes

### `Groq API Key is missing`

**Cause**: `VITE_GROQ_API_KEY` is not set in your `.env` file, or the `.env` file doesn't exist.

**Fix**: Make sure you've created the `.env` file (Step 4) and pasted a valid Groq key.

### `Gemini API Key is missing`

**Cause**: `VITE_GEMINI_API_KEY` is not set in your `.env` file.

**Fix**: Same as above — ensure the Gemini key is in `.env`.

### `API Error: models/gemini-1.5-flash is not found`

**Cause**: Your Gemini API key may be a restricted Google Cloud service token rather than a standard AI Studio key.

**Fix**: Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and generate a new key. Standard keys start with `AIzaSy...`.

### `Too many requests / 429 Error`

**Cause**: You've exceeded the API rate limit (Groq: ~30 RPM, Gemini: ~15 RPM).

**Fix**: Wait 30–60 seconds and try again. The app automatically retries with exponential backoff, so this should resolve itself. If it persists, your key may have hit a daily quota.

### `This model is currently experiencing high demand / 503 Error`

**Cause**: The AI model's servers are temporarily overloaded.

**Fix**: The app automatically retries up to 3 times with increasing delays. If all retries fail, it will fall back to alternative models. Wait a minute and try again.

### `.env` changes not reflecting

**Cause**: Vite caches environment variables. Changes to `.env` require a server restart.

**Fix**: Stop the dev server (`Ctrl + C`) and run `npm run dev` again.

### Build fails with module errors

**Cause**: Missing or outdated dependencies.

**Fix**: Delete `node_modules` and reinstall:

```bash
rm -rf node_modules
npm install
```

---

## Production Build

To build the production bundle:

```bash
npm run build
```

The output will be in the `dist/` folder, ready for Vercel deployment.
