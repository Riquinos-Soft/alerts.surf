<script setup lang="ts">
defineProps<{
  statusMessage: string
  isHealthy: boolean
  isLoading: boolean
}>()

defineEmits<{
  (e: 'openLogin'): void
}>()
</script>

<template>
  <header class="landing-header">
    <div class="container header-container">
      <div class="brand">
        <div class="logo-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 16C5.5 16 7.5 14 9.5 14C11.5 14 13.5 16 16 16C18.5 16 20.5 14 22 13M2 20C4.5 20 6.5 18 8.5 18C10.5 18 12.5 20 15 20C17.5 20 19.5 18 22 17M3 11C6 11 8 8 11 8C14.5 8 16 12 19 12C20.5 12 21.5 11 22 10.5C21 6 17 3 12 3C7.5 3 4.2 6.2 3 11Z"
              stroke="url(#wave-grad)"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient id="wave-grad" x1="2" y1="3" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0077b6" />
                <stop offset="1" stop-color="#00b4d8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="brand-name">alerts<span class="dot">.</span>surf</span>
      </div>

      <nav class="nav-links" aria-label="Main Navigation">
        <a href="#forecast-showcase" class="nav-link">Intelligence</a>
        <a href="#agent-vision" class="nav-link">Agentic AI</a>
        <a href="#pricing" class="nav-link">Pricing</a>
      </nav>

      <div class="header-right">
        <div class="header-status" aria-label="Platform Health">
          <span
            class="status-beacon"
            :class="{
              healthy: isHealthy && !isLoading,
              degraded: !isHealthy && !isLoading,
              checking: isLoading,
            }"
            aria-hidden="true"
          />
          <span class="status-badge-text" role="status" aria-live="polite">
            {{ statusMessage }}
          </span>
        </div>
        <van-button
          type="primary"
          size="small"
          round
          @click="$emit('openLogin')"
          class="login-btn"
          data-test="login-btn"
          color="linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)"
        >
          Sign In / Entrar
        </van-button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.landing-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 4.125rem;
  margin-bottom: -4.125rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(244, 248, 251, 0.15);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(0, 119, 182, 0.08);
  border: 1px solid rgba(0, 119, 182, 0.2);
}

.brand-name {
  color: var(--text-main);
}

.brand-name .dot {
  color: var(--accent-blue);
}

.nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--accent-blue);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.header-status {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background: #f1f5f9;
  border: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
}

.status-badge-text {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.login-btn {
  font-weight: 600;
  padding: 0 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 119, 182, 0.25);
}
</style>
