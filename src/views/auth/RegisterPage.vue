<template>
  <div class="auth-page">
    <div class="auth-container">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>邮箱</label>
          <input 
            type="email" 
            v-model="registerForm.email" 
            required 
            placeholder="请输入邮箱"
          >
        </div>

        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="registerForm.username" 
            required 
            placeholder="请输入用户名"
          >
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="registerForm.password" 
              required 
              placeholder="请输入密码"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="registerForm.confirmPassword" 
              required 
              placeholder="请再次输入密码"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="agreement">
            <input type="checkbox" v-model="registerForm.agreement" required>
            <span>我已阅读并同意<a href="#" @click.prevent="showTerms">服务条款</a>和<a href="#" @click.prevent="showPrivacy">隐私政策</a></span>
          </label>
        </div>

        <button type="submit" class="btn-submit">注册</button>

        <div class="auth-links">
          已有账号？
          <router-link to="/auth/login">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)

const registerForm = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const handleRegister = async () => {
  try {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    
    // TODO: Implement actual registration logic
    console.log('Register form submitted:', registerForm.value)
    router.push('/auth/login')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

const showTerms = () => {
  // TODO: Implement terms dialog
  console.log('Show terms')
}

const showPrivacy = () => {
  // TODO: Implement privacy dialog
  console.log('Show privacy')
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: var(--background-color);
}

.auth-container {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    font-size: 1.8rem;
    color: var(--primary-color);
  }
}

.auth-form {
  .form-group {
    margin-bottom: var(--spacing-md);

    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      color: var(--text-color);
      font-weight: 500;
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

    .agreement {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: var(--text-light);
      cursor: pointer;

      a {
        color: var(--primary-color);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.password-input {
  position: relative;

  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 0;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--primary-dark);
  }
}

.auth-links {
  margin-top: var(--spacing-md);
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-light);

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>