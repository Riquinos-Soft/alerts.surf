<script setup lang="ts">
// Pricing preview component with Vant UI
</script>

<template>
  <section id="pricing" class="pricing-section" aria-labelledby="pricing-title">
    <div class="container">
      <div class="pricing-intro">
        <div class="badge-pill active">Radically Fair Pricing</div>
        <h2 id="pricing-title" class="pricing-title">
          World-class surf forecasting, <span class="gradient-text">made accessible.</span>
        </h2>
        <p class="pricing-subtitle">
          Traditional forecast platforms charge exorbitant fees for bloated video player networks.
          We deliver raw ocean intelligence and agentic power at a fraction of the cost.
        </p>
      </div>

      <div class="pricing-grid">
        <!-- Tier 1: Free -->
        <div class="glass-panel pricing-card">
          <div class="card-tier">Free Tier</div>
          <div class="card-price">
            <span class="currency">€</span>
            <span class="amount">0</span>
            <span class="frequency">forever</span>
          </div>
          <p class="card-tagline">Essential forecast for weekend sessions and casual surfers.</p>

          <ul class="feature-list" aria-label="Free features">
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>3-day multi-model forecast</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>Core spot ratings (0–10 score)</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>Hourly wind and tide curves</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>1 spot alert notification</span>
            </li>
          </ul>

          <van-button
            type="default"
            round
            block
            class="card-btn"
          >
            Get Started Free
          </van-button>
        </div>

        <!-- Tier 2: Pro -->
        <div class="glass-panel pricing-card featured">
          <div class="featured-badge">
            <van-tag type="danger" round size="medium">MOST POPULAR</van-tag>
          </div>
          <div class="card-tier">Pro Forecaster + Agent</div>
          <div class="card-price">
            <span class="currency">€</span>
            <span class="amount">2.99</span>
            <span class="frequency">/ month</span>
          </div>
          <p class="card-tagline">Unlimited hyper-local intelligence and your personal AI surf caddy.</p>

          <ul class="feature-list" aria-label="Pro features">
            <li class="feature-item highlight">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span><strong>Agentic Voice & Chat</strong> quiver assistant</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>16-day extended ensemble forecast</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>Unlimited custom spot triggers</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>Dual-swell direction & bathymetry mapping</span>
            </li>
            <li class="feature-item">
              <span class="check-icon" aria-hidden="true">✓</span>
              <span>Offline-ready PWA & instant web app</span>
            </li>
          </ul>

          <van-button
            type="primary"
            round
            block
            color="linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)"
            class="card-btn"
          >
            Start 14-Day Free Trial
          </van-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-section {
  padding: 4rem 0 5rem;
}

.pricing-intro {
  text-align: center;
  max-width: 44rem;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pricing-title {
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0;
  color: var(--text-main);
}

.pricing-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 54rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
    align-items: stretch;
  }
}

.pricing-card {
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 1.75rem;
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 15px 35px -10px rgba(12, 35, 56, 0.08);
}

.pricing-card.featured {
  background: linear-gradient(160deg, #ffffff 0%, #f0f7fc 100%);
  border-color: rgba(0, 119, 182, 0.3);
  box-shadow: 0 20px 45px -10px rgba(0, 119, 182, 0.15);
}

.featured-badge {
  position: absolute;
  top: -12px;
  right: 2rem;
}

.card-tier {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-blue);
}

.amount {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.04em;
  line-height: 1;
}

.frequency {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.card-tagline {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0 0 1.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex-grow: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.feature-item.highlight {
  color: var(--text-main);
}

.check-icon {
  color: #06d6a0;
  font-weight: 800;
}

.card-btn {
  width: 100%;
  font-weight: 600;
}
</style>
