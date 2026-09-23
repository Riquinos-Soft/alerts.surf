<script setup lang="ts">
import { onMounted, ref } from 'vue'

import HeroSection from './components/HeroSection.vue'
import LandingFooter from './components/LandingFooter.vue'
import LandingHeader from './components/LandingHeader.vue'
import PricingPreview from './components/PricingPreview.vue'
import VisionShowcase from './components/VisionShowcase.vue'

type ApplicationStatus = {
  status: 'ok'
  database: 'ok'
}

const message = ref('Checking alerts.surf status...')
const isHealthy = ref(false)
const isLoading = ref(true)

function isHealthyStatus(value: unknown): value is ApplicationStatus {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const status = value as Record<string, unknown>
  return status.status === 'ok' && status.database === 'ok'
}

onMounted(async () => {
  try {
    const response = await fetch('/api/status')
    if (!response.ok) {
      throw new Error('Status endpoint is unavailable')
    }

    const status: unknown = await response.json()
    const healthy = isHealthyStatus(status)
    isHealthy.value = healthy
    message.value = healthy
      ? 'alerts.surf is running'
      : 'alerts.surf is unavailable'
  } catch {
    isHealthy.value = false
    message.value = 'alerts.surf is unavailable'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="landing-shell">
    <LandingHeader
      :status-message="message"
      :is-healthy="isHealthy"
      :is-loading="isLoading"
    />

    <main>
      <HeroSection />
      <VisionShowcase />
      <PricingPreview />
    </main>

    <LandingFooter
      :status-message="message"
      :is-healthy="isHealthy"
    />
  </div>
</template>
