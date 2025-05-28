<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-details">
            <h1>{{ authStore.userInfo?.userName }}</h1>
            <p class="user-role">{{ userRole }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-redeem" @click="showRedeemDialog = true">
            <i class="ri-coupon-line"></i>
            兑换码
          </button>
          <button class="btn-edit" @click="navigateToEdit">
            <i class="ri-edit-line"></i>
            修改密码
          </button>
        </div>
      </div>

      <div class="profile-content">
        <div class="info-section">
          <h2><i class="ri-user-3-line"></i> 基本信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>用户账号</label>
              <span>{{ authStore.userInfo?.userAccount }}</span>
            </div>
            <div class="info-item">
              <label>手机号</label>
              <span>{{ authStore.phoneNumber || authStore.userInfo?.phoneNumber || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>邮箱</label>
              <span>{{ authStore.userInfo?.email || '未设置' }}</span>
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
          <h2><i class="ri-vip-crown-2-line"></i> 会员信息</h2>
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
          <h2><i class="ri-award-line"></i> JLPT等级权限</h2>
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

    <!-- Redeem Code Dialog -->
    <el-dialog
      v-model="showRedeemDialog"
      title="兑换VIP会员"
      width="360px"
      center
      :show-close="false"
      class="redeem-dialog"
    >
      <div class="redeem-form">
        <div class="form-group">
          <label>兑换码</label>
          <input 
            type="text" 
            v-model="redeemCode"
            placeholder="请输入兑换码"
            maxlength="8"
          >
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showRedeemDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleRedeem"
            :loading="isRedeeming"
          >
            {{ isRedeeming ? '兑换中...' : '确认兑换' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showPurchaseDialog = ref(false)
const showDownloadDialog = ref(false)
const showRedeemDialog = ref(false)
const redeemCode = ref('')
const isRedeeming = ref(false)

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

const handleRedeem = async () => {
  if (!redeemCode.value) {
    ElMessage.error('请输入兑换码')
    return
  }

  isRedeeming.value = true

  try {
    const response = await fetch('https://www.dlmy.tech/chunshua-api/chunshua_users/info/redeemCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: authStore.userInfo?.userId,
        token: authStore.token,
        phone_number: authStore.phoneNumber?.replace(/^\+/, ''),
        redeemCode: redeemCode.value,
        loginType: 2
      })
    })

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(data.msg || '兑换失败')
    }

    // Show success message
    ElMessage.success('兑换成功')
    showRedeemDialog.value = false
    redeemCode.value = ''

    // Re-login to refresh user info
    const loginResponse = await fetch('https://www.dlmy.tech/chunshua-api/chunshua_users/info/chunshuaLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_account: "11",
        password: "b35150c2cf0c1edea3c5fca8c2e79d32",
        phone_number: authStore.phoneNumber?.replace(/^\+/, ''),
        device_info: "1",
        ip_address: "1",
        loginType: 2
      })
    })

    const loginData = await loginResponse.json()

    if (loginData.code === 200) {
      // Update store with new user info
      authStore.login(loginData.data.token, loginData.data, authStore.phoneNumber || '')
    }

  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '兑换失败，请稍后重试')
  } finally {
    isRedeeming.value = false
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-color);
  min-height: calc(100vh - 60px);
}

.profile-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.profile-info {
  .profile-details {
    h1 {
      font-size: 1.8rem;
      margin-bottom: 5px;
    }
    
    .user-role {
      opacity: 0.9;
      font-size: 1.1rem;
    }
  }
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-edit,
.btn-redeem {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.info-section {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  
  h2 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-lg);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    i {
      font-size: 1.4rem;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.info-item {
  label {
    display: block;
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: var(--spacing-xs);
  }
  
  span {
    font-size: 1.1rem;
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  
  &.active {
    background-color: rgba(46, 204, 113, 0.1);
    color: var(--success-color);
  }
  
  &.inactive {
    background-color: rgba(231, 76, 60, 0.1);
    color: var(--error-color);
  }
}

.jlpt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.jlpt-item {
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all var(--transition-fast);
  
  &.not-activated {
    cursor: pointer;
    opacity: 0.7;
    
    &:hover {
      opacity: 1;
      transform: translateY(-2px);
    }
  }
  
  .level-badge {
    background-color: var(--primary-color);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 500;
  }
  
  .access-status {
    font-size: 0.9rem;
    
    &.has-access {
      color: var(--success-color);
    }
    
    &.no-access {
      color: var(--text-light);
    }
  }
}

.purchase-dialog,
.download-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
  }

  .qr-container {
    text-align: center;
    padding: var(--spacing-md) 0;

    .qr-code {
      width: 200px;
      height: 200px;
      margin-bottom: var(--spacing-md);
    }

    p {
      color: var(--text-color);
      margin-bottom: var(--spacing-xs);

      &.tip {
        color: var(--text-light);
        font-size: 0.9rem;
      }
    }
  }

  .download-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md) 0;
  }

  .download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    text-decoration: none;
    color: white;
    font-weight: 500;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.9;
    }

    i {
      font-size: 1.2rem;
    }

    &.android {
      background-color: #3DDC84;
    }

    &.ios {
      background-color: #000000;
    }
  }
}

.redeem-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
  }

  .redeem-form {
    padding: var(--spacing-md) 0;

    .form-group {
      label {
        display: block;
        margin-bottom: var(--spacing-xs);
        color: var(--text-light);
      }

      input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}
</style>