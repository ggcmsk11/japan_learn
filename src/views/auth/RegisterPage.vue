<template>
  <div class="auth-page">
    <div class="auth-container">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>手机号</label>
          <div class="phone-input">
            <div class="area-code" @click="showAreaCodeSelect = true">
              <span>+{{ areaCode }}</span>
              <i class="ri-arrow-down-s-line"></i>
            </div>
            <input 
              type="tel" 
              v-model="registerForm.phone" 
              required 
              placeholder="请输入手机号"
            >
          </div>
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
          <label>验证码</label>
          <div class="captcha-input">
            <input 
              type="text" 
              v-model="registerForm.captcha" 
              required 
              placeholder="请输入验证码"
            >
            <img 
              :src="captchaUrl" 
              alt="验证码" 
              class="captcha-image"
              @click="refreshCaptcha"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="agreement">
            <input type="checkbox" v-model="registerForm.agreement" required>
            <span>我已阅读并同意<a href="#" @click.prevent="showTerms">服务条款</a>和<a href="#" @click.prevent="showPrivacy">隐私政策</a></span>
          </label>
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? '注册中...' : '注册' }}
        </button>

        <div class="auth-links">
          已有账号？
          <router-link to="/auth/login">立即登录</router-link>
        </div>
      </form>
    </div>

    <!-- Registration Success Dialog -->
    <el-dialog
      v-model="showSuccessDialog"
      title="注册成功"
      width="360px"
      center
      :show-close="false"
      class="success-dialog"
    >
      <div class="success-content">
        <i class="ri-check-line success-icon"></i>
        <p>恭喜您注册成功！</p>
        <p class="sub-text">即将跳转到登录页面...</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="goToLogin">立即登录</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Area Code Select Dialog -->
    <el-dialog
      v-model="showAreaCodeSelect"
      title="选择区号"
      width="360px"
      center
      :show-close="false"
      class="area-code-dialog"
    >
      <div class="area-code-list">
        <div 
          v-for="code in areaCodes" 
          :key="code.code"
          class="area-code-item"
          @click="selectAreaCode(code.code)"
        >
          <span class="country">{{ code.country }}</span>
          <span class="code">+{{ code.code }}</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAreaCodeSelect = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import md5 from 'md5'

const router = useRouter()
const showPassword = ref(false)
const isSubmitting = ref(false)
const showAreaCodeSelect = ref(false)
const showSuccessDialog = ref(false)
const areaCode = ref('86')
const captchaUrl = ref('https://www.dlmy.tech/chunshua-api/captcha')

const registerForm = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agreement: false
})

const areaCodes = [
  { country: '中国', code: '86' },
  { country: '中国香港', code: '852' },
  { country: '中国澳门', code: '853' },
  { country: '中国台湾', code: '886' },
  { country: '日本', code: '81' },
  { country: '韩国', code: '82' }
]

const selectAreaCode = (code: string) => {
  areaCode.value = code
  showAreaCodeSelect.value = false
}

const refreshCaptcha = () => {
  captchaUrl.value = `https://www.dlmy.tech/chunshua-api/captcha?t=${Date.now()}`
}

const goToLogin = () => {
  showSuccessDialog.value = false
  router.push('/auth/login')
}

const handleRegister = async () => {
  try {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }

    if (!registerForm.value.agreement) {
      ElMessage.error('请阅读并同意服务条款和隐私政策')
      return
    }

    isSubmitting.value = true
    
    const pwKey = "chunshualiguan"
    const encryptedPassword = md5(registerForm.value.password + pwKey)
    const phoneNumber = areaCode.value + registerForm.value.phone

    const response = await fetch('https://www.dlmy.tech/chunshua-api/chunshua_users/info/chunshuaRegister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_account: "11",
        password: encryptedPassword,
        phone_number: phoneNumber,
        captcha: registerForm.value.captcha,
        user_name: "",
        user_source: "官方网站",
        registerType: 2
      })
    })

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(data.msg || '注册失败')
      refreshCaptcha()
    }

    showSuccessDialog.value = true
    setTimeout(() => {
      goToLogin()
    }, 2000)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '注册失败，请稍后重试')
    refreshCaptcha()
  } finally {
    isSubmitting.value = false
  }
}

const showTerms = () => {
  router.push('/terms')
}

const showPrivacy = () => {
  router.push('/privacy')
}

// Initialize captcha on mount
refreshCaptcha()
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
  }
}

.phone-input {
  display: flex;
  gap: var(--spacing-xs);

  .area-code {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: border-color var(--transition-fast);

    &:hover {
      border-color: var(--primary-color);
    }

    span {
      font-size: 0.95rem;
    }
  }

  input {
    flex: 1;
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

.captcha-input {
  display: flex;
  gap: var(--spacing-xs);

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }

  .captcha-image {
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
  }
}

.password-input {
  position: relative;

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

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

.area-code-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
  }

  .area-code-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .area-code-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--background-color);
    }

    .country {
      font-weight: 500;
    }

    .code {
      color: var(--text-light);
    }
  }
}

.success-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
  }

  .success-content {
    text-align: center;
    padding: var(--spacing-lg) 0;

    .success-icon {
      font-size: 3rem;
      color: var(--success-color);
      margin-bottom: var(--spacing-md);
    }

    p {
      margin-bottom: var(--spacing-xs);
      font-size: 1.1rem;

      &.sub-text {
        color: var(--text-light);
        font-size: 0.9rem;
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
