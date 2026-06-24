# BeyondLabel — Deployment Plan

## 1. Overview
BeyondLabel is a frontend-only React application built with Vite. It interacts directly with third-party LLM APIs (Groq and Gemini). The deployment process is straightforward as it only requires static hosting for the built frontend assets.

**Recommended Platform:** Vercel (or Netlify / Cloudflare Pages)

## 2. Prerequisites
- A GitHub repository containing the source code.
- Accounts on Vercel, Groq, and Google AI Studio (for Gemini).
- Environment variables configured locally (for reference).

## 3. Environment Variables
The following environment variables MUST be configured in the deployment environment:

| Variable | Description |
|---|---|
| `VITE_GROQ_API_KEY` | API key for Groq (Text Analysis) |
| `VITE_GEMINI_API_KEY` | API key for Google Gemini (Image Analysis) |

*Security Note:* Because this is a frontend-only application, these `VITE_` prefixed variables will be embedded into the client bundle at build time. For a production deployment, ensure that API keys are restricted/scoped (e.g., by domain or usage limits) in their respective provider consoles to prevent abuse.

## 4. Deployment Steps (Vercel)

1. **Connect Repository:**
   - Log into Vercel and click "Add New..." -> "Project".
   - Import the BeyondLabel repository from GitHub.

2. **Configure Project:**
   - **Framework Preset:** Vercel should auto-detect "Vite". If not, select it manually.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   - In the "Environment Variables" section, add `VITE_GROQ_API_KEY` and `VITE_GEMINI_API_KEY` with their production values.

4. **Deploy:**
   - Click "Deploy". Vercel will build the project and assign a production URL (e.g., `beyondlabel.vercel.app`).

## 5. CI/CD Integration
- Vercel automatically sets up continuous deployment.
- Pushes to the `main` branch will trigger a production build.
- Pull requests will generate preview deployments, allowing the team to test changes before merging.

## 6. Post-Deployment Checklist
- [ ] Visit the production URL.
- [ ] Test a text-based search to verify Groq API connectivity.
- [ ] Test an image upload to verify Gemini API connectivity.
- [ ] Ensure the mobile responsive layout functions correctly.
- [ ] Set up a custom domain (optional) via Vercel's Domain settings.
