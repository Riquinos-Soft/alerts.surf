<script setup lang="ts">
import { onMounted, ref } from 'vue'

type ApplicationStatus = {
  status: 'ok'
  database: 'ok'
}

type SurfSpot = {
  name: string
  region: string
  country_code: string
}

type SurfSpotCatalog = {
  spots: SurfSpot[]
}

type CatalogState = 'loading' | 'ready' | 'empty' | 'unavailable'

const message = ref('Checking alerts.surf status...')
const catalogState = ref<CatalogState>('loading')
const spots = ref<SurfSpot[]>([])

function isHealthyStatus(value: unknown): value is ApplicationStatus {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const status = value as Record<string, unknown>
  return status.status === 'ok' && status.database === 'ok'
}

function isSurfSpot(value: unknown): value is SurfSpot {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const spot = value as Record<string, unknown>
  return (
    typeof spot.name === 'string' &&
    spot.name.length > 0 &&
    typeof spot.region === 'string' &&
    spot.region.length > 0 &&
    typeof spot.country_code === 'string' &&
    /^[A-Z]{2}$/.test(spot.country_code)
  )
}

function isSurfSpotCatalog(value: unknown): value is SurfSpotCatalog {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const catalog = value as Record<string, unknown>
  return Array.isArray(catalog.spots) && catalog.spots.every(isSurfSpot)
}

async function loadApplicationStatus(): Promise<void> {
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
}

async function loadSurfSpots(): Promise<void> {
  try {
    const response = await fetch('/api/spots')
    if (!response.ok) {
      throw new Error('Surf spot catalog is unavailable')
    }

    const catalog: unknown = await response.json()
    if (!isSurfSpotCatalog(catalog)) {
      throw new Error('Surf spot catalog response is invalid')
    }

    spots.value = catalog.spots
    catalogState.value = spots.value.length > 0 ? 'ready' : 'empty'
  } catch {
    spots.value = []
    catalogState.value = 'unavailable'
  }
}

onMounted(() => {
  void loadApplicationStatus()
  void loadSurfSpots()
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

    <section class="spots-card" aria-labelledby="spots-title">
      <p class="eyebrow">Local catalog</p>
      <h2 id="spots-title">Surf spots</h2>

      <div class="catalog-content" aria-live="polite">
        <p v-if="catalogState === 'loading'" role="status">
          Loading surf spots...
        </p>
        <p v-else-if="catalogState === 'empty'" role="status">
          No surf spots available
        </p>
        <p v-else-if="catalogState === 'unavailable'" role="status">
          Surf spots are unavailable
        </p>
        <ul v-else class="spot-list">
          <li
            v-for="spot in spots"
            :key="`${spot.name}-${spot.region}-${spot.country_code}`"
            class="spot-item"
          >
            <h3>{{ spot.name }}</h3>
            <p>{{ spot.region }} · {{ spot.country_code }}</p>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
