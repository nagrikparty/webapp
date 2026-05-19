# Nagrik Party Cinematic Design Manifesto

This document outlines the core visual, motion, and layout principles for the Nagrik Party platform. It establishes a premium, high-contrast, "scrollytelling" experience that is highly cinematic, responsive, and tactile.

---

## 🎨 Color Palette & Contrast Architecture
- **Canvas (Background)**: Warm Cream (`#F5F1E8`). It feels like raw, documentary-grade parchment.
- **Ink (Foreground)**: Deep Charcoal/Matte Black (`#0A0A0A`). High-contrast readability, absolute legibility.
- **Emergency Accent**: Crimson Red (`#A11212` / `#C21A1A`). Used for indicators, highlight states, interactive callouts, and urgency cues. Never used for generic elements.
- **Shadow Accents**: Indigo Slate (`#0B2553` / `rgba(11, 37, 83, 0.05)`). Derived from the Chakra blue, used for very soft gradients, overlays, and frosted reflections.

---

## 📐 Layout & Grid System (Technical Brutalism)
- **1px Tech Grid**: Use hairline borders (`border-black/10` or `divide-black/10`) to structure components. It feels structured, engineered, and intentional, like a government dashboard.
- **Asymmetry**: Offset grid layouts, large visual anchors on one side balanced by technical metadata on the other.
- **Bento Grid Cards**: Rounded corners (1.5rem / `rounded-3xl`), glassmorphic background (`bg-white/60 backdrop-blur-md`), subtle drop shadows, and nested 1px borders.
- **Atmospheric Film Grain**: A persistent overlay (`opacity-45` to `opacity-55` with `mix-blend-multiply` or `mix-blend-overlay`) that adds cinematic grain to everything, preventing a flat "digital" look.

---

## 🎬 Scroll-Driven Motion & Cinematic Pacing
- **Character/Text Masking**: Headers and quotes shouldn't just fade in; they should reveal character-by-character on scroll, or utilize spring-loaded slide-up masks.
- **Parallax Imagery**: Background and container images should scale or shift vertically on scroll (`scale-105` to `scale-110` with custom scroll-linked Framer Motion transform hooks).
- **Scale-Up Containers**: Content blocks expand slightly or pop out of the grid as they enter the viewport.
- **Blinking Indicators**: Include a pulsing red dot (`animate-pulse`) or flashing caret (`animate-caret`) next to live data to represent active monitoring.

---

## ⚡ Fluid Micro-Interactions
- **Magnetic Buttons**: Buttons have a slight stickiness and hover shift. They scale up slightly, the background slides or fills with a fluid animation, and the cursor snaps to them.
- **Text Sweep on Hover**: Hovering over links sweeps a red underline or slides text up to reveal an active version.
- **Card Interactive Glow**: Hovering over Bento cards creates a subtle lighting/radial glow effect that follows the cursor.
- **Smooth Inertial Scroll**: Smooth scroll behavior enabled globally via Lenis/Framer Motion to ensure cinematic transitions feel natural and heavy.

---

## 🛠️ Implementation Directives (For Agents & Codebases)
1. **Never use generic gradients** or flat solid primary colors.
2. **Every section must have a clear scroll-trigger entry animation** (using `framer-motion` hooks or intersection observers).
3. **Forms must look like official municipal documents**: clean lines, technical monospaced input labels, and high-contrast fields.
4. **All images must have a cinematic filter** (desaturated, slightly contrasted, or framed inside a precise boundary).
