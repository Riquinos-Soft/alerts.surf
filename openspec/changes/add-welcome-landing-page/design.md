## Context

The current alerts.surf frontend displays a minimal application status verification message. The active roadmap requires a captivating, high-polish welcome page that communicates platform capabilities and its future vision (agentic voice/chat board manager, precise forecasting, accessible pricing) with Apple-grade aesthetic refinement while respecting existing architectural simplicity.

## Goals / Non-Goals

**Goals:**
- Present an Apple-inspired, premium dark-mode landscape layout featuring refined typography, subtle atmospheric glows, and smooth CSS-driven micro-interactions.
- Showcase the four core product pillars:
  1. **Precision Forecast Intelligence**: Swell height, wave period, wind vector, and condition score.
  2. **Agentic Voice & Chat Assistant Concept**: Interactive preview demonstrating voice/chat board quiver matching and personalized condition queries.
  3. **Custom Surf Alerts**: Configurable notifications for ideal surf sessions.
  4. **Radically Accessible Pricing**: Disruptive, low-barrier pricing model.
- Retain live backend/database operational transparency through an elegant, unobtrusive status beacon.
- Ensure 100% responsiveness from mobile viewports to ultra-wide displays.
- Keep the bundle lean and build times near-instant with zero new external dependencies.

**Non-Goals:**
- Implementing actual speech-to-text or LLM inference engines (this slice focuses on the user-facing landscape and vision preview).
- Integrating payment processing or subscription checkout.
- Introducing heavy UI frameworks (Tailwind, component libraries, or three.js).

## Decisions

### 1. Pure Modern CSS and Native SVG Visuals
- **Decision**: Implement all glassmorphic cards, radiant radial gradients, smooth hover states, and iconography using modern standard CSS (flexbox, CSS grid, backdrop-filter, keyframes) and inline SVGs.
- **Alternatives considered**:
  - *Tailwind CSS*: Requires new devDependencies, build tool configuration, and changes to bundler pipelines without tangible benefit for this focused slice.
  - *Three.js / Canvas 3D*: Excessive bundle weight and battery consumption for a welcome page; CSS gradient mesh and SVG deliver equivalent polish with zero load latency.

### 2. Modular Vue Components for Landing Sections
- **Decision**: Decompose the welcome experience into cohesive, single-responsibility components under `frontend/src/components/`:
  - `LandingHeader.vue`: Brand emblem, navigation cues, and live status pill.
  - `HeroSection.vue`: Atmospheric headline, CTA buttons, and interactive swell radar card.
  - `VisionShowcase.vue`: Product pillars including the conversational agentic board advisor preview.
  - `PricingPreview.vue`: Accessible pricing highlight.
  - `LandingFooter.vue`: Minimalist copyright, links, and system status detail.
- **Alternatives considered**:
  - *Single monolithic App.vue*: Simpler initially, but harder to maintain, test in isolation, and expand when spots or auth views are merged.

### 3. Non-Blocking Status Telemetry
- **Decision**: Continue polling `/api/status` gracefully on mount; if backend is unreachable, display a discrete "System degraded" pill while the marketing and vision content remain completely visible and functional.
- **Alternatives considered**:
  - *Blocking full-page error on API failure*: Unacceptable for a public welcome landing page.

## Risks / Trade-offs

- **[Risk]** Heavy blur and gradient animations can cause stutter on low-power mobile GPUs.
  - **Mitigation**: Use hardware-accelerated transforms (`transform`, `opacity`), avoid continuous background repaints, and respect `prefers-reduced-motion`.
- **[Risk]** Breaking existing status assertions in tests.
  - **Mitigation**: Retain explicit semantic attributes or text content so existing test assertions and health probes continue passing reliably.
