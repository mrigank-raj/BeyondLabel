# BeyondLabel — Product Requirements Document
Version: 1.0
Author: Mrigank Raj Chouhan
Date: June 2026
Status: Draft

## 1. Problem Statement

Health-conscious Indian consumers aged 18–35 are being 
systematically misled by front-of-pack claims on packaged 
food products — "High Protein," "Zero Sugar," "Natural," 
"Healthy" — while FSSAI regulations remain too weak to 
enforce honest labeling. Existing solutions like FactsScan 
and Yuka rely on barcode databases and return a numerical 
score, but do not explain why a product is misleading, do 
not personalize analysis to the user's health goal, and do 
not catch India-specific manipulation tactics like soy 
protein inflation, jaggery marketed as no refined sugar, or 
serving size deception.

## 2. Goals

| # | Goal | Type | Target |
|---|------|------|--------|
| G1 | User receives a clear goal-specific verdict | User Goal | 100% of analyses return verdict within 10 seconds |
| G2 | User understands WHY a claim is misleading | User Goal | Every verdict includes plain-English explanation |
| G3 | Users avoid at least one misleading product per session | User Goal | 70% report changed decision |
| G4 | Establish BeyondLabel as PM portfolio proof-of-work | Business Goal | MVP live within 3 weeks |
| G5 | Demonstrate AI-powered product thinking | Business Goal | Visibly different from FactsScan and Yuka |

## 3. Non-Goals

- Restaurant or homemade food analysis
- Calorie tracker or diet planner
- Barcode scanner with product database
- Cosmetics or personal care products
- Social features, reviews, or community ratings

## 4. Target Users

Primary Persona: The Motivated but Misled
- Age: 18–30
- Profile: College student or young professional, actively 
  trying to eat better, goes to gym or follows a fitness goal, 
  shops on Blinkit, Amazon, or Flipkart
- Pain: Knows labels exist, wants to read them, does not have 
  the nutritional expertise to decode them
- Current behavior: Googles reviews, watches YouTube 
  (often sponsored), or just guesses
- Quote: I know Pintola protein oats has whey on the front 
  but I do not know if it is actually whey or just soy 
  in disguise

Secondary Persona: The Health-Anxious Parent
- Age: 35–50
- Profile: Parent buying packaged food for family, concerned 
  about hidden sugar, preservatives, adulterants
- Pain: Cannot decode ingredient lists
- Current behavior: Asks friends, reads WhatsApp forwards

## 5. User Stories

US1: As a health-conscious user I want to type a product name 
and select my health goal so that I receive an honest 
personalized verdict without needing nutritional expertise

US2: As a user I want to upload a photo of a food label so 
that I can analyze products I find in a physical store

US3: As a user I want the verdict to explain WHY a claim is 
misleading in plain English so that I learn something and 
make better decisions in the future

US4: As a user I want a clear Trustworthy / Question It / 
Avoid verdict so that I can make a fast decision

US5: As a user I want to see a better alternative suggested 
when a product fails so that I know what to buy instead

US6: As a user trying to build muscle I want the analysis to 
flag low biological value protein sources so that I do not 
waste money on soy-inflated protein products

US7: As a diabetic user I want the analysis to flag hidden 
sugars regardless of what they are called so that I can 
protect my health

US8: As a user trying to lose fat I want the analysis to 
expose serving size manipulation so that I understand the 
actual caloric impact

US9: As a user who searches for an obscure local brand I want 
to receive an honest limited data available message so that 
I am not misled by a hallucinated analysis

US10: As a user on mobile I want the interface to work cleanly 
on a small screen so that I can use it while standing in a store

## 6. Feature Requirements

### P0 — Must Have
| ID | Feature | Acceptance Criteria |
|----|---------|---------------------|
| F1 | Product name text search | Returns verdict within 10 seconds |
| F2 | Health goal selector | Required before analysis |
| F3 | AI-powered label analysis | Identifies protein source quality, sugar manipulation, serving size deception |
| F4 | Plain-English verdict | Trustworthy / Question It / Avoid |
| F5 | Explanation of WHY | 2-3 sentences on specific manipulation tactic |
| F6 | Better alternative suggestion | One specific alternative when verdict is negative |
| F7 | Mobile-responsive UI | Functional on screens 375px and above |

### P1 — Should Have
| ID | Feature | Acceptance Criteria |
|----|---------|---------------------|
| F8 | Photo label upload | OCR extracts text, same analysis pipeline runs |
| F9 | India-specific manipulation flags | Detects soy inflation, jaggery sugar trick, serving size tricks |
| F10 | Analysis history | Last 5 products saved in session |
| F11 | Share verdict | User can copy or share verdict as text |

### P2 — Future
| ID | Feature |
|----|---------|
| F12 | Barcode scan via camera |
| F13 | Browser extension for Amazon and Flipkart |
| F14 | User accounts and saved products |
| F15 | Community verified claims |

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Analysis completion rate | More than 80% |
| Time to verdict | Less than 10 seconds |
| Return usage within 7 days | More than 30% |
| Changed purchase decision | More than 70% report avoiding a product |

## 8. Competitive Landscape

| Product | Input | Analysis | Explains WHY | India-Specific | Goal Personalization |
|---------|-------|----------|-------------|----------------|---------------------|
| Yuka | Barcode | Database score | No | No | No |
| FactsScan | Barcode | Database score | No | Partial | No |
| TruthLabel | Text/Photo | Basic AI | No | No | No |
| BeyondLabel | Text + Photo | AI reasoning | Yes | Yes | Yes |

## 9. Open Questions

| # | Question | Blocking? |
|---|----------|-----------|
| OQ1 | Groq vs Gemini — which gives better nutritional analysis for text? | Yes |
| OQ2 | How to handle products AI has no knowledge of? | Yes |
| OQ3 | Should goal selector be mandatory or optional? | No — default to General Health |
| OQ4 | What legal disclaimer is needed? | No — add footer disclaimer |
| OQ5 | How to prevent hallucination on obscure Indian brands? | Yes |

## 10. Timeline

Phase 1 — MVP: Text search + goal selector + AI analysis + 
verdict output + mobile UI — complete

Phase 2 — Enhanced Input: Photo upload + OCR + India-specific 
manipulation detection + session history — in progress

Phase 3 — Portfolio Polish: Case study + user research 
synthesis + PRD packaging for recruiter submission

## 11. Core Design Principle

Our job is not to help users find healthy products. 
Our job is to help users reject dishonest ones.
