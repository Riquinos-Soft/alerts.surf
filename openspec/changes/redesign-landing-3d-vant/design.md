## Context

See proposal.md - Why.
The current landing page uses custom dark-mode CSS with minimal animation. We are transforming it to a light, sunny ocean aesthetic, embedding high-quality surf imagery, an interactive 3D wave canvas using Three.js, mobile UI elements from Vant UI (`vant`), and an interactive mobile device mockup showing the real application feeling.

## Goals / Non-Goals

**Goals:**
- Install and configure `vant` for mobile-optimized UI components (Buttons, Tabs, Tags, Badges, Cards, Swipe).
- Integrate `three` for a lightweight, performant 3D animated ocean wave mesh in the hero section that responds to mouse/touch movement.
- Adopt a bright coastal color palette (crisp whites, ocean blues, sandy warm accents, turquoise highlights).
- Build an interactive Mobile Device Mockup showcasing realistic spot reports, wave charts, and AI assistant dialogues using Vant components.
- Include real, high-resolution surf and wave imagery with graceful fallbacks.
- Maintain full responsiveness across mobile, tablet, and desktop viewports without degrading performance.

**Non-Goals:**
- Heavy photorealistic 3D rendering with large GLTF model assets (we will use dynamic procedural shader/geometry wave meshes in Three.js to keep bundle lightweight and fast).
- Modifying backend APIs or database schemas.

## Decisions

### 1. Vant UI (Vue 3) Integration
- **Decision**: Add `vant` package and import required Vant UI components (Button, Tag, Badge, Swipe, Cell, Card) into landing sections and the interactive app mockup.
- **Alternatives considered**:
  - *Tailwind UI / Shadcn Vue*: More generic, but Vant provides an authentic mobile-app feel with rich touch-first interaction paradigms.

### 2. Lightweight Procedural Three.js Wave Surface
- **Decision**: Create a dedicated Vue component (`WaveCanvas3D.vue`) managing a Three.js scene with a low-overhead plane geometry displaced by sinusoidal ocean math, ambient/directional lighting, and pointer interaction.
- **Alternatives considered**:
  - *Static CSS waves*: Lacks true 3D depth and interactive fluid dynamics.
  - *Large GLTF 3D ocean models*: Exceeds target bundle budget and slow initial page loads.

### 3. Interactive Phone Mockup Component
- **Decision**: Build `AppMockupFrame.vue` containing interactive tabs powered by Vant components (Spots radar, Tide curve, AI Quiver Advisor) to let visitors interact directly with the app prototype on the landing page.
- **Alternatives considered**:
  - *Static screenshot image*: Does not convey interactivity or responsive fidelity.

## Risks / Trade-offs

- **[Risk] WebGL/Three.js performance on lower-end devices** → **Mitigation**: Include fallback 2D gradient/canvas rendering, limit pixel ratio to `Math.min(window.devicePixelRatio, 2)`, and pause animation loop when canvas is offscreen using `IntersectionObserver`.
- **[Risk] Vant CSS overriding global styles** → **Mitigation**: Scope Vant theme CSS variables to modern bright ocean theme tokens in `style.css`.
