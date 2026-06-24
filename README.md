# 🍃 BeyondLabel

**AI-powered food label analyzer for Indian consumers.**

---

## What It Does

BeyondLabel helps Indian consumers see through misleading food labels. Users type a product name or upload a food label photo, select their health goal — **Muscle Gain**, **Fat Loss**, **General Health**, or **Diabetes Management** — and receive an instant AI-powered verdict:

- ✅ **Trustworthy** — The product is what it claims to be.
- ⚠️ **Question It** — There are concerns worth knowing about.
- ❌ **Avoid** — The product is misleading or harmful for your goal.

Each verdict comes with a **plain-English explanation** of why the product received that rating, a **specific better alternative**, and a **note personalized to your health goal**.

---

## Why It Exists

FSSAI regulations in India are too weak to enforce honest labeling. Brands routinely manipulate labels using tactics like:

- **Soy protein inflation** — Listing soy protein to inflate protein numbers instead of whey.
- **Jaggery marketed as "no refined sugar"** — It's still sugar, just rebranded.
- **Serving size deception** — Printing unrealistically small serving sizes to make nutrition numbers look better.
- **"Added Whey" claims** — When whey is last in the ingredient list (minimal actual quantity).
- **Maltodextrin as "complex carb"** — A misleading classification.
- **"0% Trans Fat"** — When the product contains partially hydrogenated oils.

BeyondLabel catches these tricks and explains them in plain English, personalized to your health goal.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Text Analysis AI | Groq API (Llama 3.1) |
| Image Analysis AI | Google Gemini API (Vision) |
| Hosting | Vercel |

> **No backend required.** All AI calls are made directly from the frontend for this MVP.

---

## How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/mrigank-raj/BeyondLabel.git
cd BeyondLabel

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Add your API keys to .env
#    Get a free Groq key: https://console.groq.com/keys
#    Get a free Gemini key: https://aistudio.google.com/app/apikey

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
BeyondLabel/
├── docs/
│   ├── product/            # Product documentation (PRD, user stories, etc.)
│   └── technical/          # Technical documentation (architecture, API guide, etc.)
├── src/
│   ├── components/         # React UI components
│   │   ├── Hero.jsx        # Landing headline + status badge
│   │   ├── AnalysisForm.jsx# Product input + goal selector + submit
│   │   ├── GoalSelector.jsx# Health goal selection with icons
│   │   ├── ImageUpload.jsx # Label photo upload with drag-and-drop
│   │   ├── VerdictCard.jsx # Verdict display with copy/share
│   │   └── Footer.jsx     # Disclaimer + branding
│   ├── services/
│   │   └── geminiService.js# Groq (text) + Gemini (image) API integration
│   ├── utils/
│   │   └── promptBuilder.js# Prompt engineering for AI analysis
│   ├── constants/
│   │   └── goals.js        # Health goal definitions + prompt modifiers
│   ├── App.jsx             # Root component + state orchestration
│   ├── main.jsx            # React DOM entry point
│   └── index.css           # Tailwind + custom animations
├── .env.example            # Environment variable template
├── .gitignore
├── index.html              # HTML entry point with SEO meta tags
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Live Demo

🔗 **[Vercel link coming soon]**

---

## Built By

**Mrigank Raj Chouhan** — PM Portfolio Project

---

## License

This project is for portfolio and educational purposes.
