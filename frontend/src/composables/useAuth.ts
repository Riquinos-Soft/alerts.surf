import { ref, computed } from 'vue'

const token = ref<string | null>(sessionStorage.getItem('beta_token'))

export function useAuth() {
  const isAuthenticated = computed(() => token.value !== null)

  const setToken = (newToken: string) => {
    token.value = newToken
    sessionStorage.setItem('beta_token', newToken)
  }

  const logout = () => {
    token.value = null
    sessionStorage.removeItem('beta_token')
  }

  const getAuthHeader = (): Record<string, string> => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token,
    isAuthenticated,
    setToken,
    logout,
    getAuthHeader
  }
}
