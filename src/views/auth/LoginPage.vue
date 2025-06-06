<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import md5 from 'md5'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showPassword = ref(false)
const showDownloadDialog = ref(false)
const showAreaCodeSelect = ref(false)
const isSubmitting = ref(false)
const areaCode = ref('86')

const loginForm = ref({
  phone: '',
  password: '',
  remember: false
})

const areaCodes = [
  { country: '中国', code: '86' },
  { country: '日本', code: '81' },
  { country: '韩国', code: '82' },
  { country: '中国香港', code: '852' },
  { country: '中国澳门', code: '853' },
  { country: '中国台湾', code: '886' },
  { country: '新加坡', code: '65' },
  { country: '马来西亚', code: '60' },
  { country: '泰国', code: '66' },
  { country: '越南', code: '84' },
  { country: '印度尼西亚', code: '62' },
  { country: '菲律宾', code: '63' },
  { country: '澳大利亚', code: '61' },
  { country: '新西兰', code: '64' },
  { country: '美国', code: '1' },
  { country: '加拿大', code: '1' },
  { country: '英国', code: '44' },
  { country: '法国', code: '33' },
  { country: '德国', code: '49' },
  { country: '意大利', code: '39' },
  { country: '西班牙', code: '34' },
  { country: '葡萄牙', code: '351' },
  { country: '俄罗斯', code: '7' },
  { country: '巴西', code: '55' },
  { country: '阿根廷', code: '54' },
  { country: '墨西哥', code: '52' },
  { country: '印度', code: '91' },
  { country: '巴基斯坦', code: '92' },
  { country: '孟加拉国', code: '880' },
  { country: '斯里兰卡', code: '94' },
  { country: '尼泊尔', code: '977' },
  { country: '缅甸', code: '95' },
  { country: '柬埔寨', code: '855' },
  { country: '老挝', code: '856' },
  { country: '蒙古', code: '976' },
  { country: '哈萨克斯坦', code: '7' },
  { country: '乌兹别克斯坦', code: '998' },
  { country: '土耳其', code: '90' },
  { country: '以色列', code: '972' },
  { country: '阿联酋', code: '971' },
  { country: '沙特阿拉伯', code: '966' },
  { country: '埃及', code: '20' },
  { country: '南非', code: '27' },
  { country: '荷兰', code: '31' },
  { country: '比利时', code: '32' },
  { country: '瑞典', code: '46' },
  { country: '挪威', code: '47' },
  { country: '芬兰', code: '358' },
  { country: '丹麦', code: '45' },
  { country: '瑞士', code: '41' }
]

const selectAreaCode = (code: string) => {
  areaCode.value = code
  showAreaCodeSelect.value = false
}

const handleLogin = async () => {
  try {
    isSubmitting.value = true
    const pwKey = "chunshualiguan"
    const encryptedPassword = md5(loginForm.value.password + pwKey)
    const phoneNumber = areaCode.value + loginForm.value.phone
    
    const response = await fetch('https://www.dlmy.tech/chunshua-api/chunshua_users/info/chunshuaLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_account: "11",
        password: encryptedPassword,
        phone_number: phoneNumber,
        device_info: "1",
        ip_address: "1",
        loginType: 2
      })
    })
    
    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(data.msg || '登录失败')
    }
    
    // Store user info in store
    authStore.login(data.data.token, data.data, phoneNumber)
    
    // Store login state if remember is checked
    if (loginForm.value.remember) {
      localStorage.setItem('rememberedLogin', JSON.stringify({
        phone: loginForm.value.phone,
        password: loginForm.value.password,
        areaCode: areaCode.value
      }))
    } else {
      localStorage.removeItem('rememberedLogin')
    }

    // Show success message for 1 second
    ElMessage({
      message: '登录成功',
      type: 'success',
      duration: 1000
    })
    
    // Redirect to home page after successful login
    router.push(route.query.redirect?.toString() || '/')
    
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Check for remembered login
  const remembered = localStorage.getItem('rememberedLogin')
  if (remembered) {
    const { phone, password, areaCode: savedAreaCode } = JSON.parse(remembered)
    loginForm.value.phone = phone
    loginForm.value.password = password
    loginForm.value.remember = true
    areaCode.value = savedAreaCode
  }
})
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>手机号</label>
          <div class="phone-input">
            <div class="area-code" @click="showAreaCodeSelect = true">
              <span>+{{ areaCode }}</span>
              <i class="ri-arrow-down-s-line"></i>
            </div>
            <input 
              type="tel" 
              v-model="loginForm.phone"
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
              v-model="loginForm.password"
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

        <div class="form-actions">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.remember">
            <span>记住我</span>
          </label>
          <router-link to="/auth/forgot-password" class="forgot-password">
            忘记密码？
          </router-link>
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? '登录中...' : '登录' }}
        </button>

        <div class="auth-links">
          还没有账号？
          <router-link to="/auth/register">立即注册</router-link>
        </div>

        <div class="download-app">
          <button type="button" class="btn-download" @click="showDownloadDialog = true">
            <i class="ri-smartphone-line"></i>
            下载手机APP
          </button>
        </div>
      </form>
    </div>

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

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;

  .remember-me {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    input {
      cursor: pointer;
    }
  }

  .forgot-password {
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

.download-app {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.btn-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  i {
    font-size: 1.2rem;
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