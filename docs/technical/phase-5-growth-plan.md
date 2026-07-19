# Phase 5: Growth Loops, Retention, and Referrals

You are completely right—the actual Phase 5 is about turning this app into an engine that grows itself. We need to implement viral growth loops (social sharing) and deep retention mechanics (gamification) so that every user brings in 2 more users.

## Proposed Changes

### 1. The Viral Verdict Share Loop
Currently, sharing a verdict just copies dry text. We will upgrade the `handleShare` function in `VerdictCard.jsx` to generate highly engaging, emoji-rich "clickbait" that leverages the native mobile Share Sheet (direct to WhatsApp/Instagram/SMS).
*   *Example output:* "🚨 BeyondLabel just analyzed my Cheetos... Verdict: THINK TWICE. 👎 See what you're actually eating here: [BeyondLabel Link]"

### 2. "Health Advocate" Gamification (Referrals)
We will add a new tier of achievements to the `InsightsDashboard.jsx`. 
*   **The Hook:** Users will see a locked badge called "Health Advocate".
*   **The Trigger:** To unlock it, they must share the app or a verdict with 1 friend. 
*   **The Implementation:** We will track "share intent" via local storage and visually unlock the badge with a satisfying animation once they hit the share button.

### 3. Profile Invite Engine
We will add a dedicated "Invite a Friend" card to the `ProfilePage.jsx` and `SideNavBar.jsx` so the referral loop is always accessible, not just after a scan.

## Open Questions

> [!IMPORTANT]
> **Share Mechanism Design**
> Generating actual image files (like an Instagram Story sticker) from HTML requires installing heavy third-party libraries (like `html-to-image`). 
> 
> **Question:** Should we stick to the lightweight Native Mobile Text Share (which instantly pre-populates WhatsApp/SMS with a link and emojis), OR do you want me to install an image-generation library so they can share a screenshot of the actual card to Instagram? (Text is faster to build and often converts better via direct messaging).

## Execution Plan
1. Update `VerdictCard.jsx` share function. (Completed partially: viral text added)
2. Update `InsightsDashboard.jsx` to include the new "Health Advocate" referral badge and track sharing stats in `localStorage`. (Completed partially: badge added)
3. Add a dedicated Invite component to `ProfilePage.jsx`. (Pending future iteration)
