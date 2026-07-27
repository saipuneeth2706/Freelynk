---
name: FreeLynk
description: "A freelancing marketplace where light and motion guide attention without decoration."
colors:
  primary: "#0A29FF"
  primary-light: "#38bdf8"
  secondary: "#7B3FE4"
  secondary-light: "#c084fc"
  background: "#141414"
  surface: "#252525"
  surface-raised: "#343434"
  surface-muted: "#454545"
  foreground: "#fafafa"
  foreground-muted: "#a3a3a3"
  foreground-subtle: "#808080"
  border: "rgba(255,255,255,0.10)"
  border-strong: "rgba(255,255,255,0.15)"
  destructive: "#e74c3c"
  freelancer-blue: "#0A29FF"
  freelancer-sky: "#38bdf8"
  freelancer-indigo: "#6366f1"
  employer-violet: "#7B3FE4"
  employer-lavender: "#c084fc"
  employer-purple: "#a855f7"
  card-dark: "#120F17"
  card-mid: "#1B1722"
  card-light: "#2F293A"
  warm-amber: "#f59e0b"
typography:
  display:
    fontFamily: "Google Sans Flex, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Google Sans Flex, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Google Sans Flex, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Google Sans Flex, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Google Sans Flex, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  4xl: "28px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "14px 30px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "14px 30px"
  card:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.3xl}"
    padding: "28px"
  input:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# Design System: FreeLynk

## 1. Overview

**Creative North Star: "The Quiet Engine"**

High-tech precision with calm, intentional restraint. Every glow, shader, and transition feels hand-placed, not generated. The system communicates capability through darkness and light — surfaces recede into near-black, and color appears only where it matters: interactive states, brand accents, and the animated glow effects that make the interface feel alive.

This is a product UI that borrows the confidence of premium dark-mode tools (Linear, Vercel) but adds a layer of craft through WebGL shader backgrounds, specular-highlight buttons, and animated border glow. The aesthetic rejects the AI-default cream-and-glass look entirely — depth comes from light itself, not from frosted panels or gradient overlays.

**Key Characteristics:**
- Near-black canvas with electric blue as the sole primary accent
- WebGL-powered interactive elements (shaders, specular highlights, glow borders)
- Generous spacing and confident typography at a fixed rem scale
- Light-based depth: glow, luminance, and border animation instead of drop shadows
- Calm motion: 150–300ms transitions, no bounce, no orchestration

## 2. Colors

The palette is achromatic neutrals plus one saturated primary. Color appears only on interactive elements and brand moments — everything else stays monochrome.

