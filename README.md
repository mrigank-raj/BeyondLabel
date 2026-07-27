# BeyondLabel

> **Scan any product label to instantly reveal hidden nasties and personalized health insights.**

BeyondLabel is an AI-powered Progressive Web App (PWA) designed to demystify complex nutrition labels. By leveraging Google's Gemini Vision AI and Groq's blazing-fast inference, BeyondLabel reads ingredient lists and provides clear, actionable verdicts on whether a product aligns with your health goals.

## ✨ Features

- **📷 AI Label Scanning**: Just snap a picture of an ingredient label or nutrition facts panel. 
- **🔍 Ingredient Breakdown**: Instantly identifies "hidden nasties," artificial preservatives, and controversial additives.
- **🎯 Personalized Goals**: Set your dietary lens (e.g., Weight Loss, Heart Health, Vegan, Gluten-Free) and get personalized alignment scores.
- **⚡ Blazing Fast UX**: Built on a modern serverless edge architecture with streaming responses so you never wait for results.
- **🎮 Gamification & Growth**: Track your healthy choices, build streaks, and unlock tiered badges ("Advocate", "Trendsetter") by sharing the app with friends.
- **📱 PWA Ready**: Installable on iOS and Android for a native app-like experience without the app store friction.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **AI/LLM Models**: 
  - Vision/Extraction: Google Gemini 2.0 Flash
  - Fast Inference/Reasoning: Groq (Llama 3)
- **Backend / API**: Vercel Serverless Functions
- **Storage**: Supabase, LocalStorage for offline-first caching
- **Social Sharing**: Web Share API + `html-to-image` for rich graphic generation

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- API Keys for Google Gemini and Groq

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrigank-raj/BeyondLabel.git
   cd BeyondLabel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
