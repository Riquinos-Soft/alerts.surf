## 1. Dependencies and Design System Setup

- [x] 1.1 Install `vant` and `three` (along with `@types/three`) in frontend using `bun add`; verify `package.json` contains dependencies and build runs without error.
- [x] 1.2 Update `frontend/src/style.css` with a bright, light coastal ocean color scheme, Vant theme overrides, glassmorphism tokens, and modern typography; verify styling tokens apply in dev preview.

## 2. Interactive 3D Ocean Waves and Visual Assets

- [x] 2.1 Implement `frontend/src/components/WaveCanvas3D.vue` using Three.js procedural wave surface mesh with interactive pointer lighting and mouse-tracking motion; verify component mounts cleanly and tests pass.
- [x] 2.2 Add curated high-resolution real surf photography cards and background imagery assets with responsive image loading and graceful CSS gradients.

## 3. Interactive Mobile App Mockup with Vant UI

- [x] 3.1 Implement `frontend/src/components/AppMockupFrame.vue` integrating Vant UI components (`van-tabs`, `van-tab`, `van-tag`, `van-badge`, `van-card`, `van-button`) demonstrating live spot metrics, tide curves, and AI board quiver recommendation; verify Vitest test asserts rendering of mockup interactive states.
- [x] 3.2 Update `frontend/src/components/HeroSection.vue` to combine the bright typography, 3D wave background, Vant call-to-action buttons, and the interactive app mockup frame; verify Vitest test passes.

## 4. Vision Showcase and Pricing Refresh with Vant UI

- [x] 4.1 Refactor `frontend/src/components/VisionShowcase.vue` and `frontend/src/components/PricingPreview.vue` to use Vant UI components and bright coastal cards with real surf photos; verify Vitest tests pass.
- [x] 4.2 Update `frontend/src/components/LandingHeader.vue` and `LandingFooter.vue` to harmonize with the light theme palette; verify header health beacon and login modal triggers remain fully operational.

## 5. Verification and Strict Validation

- [x] 5.1 Run full frontend test suite (`bun run test` / Vitest), type-check (`vue-tsc`), and production build (`bun run build`); verify zero failures or broken styles.
- [x] 5.2 Run `openspec validate --all --strict` and review git diff to ensure all changes match the spec.
