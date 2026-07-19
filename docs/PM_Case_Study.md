# Product Management Case Study: BeyondLabel

## 1. The Problem
Consumers are increasingly health-conscious, but the food industry purposefully obscures nutritional reality behind complex labels, hidden sugars, and scientific jargon. Navigating a grocery aisle requires either a degree in nutrition or an exhausting amount of mental math. Existing apps require users to manually log every gram, creating immense friction.

**The User Need:** A frictionless, instant translator that looks at a food product and simply tells the user: *"Is this good for my specific health goals?"*

## 2. The Solution: BeyondLabel
BeyondLabel is an AI-powered web application that demystifies nutrition labels instantly. Users simply tap to scan a barcode or ingredient list, and the app's AI (powered by Google Gemini) translates the complex data into a clear, actionable verdict (e.g., "Great Choice", "Think Twice") tailored to their personal health goals.

**Core Value Proposition:** Zero-friction nutrition transparency. 

## 3. Product Development Process
We approached this with a rapid MVP mindset, focusing on a mobile-first Progressive Web App (PWA) architecture to bypass App Store friction while maintaining a native feel.

*   **Phase 1 (MVP):** Text-based search and Groq-powered AI analysis. Proved the core prompt engineering.
*   **Phase 2 (Multimodal):** Integrated Gemini Vision API, allowing users to upload photos of ingredient labels.
*   **Phase 3 (Gamification & Retention):** Built out user profiles, streaks, achievements, and scan history to drive Day-7 retention.
*   **Phase 4 (UX Overhaul):** Conducted user testing that revealed high friction in onboarding. Executed a radical UI simplification.

## 4. Key Strategic Decisions & Trade-offs

### A. UX Simplicity vs. Power User Customization
**The Challenge:** We wanted the AI to give highly personalized advice (e.g., tailored for Diabetes or Heart Health), but asking users to configure this on the home screen created immediate friction. 
**The Decision:** We traded upfront customization for zero-friction onboarding. We auto-defaulted all new users to a "General Health" goal in the background, allowing them to scan a product within 2 seconds of opening the app. The personalization settings were moved to a Profile page for power users.

### B. Live WebRTC vs. Native OS Camera (100% Reliability)
**The Challenge:** The industry standard for barcode scanners is a live video viewfinder. However, building this on the mobile web using WebRTC (`getUserMedia`) proved incredibly fragile. In-app browsers (Instagram, WhatsApp) often block it for security, and multi-lens Android phones frequently crashed the stream.
**The Decision:** A scanner that fails 30% of the time destroys user trust. We made the tough call to abandon the "cool" live video feed and pivoted to using a native OS file picker (`<input capture="environment">`). This hands the camera control to the phone's native OS, guaranteeing 100% cross-device reliability and bypassing all browser permission blockers.

### C. Infrastructure Constraints vs. AI Performance
**The Challenge:** We deployed the backend on Vercel's free tier, which enforces a strict 10-second timeout on serverless functions. High-resolution image analysis via Gemini often exceeded this limit, throwing 504 Gateway errors.
**The Decision:** We prioritized speed over maximum resolution. We implemented client-side image compression (capping images at 800px) before uploading, and explicitly re-routed traffic to the `gemini-2.0-flash-lite` model. We traded a marginal loss in image detail for a lightning-fast, crash-free user experience.

### D. The Platform Pivot Debate (Web App vs. WhatsApp Bot)
**The Challenge:** To achieve the absolute lowest friction, we debated abandoning the web app entirely and pivoting to a WhatsApp bot where users just text a photo of a product.
**The Decision:** We evaluated the trade-offs. A WhatsApp bot would have zero UI friction, but official Meta API costs scale poorly, and we would lose our core retention loops (streaks, badges, visual charts). We decided to stick to a highly optimized PWA to maintain control over the UX and unit economics.

## 5. Success Metrics & KPIs (To Be Measured)
To validate product-market fit, we are tracking:
*   **Activation:** Time-to-first-scan (Goal: < 5 seconds).
*   **Engagement:** Average scans per session (Goal: > 3 products).
*   **Retention:** D1 and D7 return rates driven by the Streak system.
*   **Technical Health:** 504 Timeout Error Rate (Goal: < 1%).

## 6. Next Steps & Vision
The immediate next phase involves establishing **Growth Loops**. We plan to implement a social sharing feature where users can share a visually stunning "Verdict Card" to Instagram Stories when they find a surprisingly unhealthy product, driving organic viral acquisition.
