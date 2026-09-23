<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { getAuthHeader, logout } = useAuth()
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const activeTab = ref('playas')
const summary = ref<any>(null)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/api/dashboard/summary', {
      headers: getAuthHeader()
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
      headers: getAuthHeader()
    })
  } catch (e) {
    // Ignore error on logout
  }
  logout()
  emit('logout')
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Surfer Dashboard</h1>
      <button @click="handleLogout" data-test="logout-btn" class="btn-logout">Logout</button>
    </header>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="!summary" class="loading">Loading...</div>
    <div v-else class="dashboard-content">
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'playas' }" 
          @click="activeTab = 'playas'" 
          data-test="tab-playas">
          Playas
        </button>
        <button 
          :class="{ active: activeTab === 'mareas' }" 
          @click="activeTab = 'mareas'" 
          data-test="tab-mareas">
          Mareas
        </button>
        <button 
          :class="{ active: activeTab === 'tablas' }" 
          @click="activeTab = 'tablas'" 
          data-test="tab-tablas">
          Tablas
        </button>
        <button 
          :class="{ active: activeTab === 'alertas' }" 
          @click="activeTab = 'alertas'" 
          data-test="tab-alertas">
          Alertas
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'playas'" class="panel" data-test="panel-playas">
          <h2>Playas</h2>
          <ul>
            <li v-for="beach in summary.beaches" :key="beach.id">
              {{ beach.name }} - Score: {{ beach.condition_score }} ({{ beach.swell }}, {{ beach.wind }})
            </li>
          </ul>
        </div>
        <div v-if="activeTab === 'mareas'" class="panel" data-test="panel-mareas">
          <h2>Mareas</h2>
          <p>Current: {{ summary.tides.current_level }} ({{ summary.tides.trend }})</p>
          <p>High: {{ summary.tides.next_high }} | Low: {{ summary.tides.next_low }}</p>
        </div>
        <div v-if="activeTab === 'tablas'" class="panel" data-test="panel-tablas">
          <h2>Tablas</h2>
          <ul>
            <li v-for="board in summary.quiver" :key="board.id">
              {{ board.model }} ({{ board.length }}, {{ board.volume }}L)
            </li>
          </ul>
        </div>
        <div v-if="activeTab === 'alertas'" class="panel" data-test="panel-alertas">
          <h2>Alertas</h2>
          <ul>
            <li v-for="alert in summary.alerts" :key="alert.id">
              {{ alert.rule }} - {{ alert.status }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: white;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}
.tabs button {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 0.5rem 1rem;
}
.tabs button.active {
  color: #00b4d8;
  border-bottom: 2px solid #00b4d8;
}
.panel {
  background: rgba(255,255,255,0.05);
  padding: 1.5rem;
  border-radius: 8px;
}
.btn-logout {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
