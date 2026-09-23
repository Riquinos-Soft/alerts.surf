<script setup lang="ts">
import { onMounted, ref } from 'vue'

import HeroSection from './components/HeroSection.vue'
import LandingFooter from './components/LandingFooter.vue'
import LandingHeader from './components/LandingHeader.vue'
import PricingPreview from './components/PricingPreview.vue'
import VisionShowcase from './components/VisionShowcase.vue'
import LoginModal from './components/auth/LoginModal.vue'
import SurferDashboard from './components/dashboard/SurferDashboard.vue'
import { useAuth } from './composables/useAuth'

type ApplicationStatus = {
  status: 'ok'
  database: 'ok'
}

const message = ref('Checking alerts.surf status...')
const isHealthy = ref(false)
const isLoading = ref(true)

const { isAuthenticated } = useAuth()
const isLoginModalOpen = ref(false)

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
      v-if="!isAuthenticated"
      :status-message="message"
      :is-healthy="isHealthy"
      :is-loading="isLoading"
      @openLogin="isLoginModalOpen = true"
    />

    <main v-if="!isAuthenticated">
      <HeroSection />
      <VisionShowcase />
      <PricingPreview />
    </main>

    <SurferDashboard v-else />

    <LandingFooter
      v-if="!isAuthenticated"
      :status-message="message"
      :is-healthy="isHealthy"
    />

    <LoginModal 
      :is-open="isLoginModalOpen" 
      @close="isLoginModalOpen = false" 
      @success="isLoginModalOpen = false"
    />
  </div>
</template>
