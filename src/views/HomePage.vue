<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import HeroBanner from '../components/home/HeroBanner.vue'
import FeatureCards from '../components/home/FeatureCards.vue'
import CourseGallery from '../components/home/CourseGallery.vue'
import TeacherCards from '../components/home/TeacherCards.vue'

const email = ref('')
const isSubmitting = ref(false)

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubscribe = async () => {
  if (!email.value) {
    ElMessage({
      message: '请输入邮箱地址',
      type: 'warning'
    })
    return
  }

  if (!validateEmail(email.value)) {
    ElMessage({
      message: '邮箱格式不正确',
      type: 'warning'
    })
    return
  }
  
  isSubmitting.value = true
  
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error)
    }

    ElMessage({
      message: data.message,
      type: 'success'
    })

    email.value = ''
  } catch (error) {
    ElMessage({
      message: error instanceof Error ? error.message : '订阅失败，请稍后重试',
      type: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="home-page">
    <HeroBanner />
    <FeatureCards />
    <CourseGallery />
    <TeacherCards />
    
    <section class="testimonials section">
      <div class="container">
        <h2 class="section-title">学员评价</h2>
        <p class="section-subtitle">来看看我们的学员是如何评价纯刷日语的</p>
        
        <div class="testimonials-container">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" alt="学员1">
              </div>
              <div class="testimonial-info">
                <h4>刘薇</h4>
                <p>中国·上海</p>
                <div class="testimonial-rating">
                  <i class="ri-star-fill" v-for="n in 5" :key="n"></i>
                </div>
              </div>
            </div>
            <p class="testimonial-text">「单词学习系统非常有效。基于艾宾浩斯记忆曲线的复习提醒功能，让我能在短时间内掌握大量词汇。能够顺利通过N3考试，多亏了这个平台！」</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600" alt="学员2">
              </div>
              <div class="testimonial-info">
                <h4>张明</h4>
                <p>中国·北京</p>
                <div class="testimonial-rating">
                  <i class="ri-star-fill" v-for="n in 5" :key="n"></i>
                </div>
              </div>
            </div>
            <p class="testimonial-text">「语法讲解非常清晰。其他网站上难以理解的助词和敬语，在这里都能轻松掌握。老师们也都很耐心，总是很快回复我的问题。」</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">
                <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600" alt="学员3">
              </div>
              <div class="testimonial-info">
                <h4>李华</h4>
                <p>中国·深圳</p>
                <div class="testimonial-rating">
                  <i class="ri-star-fill" v-for="n in 4" :key="n"></i>
                  <i class="ri-star-half-fill"></i>
                </div>
              </div>
            </div>
            <p class="testimonial-text">「练习题丰富，而且很贴近JLPT真题的风格，对考试备考帮助很大。特别是听力练习的质量很高，让我在实际考试中也能从容应对。」</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="newsletter section">
      <div class="container">
        <div class="newsletter-content">
          <h2>订阅学习资讯</h2>
          <p>订阅我们的邮件，获取日语学习技巧、新课程信息和独家优惠。</p>
          
          <form class="newsletter-form" @submit.prevent="handleSubscribe">
            <input 
              type="email" 
              v-model="email"
              placeholder="请输入您的邮箱" 
              required
              :disabled="isSubmitting"
            >
            <button 
              type="submit" 
              class="btn btn-accent"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '订阅中...' : '订阅' }}
            </button>
          </form>
          
          <p class="privacy-note">※ 我们会严格按照隐私政策保护您的个人信息。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.testimonials {
  background-color: var(--background-color);
  padding: var(--spacing-xxl) 0;
}

.testimonials-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.testimonial-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
}

.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--spacing-md);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.testimonial-info {
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 3px;
  }
  
  p {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
}

.testimonial-rating {
  color: #FFD700;
  font-size: 0.9rem;
}

.testimonial-text {
  color: var(--text-color);
  line-height: 1.6;
  font-style: italic;
}

.newsletter {
  background-color: var(--primary-dark);
  color: white;
  padding: var(--spacing-xxl) 0;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: var(--spacing-md);
  }
  
  p {
    margin-bottom: var(--spacing-lg);
    opacity: 0.9;
  }
}

.newsletter-form {
  display: flex;
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  input {
    flex: 1;
    padding: 12px 15px;
    border: none;
    border-radius: 4px 0 0 4px;
    font-size: 1rem;
    
    @media (max-width: 767px) {
      border-radius: 4px;
    }
    
    &:focus {
      outline: none;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }
  
  .btn {
    padding: 12px 25px;
    border-radius: 0 4px 4px 0;
    
    @media (max-width: 767px) {
      border-radius: 4px;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.privacy-note {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>