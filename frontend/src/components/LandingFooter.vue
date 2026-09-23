<script setup lang="ts">
defineProps<{
  statusMessage: string
  isHealthy: boolean
}>()
</script>

<template>
  <footer class="landing-footer">
    <div class="container footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="brand-text">alerts<span class="dot">.</span>surf</span>
          <p class="brand-motto">
            Precision ocean forecasting, interactive 3D telemetry, and agentic intelligence for surfers worldwide.
          </p>
        </div>

        <div class="footer-nav">
          <div class="nav-col">
            <span class="col-title">Product</span>
            <a href="#forecast-showcase" class="col-link">Intelligence</a>
            <a href="#agent-vision" class="col-link">Agentic AI</a>
            <a href="#pricing" class="col-link">Pricing</a>
          </div>
          <div class="nav-col">
            <span class="col-title">Telemetry</span>
            <span class="footer-status-line">
              <span
                class="status-beacon"
                :class="{ healthy: isHealthy, degraded: !isHealthy }"
                aria-hidden="true"
              />
              <span class="status-summary">{{ statusMessage }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} alerts.surf. Crafted for surfers.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.landing-footer {
  border-top: 1px solid var(--border-subtle);
  background: #ffffff;
  padding: 4rem 0 2.5rem;
  margin-top: auto;
}

.footer-top {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  justify-content: space-between;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .footer-top {
    flex-direction: row;
    align-items: flex-start;
  }
}

.footer-brand {
  max-width: 24rem;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.dot {
  color: var(--accent-blue);
}

.brand-motto {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0.75rem 0 0;
}

.footer-nav {
  display: flex;
  gap: 3.5rem;
}

.nav-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.col-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.col-link {
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.col-link:hover {
  color: var(--accent-blue);
}

.footer-status-line {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  color: var(--text-subtle);
}

.copyright {
  margin: 0;
}
</style>
