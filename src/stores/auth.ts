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
  const isActive = ref(initialState?.isActive || 0)
  const isPaid = ref(initialState?.isPaid || 0)
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
    isActive.value = user.isActive
    isPaid.value = user.isPaid
    
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
      phoneNumber: phone,
      isActive: user.isActive,
      isPaid: user.isPaid
    }))
  }

  const logout = () => {
    isLoggedIn.value = false
    token.value = ''
    userInfo.value = null
    phoneNumber.value = ''
    isActive.value = 0
    isPaid.value = 0
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
    isActive,
    isPaid,
    permissions,
    login,
    logout,
    hasPermission
  }
})