### Primary
- **Electric Blue** (#0A29FF): The hero accent. Used on the WebGL background glow, primary CTAs, active states, and the freelancer role glow. This is the only color that carries the brand identity.
- **Sky Blue** (#38bdf8): Secondary tone within the freelancer role glow. Used as a lighter companion to Electric Blue in gradient contexts.
- **Indigo** (#6366f1): Tertiary tone in the freelancer role glow. Adds depth to blue gradient compositions.

### Secondary
- **Violet** (#7B3FE4): Employer role accent. Used on the employer card glow and employer-specific UI. Distinct from the primary blue to differentiate the two user roles.
- **Lavender** (#c084fc): Lighter companion in the employer glow gradient.
- **Purple** (#a855f7): Tertiary tone in the employer role glow.

### Neutral
- **Void** (#141414): The deepest background. The canvas everything sits on.
- **Surface** (#252525): Elevated surfaces — cards, panels, modals.
- **Surface Raised** (#343434): Active or focused surfaces within elevated contexts.
- **Surface Muted** (#454545): Subtle differentiation within surface layers.
- **Foreground** (#fafafa): Primary text. High contrast against dark backgrounds.
- **Foreground Muted** (#a3a3a3): Secondary text, descriptions, hints.
- **Foreground Subtle** (#808080): Disabled states, tertiary labels.
- **Border** (rgba(255,255,255,0.10)): Default borders, dividers.
- **Border Strong** (rgba(255,255,255,0.15)): Input borders, focused states.

### Named Rules
**The 10% Rule.** The primary accent (Electric Blue) appears on ≤10% of any given screen. Its rarity is what makes it powerful. When every element is blue, none of them are.

**The Role Color Rule.** Freelancer = blue family (#0A29FF, #38bdf8, #6366f1). Employer = violet family (#7B3FE4, #c084fc, #a855f7). These palettes are never mixed on the same surface.

## 3. Typography

**Display Font:** Google Sans Flex (with system-ui fallback)
**Body Font:** Google Sans Flex (same family, different weights)
**Label/Mono Font:** Google Sans Flex (unified type system)

**Character:** A single geometric sans-serif carries the entire hierarchy. Confidence comes from weight and scale contrast, not from font pairing. The type system is intentionally restrained — no display fonts, no serifs, no decorative faces. Google Sans Flex has the geometric precision and optical balance that matches the "quiet engine" philosophy.

### Hierarchy
- **Display** (500 weight, clamp(2.5rem, 6vw, 4.5rem), line-height 1.1): Hero headlines on landing pages. The largest text on screen, used sparingly.
- **Headline** (600 weight, 2.25rem, line-height 1.2): Section headings, page titles. Clear hierarchy below display.
- **Title** (600 weight, 1.25rem, line-height 1.3): Card titles, modal headings, component labels.
- **Body** (400 weight, 1rem, line-height 1.6): Descriptions, paragraphs, UI text. Max line length 65–75ch for prose.
- **Label** (500 weight, 0.875rem, letter-spacing 0.01em): Buttons, navigation, form labels, metadata.

### Named Rules
**The Fixed Scale Rule.** Type sizes are fixed rem values, not fluid clamp for everything. Only the display hero uses clamp for viewport responsiveness. Product UI is viewed at consistent DPI — fluid h1 that shrinks in a sidebar looks worse, not better.

**The Single Family Rule.** One typeface carries the entire hierarchy. Weight and size create all the contrast needed. Pairing fonts adds noise without adding meaning in a product context.

## 4. Elevation

This system uses **light-based depth** — no traditional drop shadows on cards or surfaces. Depth is conveyed through:

1. **Tonal layering:** Background → Surface → Surface Raised, each step lighter, creating visual hierarchy through luminance.
2. **Border glow:** Animated conic-gradient borders that respond to cursor proximity. The glow IS the shadow — it creates a luminous halo that lifts elements off the canvas.
3. **WebGL specular highlights:** The primary CTA button uses a real-time shader that simulates light reflecting off a metallic surface. The "shadow" is the absence of the specular highlight.
4. **Ambient box-shadow (minimal):** BorderGlow components use a multi-layer box-shadow for a subtle ambient glow, but this is part of the glow effect, not a traditional elevation shadow.

### Shadow Vocabulary
- **Glow Halo** (BorderGlow multi-layer): Used on role selection cards and interactive surfaces. A 7-layer box-shadow that creates a diffuse colored glow around the element.
- **Specular Button** (WebGL shader): The primary CTA. A real-time GLSL shader that simulates a metallic button reflecting ambient light. No CSS shadow needed.
- **Inset Highlight** (SpecularButton: `inset 0 1px 0 rgba(255,255,255,0.04)`): Subtle top-edge highlight on buttons for a beveled look.

### Named Rules
**The Light-Source Rule.** Every luminous effect (glow, specular, highlight) has a consistent light direction — typically top-left or cursor-following. Light never comes from multiple directions on the same element.

## 5. Components

### Buttons
- **Shape:** Gently curved (18px radius default, configurable 12–24px)
- **Primary (SpecularButton):** WebGL shader renders a metallic surface with cursor-following specular highlight. Text color #f5f5f5, background transparent with subtle white tint. Shadow: inset highlight + 8px ambient drop.
- **Hover / Focus:** Specular highlight intensifies with cursor proximity. Active state: scale(0.97) with 150ms ease-out. Focus: 2px outline offset 3px.
- **Sizes:** sm (text 0.85rem, px-22 py-10), md (text 1rem, px-30 py-14), lg (text 1.15rem, px-10 py-18).

### Cards / Containers
- **Corner Style:** Gently curved (20–28px radius, depending on context)
- **Background:** Card Dark (#120F17) for content surfaces, Surface (#252525) for elevated panels
- **Shadow Strategy:** Light-based depth — BorderGlow animated borders instead of drop shadows
- **Border:** 1px transparent by default; animated conic-gradient border appears on hover/sweep
- **Internal Padding:** 28px (p-7) standard, 32px (p-8) for spacious layouts

### BorderGlow (Signature Component)
An animated border that reveals a mesh-gradient glow when the cursor approaches the card edge. Uses a conic-gradient mask that rotates to follow the cursor angle. The glow sweeps in on mount (autoAnimate) and follows hover. This is the primary elevation mechanism — it replaces traditional shadows with light.

### SpecularButton (Signature Component)
A WebGL-powered button with a real-time GLSL shader that simulates a metallic surface reflecting ambient light. The specular highlight follows the cursor within a configurable proximity radius. Uses OGL for GPU rendering. This is the hero CTA component — it signals premium craft.

### Inputs / Fields
- **Style:** Semi-transparent white background (rgba(255,255,255,0.15)), subtle border, 8px radius
- **Focus:** Border becomes more visible, ring color shifts
- **Error / Disabled:** Destructive red for errors, reduced opacity for disabled

### Navigation
- **CardNav (Landing):** GSAP-animated expanding card navigation. Hamburger reveals nav items as expanding cards with background color transitions. Each card has its own bgColor and textColor.
- **Mobile:** Full-width cards stacked vertically. Desktop: horizontal expansion from button.

### TextBlockEffect (Signature Component)
A GSAP ScrollTrigger-based text reveal animation. Text lines are hidden behind overlay boxes that scale down to reveal the text beneath. Creates a dramatic "unveiling" effect for hero headlines.

## 6. Do's and Don'ts

### Do:
- **Do** use the primary Electric Blue (#0A29FF) sparingly — it should appear on ≤10% of any screen. Its rarity is what makes it powerful.
- **Do** use BorderGlow on interactive cards and surfaces to create light-based depth instead of drop shadows.
- **Do** keep the near-black canvas (#141414) as the dominant background. The darkness IS the design.
- **Do** use fixed rem sizes for product UI type, with clamp only for the hero display heading.
- **Do** match the role color families: blue for freelancer, violet for employer. Never mix them on the same surface.
- **Do** use GSAP for entrance animations and Lenis for smooth scrolling — these are established motion tools in the codebase.
- **Do** maintain 150–300ms transition durations for state changes. Users are in flow; don't make them wait.

### Don't:
- **Don't** use cream, sand, beige, or warm-tinted backgrounds. The AI-generated slop aesthetic of 2026 is explicitly banned. The canvas is near-black, always.
- **Don't** use gradient text (background-clip: text). Emphasis comes from weight and size, not decorative gradients.
- **Don't** use glassmorphism as a default. Blurs and frosted panels are decorative — depth comes from light-based glow, not glass.
- **Don't** use identical card grids with icon + heading + text. Every card should earn its place through distinct content.
- **Don't** use tiny uppercase tracked eyebrows above every section. This is the saturated AI scaffold — one named kicker is voice; eyebrows on every section is grammar.
- **Don't** use side-stripe borders (border-left > 1px as accent). Never intentional.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding. Numbers earn their place only when the sequence carries real information.
- **Don't** use bounce, elastic, or spring easing. Ease out with exponential curves only.
- **Don't** ship components without hover, focus, active, disabled, and loading states.
- **Don't** use display fonts in UI labels, buttons, or data. Google Sans Flex carries the entire hierarchy.
- **Don't** reinvent standard affordances for flavor. Custom scrollbars, weird form controls, non-standard modals — the tool should disappear into the task.
