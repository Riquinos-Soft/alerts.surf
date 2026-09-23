<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { setToken } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (!res.ok) {
      throw new Error('Invalid credentials')
    }

    const data = await res.json()
    setToken(data.access_token)
    emit('success')
    emit('close')
  } catch (err: any) {
    error.value = 'Failed to login: Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content glass">
      <h2>Beta Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input type="text" v-model="username" required data-test="username" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required data-test="password" />
        </div>
        <div v-if="error" class="error-msg" data-test="error">{{ error }}</div>
        <div class="actions">
          <button type="button" @click="emit('close')" class="btn-cancel">Cancel</button>
          <button type="submit" :disabled="loading" class="btn-primary" data-test="submit">
            {{ loading ? 'Logging in...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error-msg {
  color: red;
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
