---
name: Luminous Integrity
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#414845'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#717974'
  outline-variant: '#c1c8c3'
  surface-tint: '#426558'
  primary: '#000b07'
  on-primary: '#ffffff'
  primary-container: '#00261b'
  on-primary-container: '#6b9080'
  inverse-primary: '#a8cfbe'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#110700'
  on-tertiary: '#ffffff'
  tertiary-container: '#311c00'
  on-tertiary-container: '#be7900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ebd9'
  primary-fixed-dim: '#a8cfbe'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#2a4d40'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '900'
    lineHeight: 42px
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system is anchored in a philosophy of "Transparent Precision." It targets health-conscious consumers who value data-driven food transparency. The personality is authoritative yet approachable, bridging the gap between clinical accuracy and lifestyle wellness.

The visual style is a hybrid of **Minimalism** and **Modern Corporate**, utilizing expansive whitespace and high-contrast typography to create a premium, "Series-A" aesthetic. It emphasizes clarity and trust through a rigorous layout, punctuated by occasional **Glassmorphic** overlays to indicate temporary or floating states without breaking the spatial flow. The emotional response should be one of calm confidence—empowering the user with knowledge rather than overwhelming them with data.

## Colors

This design system utilizes a sophisticated, high-contrast palette. The primary **Deep Forest Green** provides a grounded, premium foundation, while the **Vibrant Emerald** accent is reserved strictly for interactive elements and primary calls to action to ensure high conversion and visual hierarchy.

The background is a **Warm Off-White**, chosen to reduce eye strain compared to pure white while maintaining a clean, medical-grade feel. Semantic colors for food safety (Safe, Moderate, Warning) are calibrated for maximum legibility and should be used sparingly in iconography and data visualizations to maintain the brand's minimalist integrity.

## Typography

The typography strategy leverages **Inter** for its systematic, geometric precision. Headings use heavy weights (800-900) with tight tracking to evoke strength and digital-first authority. This creates a rhythmic "texture" that contrasts sharply against the airy, light body text.

Body text is optimized for readability with a generous 1.7 line height, ensuring that dense nutritional information remains accessible. Labels use a bold, tracked-out uppercase style to differentiate administrative or metadata-heavy information from primary narrative content.

## Layout & Spacing

The design system employs a **Fluid Grid** model based on an 8px base unit. Content is organized within a 12-column structure for desktop and a 4-column structure for mobile devices. 

Layouts should favor vertical stackings with significant padding between sections (often 80px or more) to emphasize a "premium" sense of space. Margins are generous, pushing the content toward the center to create a focused, editorial feel. Component-level spacing should follow the 8px rhythm (e.g., 16px, 24px, 32px) to maintain mathematical harmony throughout the interface.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and ultra-soft shadows. The standard surface depth is achieved with a "Soft Ambient" shadow: `0 8px 30px rgba(0,0,0,0.04)`. This creates a subtle lift without the "heaviness" of traditional skeuomorphism.

**Glassmorphism** is applied exclusively to floating UI elements like navigation bars on scroll, tooltips, or modal overlays. These elements use a background blur (12px to 20px) and a semi-transparent white fill (`rgba(255, 255, 255, 0.7)`), paired with a thin 1px border of `rgba(255, 255, 255, 0.5)` to simulate a premium glass finish.

## Shapes

The shape language is "Calculated Softness." Standard components use a **0.5rem (8px)** corner radius to feel approachable yet structured. For larger container elements like cards or modals, a **1rem (16px)** radius is preferred. 

Interactive elements like primary buttons and tags may use a pill-shape (full rounding) to differentiate them from static content containers. Icons should follow a 2px stroke weight with slightly rounded terminals to match the typography.

## Components

### Buttons
Primary buttons use the Emerald accent (#10b981) with white text and a pill-shaped radius. They should feature a subtle 10% dark overlay on hover. Secondary buttons use a Forest Green outline with a 1px weight.

### Cards
Cards are the primary vehicle for food data. They feature the standard soft shadow, a white background, and a 1px border in a very light gray (#E5E7EB) to define edges against the off-white background.

### Input Fields
Fields use the Warm Off-White background with a 1px border that transitions to Emerald on focus. Labels should always sit above the field in the `label-caps` style.

### Chips & Badges
Used for nutritional tags (e.g., "Organic," "Non-GMO"). These use high-contrast combinations: light tints of semantic colors with dark-toned text to ensure glanceability.

### AI Insight Panel
A specialized component using a Glassmorphic background and a subtle emerald-to-teal gradient border to signify "AI-driven" transparency data.