<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-avatar">
            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" alt="用户头像">
          </div>
          <div class="profile-details">
            <h1>{{ authStore.userInfo?.userName }}</h1>
            <p class="user-role">{{ userRole }}</p>
          </div>
        </div>
        <button class="btn-edit" @click="navigateToEdit">
          <i class="ri-edit-line"></i>
          编辑资料
        </button>
      </div>

      <div class="profile-content">
        <div class="info-section">
          <h2>基本信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>用户账号</label>
              <span>{{ authStore.userInfo?.userAccount }}</span>
            </div>
            <div class="info-item">
              <label>手机号</label>
              <span>{{ maskedPhone }}</span>
            </div>
            <div class="info-item">
              <label>邮箱</label>
              <span>{{ maskedEmail }}</span>
            </div>
            <div class="info-item">
              <label>账号状态</label>
              <span :class="['status-badge', authStore.userInfo?.isActive ? 'active' : 'inactive']">
                {{ authStore.userInfo?.isActive ? '已激活' : '未激活' }}
              </span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>会员信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>会员状态</label>
              <span :class="['status-badge', authStore.userInfo?.isPaid === 0 ? 'active' : 'inactive']">
                {{ authStore.userInfo?.isPaid === 0 ? 'VIP会员' : '普通用户' }}
              </span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>JLPT等级权限</h2>
          <div class="jlpt-grid">
            <div 
              v-for="level in ['N1', 'N2', 'N3', 'N4', 'N5']" 
              :key="level"
              :class="['jlpt-item', { 'not-activated': !hasJlptAccess(level) }]"
              @click="handleLevelClick(level)"
            >
              <div class="level-badge">{{ level }}</div>
              <div :class="['access-status', hasJlptAccess(level) ? 'has-access' : 'no-access']">
                {{ hasJlptAccess(level) ? '已开通' : '未开通' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Dialog -->
    <el-dialog
      v-model="showPurchaseDialog"
      title="开通会员"
      width="360px"
      center
      :show-close="false"
      class="purchase-dialog"
    >
      <div class="qr-container">
        <img src="https://images.pexels.com/photos/8737558/pexels-photo-8737558.jpeg?auto=compress&cs=tinysrgb&w=300" alt="客服二维码" class="qr-code">
        <p>扫码添加客服微信，开通会员</p>
        <p class="tip">开通会员后，手机APP也可同步使用</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPurchaseDialog = false">取消</el-button>
          <el-button type="primary" @click="downloadApp">
            下载APP
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Download Dialog -->
    <el-dialog
      v-model="showDownloadDialog"
      title="下载纯刷日语APP"
      width="360px"
      center
      :show-close="false"
      class="download-dialog"
    >
      <div class="download-options">
        <a href="/downloads/chunshua.apk" class="download-btn android">
          <i class="ri-android-line"></i>
          Android版下载
        </a>
        <a href="https://apps.apple.com/app/chunshua" target="_blank" class="download-btn ios">
          <i class="ri-apple-line"></i>
          iOS版下载
        </a>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDownloadDialog = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showPurchaseDialog = ref(false)
const showDownloadDialog = ref(false)

const userRole = computed(() => {
  return authStore.userInfo?.userRole === 0 ? '普通用户' : '教师'
})

const maskedPhone = computed(() => {
  const phone = authStore.userInfo?.userAccount || ''
  if (phone.length >= 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  return phone
})

const maskedEmail = computed(() => {
  const email = authStore.userInfo?.email
  if (!email) return '未设置'
  const [username, domain] = email.split('@')
  if (username.length <= 4) return email
  return `${username.slice(0, 2)}****${username.slice(-2)}@${domain}`
})

const hasJlptAccess = (level: string) => {
  const levelNum = parseInt(level.slice(1))
  const key = `japanese${level}` as keyof typeof authStore.userInfo
  return authStore.userInfo?.[key] === 1
}

const navigateToEdit = () => {
  router.push('/profile/edit')
}

const handleLevelClick = (level: string) => {
  if (!hasJlptAccess(level)) {
    showPurchaseDialog.value = true
  }
}

const downloadApp = () => {
  showPurchaseDialog.value = false
  showDownloadDialog.value = true
}
</script>

<style lang="scss" scoped>
// Keep existing styles unchanged
</style>
