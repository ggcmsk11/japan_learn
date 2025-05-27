import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  userId: string
  userName: string
  userAccount: string
  userRole: number
  email: string | null
  isActive: number
  isPaid: number
  japaneseN1: number
  japaneseN2: number
  japaneseN3: number
  japaneseN4: number
  japaneseN5: number
}

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const token = ref('')
  const userInfo = ref<UserInfo | null>(null)
  const permissions = ref({
    N5: true,
    N4: true,
    N3: false,
    N2: false,
    N1: false
  })

  const login = (tokenValue: string, user: UserInfo) => {
    isLoggedIn.value = true
    token.value = tokenValue
    userInfo.value = user
    
    // Update permissions based on user's Japanese level access
    permissions.value = {
      N5: !!user.japaneseN5,
      N4: !!user.japaneseN4,
      N3: !!user.japaneseN3,
      N2: !!user.japaneseN2,
      N1: !!user.japaneseN1
    }
  }

  const logout = () => {
    isLoggedIn.value = false
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const hasPermission = (level: string) => {
    return permissions.value[level as keyof typeof permissions.value]
  }

  return {
    isLoggedIn,
    token,
    userInfo,
    permissions,
    login,
    logout,
    hasPermission
  }
})