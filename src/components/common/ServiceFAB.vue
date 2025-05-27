<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)
const showQRCode = ref(false)
const showFAQ = ref(false)
const showContactForm = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const toggleQRCode = () => {
  showQRCode.value = !showQRCode.value
  if (showQRCode.value) {
    showFAQ.value = false
    showContactForm.value = false
  }
}

const toggleFAQ = () => {
  showFAQ.value = !showFAQ.value
  if (showFAQ.value) {
    showQRCode.value = false
    showContactForm.value = false
  }
}

const toggleContactForm = () => {
  showContactForm.value = !showContactForm.value
  if (showContactForm.value) {
    showQRCode.value = false
    showFAQ.value = false
  }
}

const callPhone = () => {
  window.location.href = 'tel:+81123456789'
}
</script>

<template>
  <div class="service-fab-container">
    <div :class="['service-fab', { 'expanded': isExpanded }]">
      <button class="fab-main" @click="toggleExpand" title="客服中心">
        <i class="ri-customer-service-2-line" v-if="!isExpanded"></i>
        <i class="ri-close-line" v-else></i>
      </button>
      
      <div class="fab-menu">
        <button class="fab-item" @click="toggleQRCode" title="微信咨询">
          <i class="ri-wechat-line"></i>
        </button>
        <button class="fab-item" @click="callPhone" title="电话咨询">
          <i class="ri-phone-line"></i>
        </button>
        <button class="fab-item" @click="toggleFAQ" title="常见问题">
          <i class="ri-question-line"></i>
        </button>
        <button class="fab-item" @click="toggleContactForm" title="意见反馈">
          <i class="ri-feedback-line"></i>
        </button>
      </div>
    </div>
    
    <!-- QR Code Modal -->
    <div class="fab-modal qr-code" v-if="showQRCode">
      <div class="modal-content">
        <h3>微信咨询</h3>
        <img src="https://images.pexels.com/photos/8737558/pexels-photo-8737558.jpeg?auto=compress&cs=tinysrgb&w=300" alt="微信二维码" class="qr-image"/>
        <p>扫描二维码添加客服微信</p>
      </div>
    </div>
    
    <!-- FAQ Modal -->
    <div class="fab-modal faq" v-if="showFAQ">
      <div class="modal-content">
        <h3>常见问题</h3>
        <div class="faq-item" v-for="(item, index) in 3" :key="index">
          <div class="faq-question">如何准备JLPT考试？</div>
          <div class="faq-answer">我们提供针对JLPT各级别的专业备考课程，包括词汇、语法、听力和阅读等全方位训练。建议您根据自己的水平选择合适的课程进行系统学习。</div>
        </div>
        <button class="btn btn-primary">查看更多问题</button>
      </div>
    </div>
    
    <!-- Contact Form Modal -->
    <div class="fab-modal contact-form" v-if="showContactForm">
      <div class="modal-content">
        <h3>意见反馈</h3>
        <form>
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" placeholder="请输入您的姓名">
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" placeholder="请输入您的邮箱">
          </div>
          <div class="form-group">
            <label for="message">反馈内容</label>
            <textarea id="message" rows="4" placeholder="请输入您的反馈内容"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">提交反馈</button>
        </form>
      </div>
    </div>
    
    <div class="modal-backdrop" v-if="showQRCode || showFAQ || showContactForm" @click="showQRCode = showFAQ = showContactForm = false"></div>
  </div>
</template>

<style lang="scss" scoped>
.service-fab-container {
  position: relative;
  z-index: 1000;
}

.service-fab {
  position: fixed;
  right: 30px;
  bottom: 20%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 10px;
  z-index: 1000;
}

.fab-main {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background-color: var(--primary-dark);
    transform: scale(1.05);
  }
}

.fab-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all var(--transition-normal);
}

.fab-item {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
  }
  
  &:nth-child(1) {
    transition-delay: 0.1s;
  }
  
  &:nth-child(2) {
    transition-delay: 0.2s;
  }
  
  &:nth-child(3) {
    transition-delay: 0.3s;
  }
  
  &:nth-child(4) {
    transition-delay: 0.4s;
  }
}

.expanded {
  .fab-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .fab-main {
    background-color: var(--accent-color);
  }
}

.fab-modal {
  position: fixed;
  right: 90px;
  bottom: 20%;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  width: 300px;
  max-width: calc(100vw - 120px);
  animation: slideInUp var(--transition-normal);
  z-index: 999;
  transform: translateY(-50%);
  max-height: 80vh;
  overflow-y: auto;
  
  @media (max-width: 767px) {
    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
  }
  
  .modal-content {
    padding: var(--spacing-lg);
    
    h3 {
      margin-bottom: var(--spacing-md);
      color: var(--primary-color);
    }
  }
  
  &.qr-code {
    text-align: center;
    
    .qr-image {
      width: 180px;
      height: 180px;
      margin: 10px auto;
    }
  }
  
  &.faq {
    .faq-item {
      margin-bottom: var(--spacing-md);
      
      .faq-question {
        font-weight: 500;
        margin-bottom: var(--spacing-xs);
      }
      
      .faq-answer {
        color: var(--text-light);
        font-size: 0.95rem;
      }
    }
    
    button {
      margin-top: var(--spacing-sm);
      width: 100%;
    }
  }
  
  &.contact-form {
    .form-group {
      margin-bottom: var(--spacing-md);
      
      label {
        display: block;
        margin-bottom: var(--spacing-xs);
        font-size: 0.9rem;
        color: var(--text-light);
      }
      
      input, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: inherit;
        resize: none;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }
    
    button {
      width: 100%;
    }
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn var(--transition-normal);
}
</style>