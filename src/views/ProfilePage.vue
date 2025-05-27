<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-info">
          <div class="profile-avatar">
            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" alt="用户头像">
          </div>
          <div class="profile-details">
            <h1>{{ userInfo.nickname }}</h1>
            <p class="user-role">{{ userInfo.role }}</p>
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
              <span>{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <label>手机号</label>
              <span>{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <label>邮箱</label>
              <span>{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <label>账号状态</label>
              <span :class="['status-badge', userInfo.isActive ? 'active' : 'inactive']">
                {{ userInfo.isActive ? '已激活' : '未激活' }}
              </span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>会员信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>会员状态</label>
              <span :class="['status-badge', userInfo.isPaidUser ? 'active' : 'inactive']">
                {{ userInfo.isPaidUser ? 'VIP会员' : '普通用户' }}
              </span>
            </div>
            <div class="info-item">
              <label>到期时间</label>
              <span>{{ userInfo.subscriptionEndDate }}</span>
            </div>
            <div class="info-item">
              <label>付费金额</label>
              <span>¥{{ userInfo.paymentAmount }}</span>
            </div>
            <div class="info-item">
              <label>付费时间</label>
              <span>{{ userInfo.paymentDate }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>JLPT等级权限</h2>
          <div class="jlpt-grid">
            <div 
              v-for="level in ['N1', 'N2', 'N3', 'N4', 'N5']" 
              :key="level"
              :class="['jlpt-item', { 'not-activated': !userInfo[`isN${level.slice(1)}VipUser`] }]"
              @click="handleLevelClick(level)"
            >
              <div class="level-badge">{{ level }}</div>
              <div :class="['access-status', userInfo[`isN${level.slice(1)}VipUser`] ? 'has-access' : 'no-access']">
                {{ userInfo[`isN${level.slice(1)}VipUser`] ? '已开通' : '未开通' }}
              </div>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>其他信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>兑换码</label>
              <span>{{ userInfo.redeemCode || '暂无' }}</span>
            </div>
            <div class="info-item">
              <label>登录次数</label>
              <span>{{ userInfo.loginCount }}次</span>
            </div>
            <div class="info-item">
              <label>用户来源</label>
              <span>{{ userInfo.userSource }}</span>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPurchaseDialog = ref(false)
const showDownloadDialog = ref(false)

const userInfo = ref({
  username: 'user123',
  nickname: '张三',
  role: '普通用户',
  phone: '138****8888',
  email: 'user123@example.com',
  isActive: true,
  isPaidUser: true,
  subscriptionEndDate: '2024-12-31',
  paymentAmount: 1999,
  paymentDate: '2024-01-01',
  redeemCode: 'VIP2024',
  loginCount: 128,
  userSource: '官网注册',
  isN1VipUser: 1,
  isN2VipUser: 1,
  isN3VipUser: 1,
  isN4VipUser: 0,
  isN5VipUser: 0
})

const navigateToEdit = () => {
  router.push('/profile/edit')
}

const handleLevelClick = (level: string) => {
  if (!userInfo.value[`isN${level.slice(1)}VipUser`]) {
    showPurchaseDialog.value = true
  }
}

const downloadApp = () => {
  showPurchaseDialog.value = false
  showDownloadDialog.value = true
}
</script>

<style lang="scss" scoped>
.profile-page {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-color);
}

.profile-header {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-details {
  h1 {
    font-size: 1.8rem;
    margin-bottom: 5px;
  }
  
  .user-role {
    color: var(--text-light);
    font-size: 1.1rem;
  }
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-dark);
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.info-section {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  
  h2 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-lg);
    color: var(--primary-color);
    
    &::after {
      content: '';
      display: block;
      width: 40px;
      height: 3px;
      background-color: var(--primary-color);
      margin-top: 8px;
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
    margin-bottom: 5px;
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
    border: 1px dashed var(--border-color);
    
    &:hover {
      border-color: var(--primary-color);
      background-color: rgba(74, 144, 226, 0.05);
      
      .access-status {
        color: var(--primary-color);
      }
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
    transition: color var(--transition-fast);
    
    &.has-access {
      color: var(--success-color);
    }
    
    &.no-access {
      color: var(--text-light);
    }
  }
}

.purchase-dialog {
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
}

.download-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
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

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}
</style>