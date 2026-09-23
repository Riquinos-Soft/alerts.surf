<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import AppMockupFrame from './AppMockupFrame.vue'

const WaveCanvas3D = defineAsyncComponent(() => import('./WaveCanvas3D.vue'))
const canRender3d = typeof WebGL2RenderingContext !== 'undefined'

interface SpotPreview {
  id: string
  name: string
  region: string
  score: string
  quality: string
  swell: string
  period: string
  wind: string
  tide: string
  recommendedBoard: string
}

const spots: SpotPreview[] = [
  {
    id: 'mundaka',
    name: 'Mundaka',
    region: 'Basque Country',
    score: '9.4',
    quality: 'Firing',
    swell: '2.4 m',
    period: '14 s',
    wind: '7 kts Offshore (SSW)',
    tide: 'Low tide rising (+0.8m)',
    recommendedBoard: "6'0\" Round Pin",
  },
  {
    id: 'pantin',
    name: 'Pantín',
    region: 'Galicia',
    score: '8.7',
    quality: 'Clean & Peeling',
    swell: '1.8 m',
    period: '12 s',
    wind: '5 kts Light Cross (E)',
    tide: 'Mid tide falling (+1.4m)',
    recommendedBoard: "5'10\" All-Rounder",
  },
]

const activeSpot = ref<SpotPreview>(spots[0])

function selectSpot(spot: SpotPreview) {
  activeSpot.value = spot
}
</script>

<template>
  <section class="hero-section" aria-labelledby="hero-title">
    <!-- 3D Procedural Wave Background -->
    <WaveCanvas3D v-if="canRender3d" />

    <div class="container hero-container">
      <div class="hero-content">
        <div class="badge-pill active">
          <van-tag type="primary" size="medium" round>✨ Live Ocean Intelligence</van-tag>
        </div>

        <h1 id="hero-title" class="hero-title">
          Know exactly when and where <span class="gradient-text">the ocean turns on.</span>
        </h1>

        <p class="hero-description">
          Hyper-local swell dynamics, 3D ocean simulation, high-resolution wind vectors, and an agentic AI assistant
          that understands your quiver and spots like a local shaper.
        </p>

        <div class="hero-actions">
          <a href="#forecast-showcase" class="btn-primary">
            <span>Explore Intelligence</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#agent-vision" class="btn-secondary">
            <span>Discover Surf Agent</span>
          </a>
        </div>

        <!-- Live Spot Radar Card -->
        <div class="radar-card glass-panel">
          <div class="radar-header">
            <div class="spot-selector" role="tablist" aria-label="Sample Spots">
              <button
                v-for="spot in spots"
                :key="spot.id"
                role="tab"
                :aria-selected="activeSpot.id === spot.id"
                class="spot-tab"
                :class="{ active: activeSpot.id === spot.id }"
                @click="selectSpot(spot)"
              >
                {{ spot.name }}
              </button>
            </div>
            <div class="live-pill">
              <span class="live-indicator" aria-hidden="true" />
              <span>LIVE SWELL TELEMETRY</span>
            </div>
          </div>

          <div class="radar-main">
            <div class="spot-info">
              <span class="spot-region">{{ activeSpot.region }}</span>
              <h2 class="spot-name">{{ activeSpot.name }}</h2>
            </div>
            <div class="score-badge">
              <div class="score-value">{{ activeSpot.score }}</div>
              <div class="score-meta">
                <span class="score-out">/ 10</span>
                <span class="score-condition">{{ activeSpot.quality }}</span>
              </div>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-box">
              <span class="metric-title">Primary Swell</span>
              <div class="metric-val">{{ activeSpot.swell }}</div>
              <span class="metric-sub">Period: {{ activeSpot.period }}</span>
            </div>
            <div class="metric-box">
              <span class="metric-title">Local Wind</span>
              <div class="metric-val text-accent">{{ activeSpot.wind }}</div>
              <span class="metric-sub">Favorable texture</span>
            </div>
            <div class="metric-box">
              <span class="metric-title">Tide Window</span>
              <div class="metric-val">{{ activeSpot.tide }}</div>
              <span class="metric-sub">Optimal window</span>
            </div>
            <div class="metric-box highlighted">
              <span class="metric-title">Agent Recommendation</span>
              <div class="metric-val text-cyan">{{ activeSpot.recommendedBoard }}</div>
              <span class="metric-sub">Matched to conditions</span>
            </div>
          </div>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">100%</span>
            <span class="stat-label">Independent Forecast</span>
          </div>
          <div class="stat-divider" aria-hidden="true" />
          <div class="stat-item">
            <span class="stat-number">15 min</span>
            <span class="stat-label">Model Updates</span>
          </div>
          <div class="stat-divider" aria-hidden="true" />
          <div class="stat-item">
            <span class="stat-number">Voice & Chat</span>
            <span class="stat-label">Agentic Ready</span>
          </div>
        </div>
      </div>

      <!-- App Mockup in right column -->
      <div class="hero-visual" aria-label="Interactive App Experience">
        <AppMockupFrame />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  padding: clamp(5.25rem, 8vw, 6.5rem) 0 3.5rem;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(244, 248, 251, 0.4) 0%, rgba(244, 248, 251, 0.9) 100%);
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (min-width: 1024px) {
  .hero-container {
    grid-template-columns: 1.15fr 0.85fr;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}

.hero-title {
  font-size: clamp(2.3rem, 5.5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0;
  color: var(--text-main);
}

.hero-description {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 36rem;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-subtle);
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-number {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--accent-navy);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: var(--border-subtle);
}

/* Radar visual card */
.radar-card {
  width: 100%;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 15px 35px -10px rgba(12, 35, 56, 0.08);
}

.radar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.spot-selector {
  display: flex;
  gap: 0.35rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 9999px;
}

.spot-tab {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.spot-tab.active {
  background: #ffffff;
  color: var(--accent-blue);
  box-shadow: 0 2px 8px rgba(0, 119, 182, 0.15);
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-blue);
}

.live-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #06d6a0;
  animation: pulse-glow 2s infinite;
}

.radar-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
}

.spot-region {
  font-size: 0.75rem;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.spot-name {
  margin: 0.2rem 0 0;
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-main);
}

.score-badge {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  background: rgba(6, 214, 160, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(6, 214, 160, 0.3);
}

.score-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #059669;
  line-height: 1;
}

.score-meta {
  display: flex;
  flex-direction: column;
}

.score-out {
  font-size: 0.7rem;
  color: var(--text-subtle);
  font-weight: 600;
}

.score-condition {
  font-size: 0.72rem;
  color: #059669;
  font-weight: 700;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.metric-box {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.75rem;
  border-radius: 0.85rem;
  background: #f8fafc;
  border: 1px solid var(--border-subtle);
}

.metric-box.highlighted {
  grid-column: span 2;
  background: rgba(0, 119, 182, 0.04);
  border-color: rgba(0, 119, 182, 0.2);
}

.metric-title {
  font-size: 0.68rem;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.metric-val {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-main);
}

.text-accent {
  color: var(--accent-blue);
}

.text-cyan {
  color: var(--accent-navy);
}

.metric-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}
</style>
