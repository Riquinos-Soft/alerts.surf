## 1. Design Tokens and Header Component

- [x] 1.1 Add atmospheric dark-mode design tokens, glassmorphic surface styles, and keyframe animations in `frontend/src/style.css`; verify frontend builds without CSS errors.
- [x] 1.2 Implement `frontend/src/components/LandingHeader.vue` featuring platform brand mark, navigation anchors, and discreet system health beacon; verify Vitest test asserts health badge states.

## 2. Landscape Hero and Vision Showcase

- [x] 2.1 Implement `frontend/src/components/HeroSection.vue` featuring punchy value messaging, primary action buttons, and simulated swell radar card; verify Vitest test asserts visible metrics and headings.
- [x] 2.2 Implement `frontend/src/components/VisionShowcase.vue` displaying core forecast intelligence and the agentic voice/chat quiver advisor preview; verify Vitest test asserts all showcase pillars render.

## 3. Pricing, Footer, and App Integration

- [x] 3.1 Implement `frontend/src/components/PricingPreview.vue` and `frontend/src/components/LandingFooter.vue`, wire sections into `frontend/src/App.vue`, and connect live `/api/status` polling; verify full landing view renders in browser.
- [x] 3.2 Add comprehensive Vitest test coverage in `frontend/src/App.test.ts` for all landing components, responsive sections, and both operational/degraded status handling; verify all tests pass.

## 4. Verification and Validation

- [x] 4.1 Run `bun run test`, `bun run type-check`, and `bun run build` in `frontend/`; verify zero test failures or type errors.
- [x] 4.2 Run `openspec validate --all --strict` and inspect git diff to ensure no out-of-scope dependencies or files were introduced.

## Verification record (2026-09-23)

- Frontend unit & integration tests: 13/13 Vitest tests passed across 4 test suites (`App.test.ts`, `LandingHeader.test.ts`, `HeroSection.test.ts`, `VisionShowcase.test.ts`).
- Frontend type checking: `vue-tsc --noEmit` passed with 0 errors.
- Production build: `vite build` completed cleanly, bundling 17.86 kB CSS (4.05 kB gzipped) and 78.79 kB JS (29.57 kB gzipped).
- Zero new runtime or dev dependencies added to `package.json`.
- OpenSpec validation: `openspec validate --all --strict` passed cleanly (4 items).
