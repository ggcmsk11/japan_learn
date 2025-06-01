<template>
  <header :class="['main-header', { 'scrolled': isScrolled }]">
    <div class="container">
      <div class="header-content">
        <button v-if="showBackButton" class="back-button" @click="goBack">
          <i class="ri-arrow-left-line"></i>
        </button>
        <div class="logo" @click="navigateTo('/')">
          <span class="logo-text">纯刷日语</span>
          <span class="logo-jp">日语学习平台</span>
        </div>
        
        <nav class="desktop-nav">
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/vocabulary">单词</router-link></li>
            <li><router-link to="/practice">练习</router-link></li>
            <li><router-link to="/grammar">语法</router-link></li>
            <li><router-link to="/courses">课程</router-link></li>
          </ul>
        </nav>
        
        <div class="header-actions">
          <template v-if="authStore.isLoggedIn">
            <div class="user-info">
              <el-dropdown trigger="click">
                <div class="user-avatar-wrapper">
                  <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" alt="用户头像" class="user-avatar">
                  <span class="user-name">{{ authStore.userInfo?.userName }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="navigateTo('/profile')">
                      <i class="ri-user-line"></i>
                      个人中心
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">
                      <i class="ri-logout-box-line"></i>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <template v-else>
            <button class="login-btn" @click="navigateTo('/auth/login')">
              <i class="ri-user-line"></i>
              <span>登录</span>
            </button>
          </template>
          <button class="download-btn" @click="showDownloadDialog = true">
            <i class="ri-download-line"></i>
            <span>下载APP</span>
          </button>
          <button class="menu-toggle" @click="toggleMenu">
            <i :class="isMenuOpen ? 'ri-close-line' : 'ri-menu-line'"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div :class="['mobile-menu', { 'active': isMenuOpen }]">
      <ul>
        <li @click="navigateTo('/')">首页</li>
        <li @click="navigateTo('/vocabulary')">单词</li>
        <li @click="navigateTo('/practice')">练习</li>
        <li @click="navigateTo('/grammar')">语法</li>
        <li @click="navigateTo('/courses')">课程</li>
        <li class="mobile-login" @click="navigateTo('/auth/login')">登录</li>
      </ul>
    </div>

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
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const showDownloadDialog = ref(false)

const showBackButton = computed(() => {
  return route.path !== '/'
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const navigateTo = (path: string) => {
  router.push(path)
  isMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  ElMessage({
    message: '已退出登录',
    type: 'success',
    duration: 1000
  })
  router.push('/auth/login')
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
  
  &.scrolled {
    background-color: white;
    border-bottom-color: var(--border-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
  
  i {
    font-size: 1.2rem;
    color: var(--text-color);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 2px;
  }
  
  .logo-jp {
    font-size: 0.75rem;
    color: var(--text-light);
    opacity: 0.8;
  }
}

.desktop-nav {
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
  
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 30px;
    
    li {
      a {
        color: var(--text-color);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        padding: 8px 0;
        position: relative;
        transition: color 0.3s ease;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary-color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: right;
        }
        
        &:hover,
        &.router-link-active {
          color: var(--primary-color);
          
          &::after {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      }
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-info {
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 4px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--background-color);
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  i {
    font-size: 1.1rem;
  }
}

.login-btn {
  display: none;
  align-items: center;
  background-color: var(--primary-color);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  @media (min-width: 768px) {
    display: flex;
  }
  
  i {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
}

.download-btn {
  display: none;
  align-items: center;
  background-color: var(--accent-color);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  @media (min-width: 768px) {
    display: flex;
  }
  
  i {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: var(--accent-dark);
    transform: translateY(-2px);
  }
}

.menu-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--background-color);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-menu {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  
  &.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      padding: 15px 20px;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      
      &:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
      }
      
      &.mobile-login {
        color: var(--primary-color);
      }
    }
  }
  
  @media (min-width: 768px) {
    display: none;
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