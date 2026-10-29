<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { getAuthHeader, logout } = useAuth()
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const sections = [
  { id: 'playas', label: 'Playas', icon: 'location-o' },
  { id: 'mareas', label: 'Mareas', icon: 'clock-o' },
  { id: 'tablas', label: 'Tablas', icon: 'notes-o' },
  { id: 'alertas', label: 'Alertas', icon: 'bell' },
] as const

const activeIndex = ref(0)
const summary = ref<any>(null)
const error = ref('')

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
  } catch (err: any) {
    error.value = err.message
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
      <h1>Surfer Dashboard</h1>
      <button type="button" @click="handleLogout" data-test="logout-btn" class="btn-logout">
        Logout
      </button>
    </header>

    <div class="dashboard-layout">
      <nav class="desktop-navigation" aria-label="Dashboard sections">
        <van-sidebar v-model="activeIndex">
          <van-sidebar-item
            v-for="(section, index) in sections"
            :key="section.id"
            :title="section.label"
            :data-test="`sidebar-${section.id}`"
            @keydown="handleMenuKeydown($event, index)"
          />
        </van-sidebar>
      </nav>

      <main class="dashboard-main">
        <div v-if="error" class="error" role="alert">{{ error }}</div>
        <div v-else-if="!summary" class="loading" role="status">Loading...</div>
        <div v-else class="panel" role="tabpanel" :aria-label="sections[activeIndex]!.label">
          <div v-if="activeIndex === 0" data-test="panel-playas">
            <h2>Playas</h2>
            <ul>
              <li v-for="beach in summary.beaches" :key="beach.id">
                {{ beach.name }} - Score: {{ beach.condition_score }} ({{ beach.swell }}, {{ beach.wind }})
              </li>
            </ul>
          </div>
          <div v-else-if="activeIndex === 1" data-test="panel-mareas">
            <h2>Mareas</h2>
            <p>Current: {{ summary.tides.current_level }} ({{ summary.tides.trend }})</p>
            <p>High: {{ summary.tides.next_high }} | Low: {{ summary.tides.next_low }}</p>
          </div>
          <div v-else-if="activeIndex === 2" data-test="panel-tablas">
            <h2>Tablas</h2>
            <ul>
              <li v-for="board in summary.quiver" :key="board.id">
                {{ board.model }} ({{ board.length }}, {{ board.volume }}L)
              </li>
            </ul>
          </div>
          <div v-else data-test="panel-alertas">
            <h2>Alertas</h2>
            <ul>
              <li v-for="alert in summary.alerts" :key="alert.id">
                {{ alert.rule }} - {{ alert.status }}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>

    <nav class="mobile-navigation" aria-label="Dashboard sections">
      <van-tabbar v-model="activeIndex" :fixed="true" :safe-area-inset-bottom="true">
        <van-tabbar-item
          v-for="(section, index) in sections"
          :key="section.id"
          :icon="section.icon"
          :name="index"
          :data-test="`tab-${section.id}`"
          @keydown="handleMenuKeydown($event, index)"
        >
          {{ section.label }}
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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: clamp(1.35rem, 4vw, 2rem);
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
