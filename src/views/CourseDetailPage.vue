<template>
  <div class="course-detail">
    <!-- 保持现有内容不变 -->

    <!-- 添加微信二维码弹窗 -->
    <div v-if="showQRCode" class="qr-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>微信咨询</h3>
          <button class="btn-close" @click="showQRCode = false">
            <i class="ri-close-line"></i>
          </button>
        </div>
        <div class="modal-body">
          <img src="https://images.pexels.com/photos/8737558/pexels-photo-8737558.jpeg?auto=compress&cs=tinysrgb&w=300" alt="微信二维码" class="qr-image">
          <p>扫描二维码添加老师微信</p>
        </div>
      </div>
      <div class="modal-backdrop" @click="showQRCode = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showAllContent = ref(false)
const showAllReviews = ref(false)
const showQRCode = ref(false)

const toggleContent = () => {
  showAllContent.value = !showAllContent.value
}

const toggleReviews = () => {
  showAllReviews.value = !showAllReviews.value
}

const handleEnroll = () => {
  router.push('/auth/login')
}

const contactTeacher = () => {
  showQRCode.value = true
}

const navigateToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}
</script>

<style lang="scss" scoped>
// 保持现有样式不变

// 添加微信二维码弹窗样式
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-content {
    background: white;
    border-radius: var(--border-radius);
    width: 90%;
    max-width: 400px;
    position: relative;
    z-index: 1001;
    box-shadow: var(--shadow-lg);
  }

  .modal-header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 1.2rem;
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      color: var(--text-light);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--text-color);
      }
    }
  }

  .modal-body {
    padding: var(--spacing-xl);
    text-align: center;

    .qr-image {
      width: 200px;
      height: 200px;
      margin-bottom: var(--spacing-md);
    }

    p {
      color: var(--text-light);
      margin: 0;
    }
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}
</style>