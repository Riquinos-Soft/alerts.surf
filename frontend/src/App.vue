<script setup lang="ts">
import { onMounted, ref } from 'vue'

type ApplicationStatus = {
  status: 'ok'
  database: 'ok'
}

const message = ref('Checking alerts.surf status...')

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
    message.value = isHealthyStatus(status)
      ? 'alerts.surf is running'
      : 'alerts.surf is unavailable'
  } catch {
    message.value = 'alerts.surf is unavailable'
  }
})
</script>

<template>
  <main class="status-page">
    <section class="status-card" aria-labelledby="page-title">
      <p class="eyebrow">Application status</p>
      <h1 id="page-title">alerts.surf</h1>
      <p class="status-message" role="status" aria-live="polite">
        {{ message }}
      </p>
    </section>
  </main>
</template>
