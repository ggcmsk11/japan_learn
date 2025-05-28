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
  phoneNumber?: string
}

export const useAuthStore = defineStore('auth', () => {
  // Initialize state from localStorage if available
  const savedState = localStorage.getItem('authState')
  const initialState = savedState ? JSON.parse(savedState) : null

  const isLoggedIn = ref(!!initialState)
  const token = ref(initialState?.token || '')
  const userInfo = ref<UserInfo | null>(initialState?.userInfo || null)
  const phoneNumber = ref(initialState?.phoneNumber || '')
  const permissions = ref({
    N5: true,
    N4: true,
    N3: false,
    N2: false,
    N1: false
  })

  const login = (tokenValue: string, user: UserInfo, phone?: string) => {
    isLoggedIn.value = true
    token.value = tokenValue
    userInfo.value = user
    if (phone) {
      phoneNumber.value = phone
      userInfo.value.phoneNumber = phone
    }
    
    permissions.value = {
      N5: !!user.japaneseN5,
      N4: !!user.japaneseN4,
      N3: !!user.japaneseN3,
      N2: !!user.japaneseN2,
      N1: !!user.japaneseN1
    }

    // Save auth state to localStorage
    localStorage.setItem('authState', JSON.stringify({
      token: tokenValue,
      userInfo: user,
      phoneNumber: phone
    }))
  }

  const logout = () => {
    isLoggedIn.value = false
    token.value = ''
    userInfo.value = null
    phoneNumber.value = ''
    localStorage.removeItem('authState')
  }

  const hasPermission = (level: string) => {
    return permissions.value[level as keyof typeof permissions.value]
  }

  return {
    isLoggedIn,
    token,
    userInfo,
    phoneNumber,
    permissions,
    login,
    logout,
    hasPermission
  }
})