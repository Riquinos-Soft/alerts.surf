## Why

The current dark landscape landing page lacks dynamic visual energy, realistic surf imagery, and fluid animations. Redesigning the landing page to feature a vibrant, light aesthetic, smooth animations, interactive 3D elements (powered by Three.js or lightweight WebGL canvas effects), real surf photography, an interactive mobile app mockup container, and standard Vant UI components elevates user engagement and clearly communicates the premium experience of `alerts.surf`.

## What Changes

- **Lighter, energetic visual aesthetic**: Transition from dark mode to a bright, clean, coastal theme (ocean blues, sandy whites, crisp typography).
- **Realistic surf photography**: High-quality ocean/surf visuals with subtle parallax and motion.
- **3D interactive ocean / wave visualization**: Interactive 3D/canvas wave simulation using Three.js / WebGL.
- **Vant UI integration**: Standardize UI elements (buttons, badges, tabs, cards, dialogs, swipe carousels) using Vant UI (`vant`).
- **Interactive App Mockup**: Embedded realistic mobile mockup showing alerts, spot reports, and quiver matching powered by Vant components.

## Capabilities

### Modified Capabilities
- `welcome-landing`: Redesign the landing page to feature a light aesthetic, realistic surf visuals, interactive 3D wave animation, Vant UI integration, and an interactive mobile app mockup.

## Impact

- **Frontend Dependencies**: Introduces `vant` (Vant 4 for Vue 3) and `three` (with `@types/three`).
- **Frontend Components**: Modernizes `HeroSection.vue`, `VisionShowcase.vue`, `PricingPreview.vue`, and landing page styles to a light palette with 3D canvas and Vant UI components.
- **Tests**: Updates Vitest specs to reflect the updated component tree and interactive mockup.
