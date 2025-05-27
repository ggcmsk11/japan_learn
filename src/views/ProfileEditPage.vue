<template>
  <div class="profile-edit-page">
    <div class="container">
      <div class="edit-header">
        <h1>编辑个人资料</h1>
        <button class="btn-back" @click="router.back()">
          <i class="ri-arrow-left-line"></i>
          返回
        </button>
      </div>

      <form class="edit-form" @submit.prevent="handleSubmit">
        <div class="form-section">
          <h2>基本信息</h2>
          
          <div class="avatar-upload">
            <div class="avatar-preview">
              <img :src="formData.avatar" alt="头像预览">
            </div>
            <button type="button" class="btn-upload">
              <i class="ri-upload-2-line"></i>
              更换头像
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>昵称</label>
              <input 
                type="text" 
                v-model="formData.nickname"
                placeholder="请输入昵称"
              >
            </div>

            <div class="form-group">
              <label>手机号</label>
              <input 
                type="tel" 
                v-model="formData.phone"
                placeholder="请输入手机号"
              >
            </div>

            <div class="form-group">
              <label>邮箱</label>
              <input 
                type="email" 
                v-model="formData.email"
                placeholder="请输入邮箱"
              >
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>安全设置</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>当前密码</label>
              <input 
                type="password" 
                v-model="formData.currentPassword"
                placeholder="请输入当前密码"
              >
            </div>

            <div class="form-group">
              <label>新密码</label>
              <input 
                type="password" 
                v-model="formData.newPassword"
                placeholder="请输入新密码"
              >
            </div>

            <div class="form-group">
              <label>确认新密码</label>
              <input 
                type="password" 
                v-model="formData.confirmPassword"
                placeholder="请再次输入新密码"
              >
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="router.back()">取消</button>
          <button type="submit" class="btn-save">保存修改</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const formData = ref({
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
  nickname: '张三',
  phone: '13888888888',
  email: 'user123@example.com',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  try {
    // TODO: Implement profile update logic
    
    ElMessage({
      message: '个人资料更新成功',
      type: 'success'
    })
    
    router.back()
  } catch (error) {
    ElMessage({
      message: error instanceof Error ? error.message : '更新失败，请稍后重试',
      type: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.profile-edit-page {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-color);
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  h1 {
    font-size: 1.8rem;
  }
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}

.edit-form {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.form-section {
  margin-bottom: var(--spacing-xl);
  
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

.avatar-upload {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.avatar-preview {
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

.btn-upload {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.form-group {
  label {
    display: block;
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: var(--spacing-xs);
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
  
  button {
    padding: 10px 24px;
    border-radius: 4px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .btn-cancel {
    background: none;
    border: 1px solid var(--border-color);
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
  
  .btn-save {
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
}
</style>