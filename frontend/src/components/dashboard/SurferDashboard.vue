<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useLocale } from '../../composables/useLocale'
import LanguageSwitch from '../LanguageSwitch.vue'

const { getAuthHeader, logout } = useAuth()
const { t } = useLocale()
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const sections = [
  { id: 'playas', label: 'Beaches', icon: 'location-o' },
  { id: 'mareas', label: 'Tides', icon: 'clock-o' },
  { id: 'tablas', label: 'Boards', icon: 'notes-o' },
  { id: 'alertas', label: 'Alerts', icon: 'bell' },
] as const

const activeIndex = ref(0)
const summary = ref<any>(null)
const error = ref(false)

function translateKnownValue(value: string): string {
  if (value === 'active') return t('active')
  if (value === 'inactive') return t('inactive')
  if (value === 'rising') return t('rising')
  if (value === 'falling') return t('falling')
  return value
}

function handleMenuKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    activeIndex.value = index
  }
}

onMounted(async () => {
  try {
    const res = await fetch('/api/dashboard/summary', {
      headers: getAuthHeader(),
    })
    if (!res.ok) throw new Error('Failed to fetch dashboard')
    summary.value = await res.json()
  } catch {
    error.value = true
  }
})

const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeader(),
    })
  } catch {
    // A failed request must not prevent local logout.
  }
  logout()
  emit('logout')
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>{{ t('Surfer Dashboard') }}</h1>
      <LanguageSwitch />
      <button type="button" @click="handleLogout" data-test="logout-btn" class="btn-logout">
        {{ t('Logout') }}
      </button>
    </header>

    <div class="dashboard-layout">
      <nav class="desktop-navigation" :aria-label="t('Dashboard sections')">
        <van-sidebar v-model="activeIndex">
          <van-sidebar-item
            v-for="(section, index) in sections"
            :key="section.id"
            :title="t(section.label)"
            :data-test="`sidebar-${section.id}`"
            @keydown="handleMenuKeydown($event, index)"
          />
        </van-sidebar>
      </nav>

      <main class="dashboard-main">
        <div v-if="error" class="error" role="alert">{{ t('Unable to load dashboard') }}</div>
        <div v-else-if="!summary" class="loading" role="status">{{ t('Loading...') }}</div>
        <div v-else class="panel" role="tabpanel" :aria-label="t(sections[activeIndex]!.label)">
          <div v-if="activeIndex === 0" data-test="panel-playas">
            <h2>{{ t('Beaches') }}</h2>
            <ul>
              <li v-for="beach in summary.beaches" :key="beach.id">
                {{ beach.name }} - {{ t('Score:') }} {{ beach.condition_score }} ({{ beach.swell }}, {{ beach.wind }})
              </li>
            </ul>
          </div>
          <div v-else-if="activeIndex === 1" data-test="panel-mareas">
            <h2>{{ t('Tides') }}</h2>
            <p>{{ t('Current:') }} {{ summary.tides.current_level }} ({{ translateKnownValue(summary.tides.trend) }})</p>
            <p>{{ t('High:') }} {{ summary.tides.next_high }} | {{ t('Low:') }} {{ summary.tides.next_low }}</p>
          </div>
          <div v-else-if="activeIndex === 2" data-test="panel-tablas">
            <h2>{{ t('Boards') }}</h2>
            <ul>
              <li v-for="board in summary.quiver" :key="board.id">
                {{ board.model }} ({{ board.length }}, {{ board.volume }}L)
              </li>
            </ul>
          </div>
          <div v-else data-test="panel-alertas">
            <h2>{{ t('Alerts') }}</h2>
            <ul>
              <li v-for="alert in summary.alerts" :key="alert.id">
                {{ alert.rule }} - {{ translateKnownValue(alert.status) }}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>

    <nav class="mobile-navigation" :aria-label="t('Dashboard sections')">
      <van-tabbar v-model="activeIndex" :fixed="true" :safe-area-inset-bottom="true">
        <van-tabbar-item
          v-for="(section, index) in sections"
          :key="section.id"
          :icon="section.icon"
          :name="index"
          :data-test="`tab-${section.id}`"
          @keydown="handleMenuKeydown($event, index)"
        >
          {{ t(section.label) }}
        </van-tabbar-item>
      </van-tabbar>
    </nav>
  </div>
</template>

<style scoped>
.dashboard {
  width: min(100%, 1100px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 1.25rem 1rem calc(5.5rem + env(safe-area-inset-bottom, 0px));
  color: var(--text-main);
}

.dashboard-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  flex: 1 1 100%;
  font-size: clamp(1.35rem, 4vw, 2rem);
}

@media (min-width: 480px) {
  .dashboard-header h1 {
    flex: 1;
  }
}

.dashboard-layout {
  display: grid;
  min-width: 0;
}

.desktop-navigation {
  display: none;
}

.dashboard-main {
  min-width: 0;
}

.panel {
  padding: clamp(1rem, 3vw, 1.75rem);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  background: var(--bg-surface-elevated);
  box-shadow: 0 12px 30px rgba(12, 35, 56, 0.06);
}

.panel h2 {
  margin-top: 0;
}

.panel ul {
  padding-left: 1.25rem;
  overflow-wrap: anywhere;
}

.loading,
.error {
  padding: 1.25rem;
  border-radius: 1rem;
  background: var(--bg-surface-elevated);
}

.error {
  color: var(--status-error);
}

.btn-logout {
  flex: none;
  padding: 0.6rem 1rem;
  border: 1px solid var(--border-highlight);
  border-radius: 9999px;
  background: white;
  color: var(--accent-navy);
  font-weight: 600;
  cursor: pointer;
}

.btn-logout:focus-visible,
:deep(.van-tabbar-item:focus-visible),
:deep(.van-sidebar-item:focus-visible) {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

.mobile-navigation :deep(.van-tabbar) {
  z-index: 10;
  background: #fff;
  box-shadow: 0 -5px 20px rgba(12, 35, 56, 0.08);
}

@media (min-width: 768px) {
  .dashboard {
    padding: 2rem 1.5rem;
  }

  .dashboard-layout {
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 1.5rem;
    align-items: start;
  }

  .desktop-navigation {
    display: block;
  }

  .desktop-navigation :deep(.van-sidebar) {
    width: 100%;
    border-radius: 1rem;
    overflow: hidden;
  }

  .mobile-navigation {
    display: none;
  }
}
</style>
