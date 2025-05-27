import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const permissions = ref({
    N5: true,
    N4: true,
    N3: false,
    N2: false,
    N1: false
  })

  const login = () => {
    isLoggedIn.value = true
  }

  const logout = () => {
    isLoggedIn.value = false
  }

  const hasPermission = (level: string) => {
    return permissions.value[level as keyof typeof permissions.value]
  }

  return {
    isLoggedIn,
    permissions,
    login,
    logout,
    hasPermission
  }
})