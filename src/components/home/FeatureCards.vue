<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface FeatureCard {
  id: string
  title: string
  titleZh: string
  description: string
  icon: string
  color: string
  link: string
}

const features = ref<FeatureCard[]>([
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    titleZh: '单词',
    description: '基于艾宾浩斯记忆曲线的高效单词学习系统。配合实用例句，让您轻松记忆。',
    icon: 'ri-book-open-line',
    color: 'primary',
    link: '/vocabulary'
  },
  {
    id: 'practice',
    title: 'Practice Tests',
    titleZh: '练习题',
    description: 'JLPT考试备考题库。通过分析历年真题精心编制的练习题，帮助您为考试做好准备。',
    icon: 'ri-file-list-3-line',
    color: 'accent',
    link: '/practice'
  },
  {
    id: 'grammar',
    title: 'Grammar',
    titleZh: '语法',
    description: '系统学习日语语法。从初级到高级，循序渐进地加深理解。',
    icon: 'ri-pencil-ruler-2-line',
    color: 'secondary',
    link: '/grammar'
  }
])

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <section class="feature-cards section">
    <div class="container">
      <h2 class="section-title">学习内容</h2>
      <p class="section-subtitle">为您提供日语学习所需的各类内容。根据您的学习目标选择合适的课程。</p>
      
      <div class="cards-container">
        <div 
          v-for="feature in features" 
          :key="feature.id"
          class="feature-card"
          :class="`card-${feature.color}`"
          @click="navigateTo(feature.link)"
        >
          <div class="card-icon">
            <i :class="feature.icon"></i>
          </div>
          <div class="card-content">
            <h3 class="card-title">
              {{ feature.title }}
              <span class="title-zh">{{ feature.titleZh }}</span>
            </h3>
            <p class="card-description">{{ feature.description }}</p>
            <router-link :to="feature.link" class="card-link">
              查看详情
              <i class="ri-arrow-right-s-line"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.feature-cards {
  background-color: white;
  padding: var(--spacing-xxl) 0;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: 5px solid transparent;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
    
    .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .card-link {
      i {
        transform: translateX(5px);
      }
    }
  }
  
  &.card-primary {
    border-top-color: var(--primary-color);
    
    .card-icon {
      background-color: rgba(74, 144, 226, 0.1);
      color: var(--primary-color);
    }
  }
  
  &.card-accent {
    border-top-color: var(--accent-color);
    
    .card-icon {
      background-color: rgba(245, 166, 35, 0.1);
      color: var(--accent-color);
    }
  }
  
  &.card-secondary {
    border-top-color: var(--secondary-color);
    
    .card-icon {
      background-color: rgba(126, 211, 33, 0.1);
      color: var(--secondary-color);
    }
  }
}

.card-icon {
  font-size: 2.5rem;
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-normal);
  margin: var(--spacing-md) auto 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.card-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .title-zh {
    font-size: 1rem;
    opacity: 0.7;
  }
}

.card-description {
  color: var(--text-light);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
  flex: 1;
}

.card-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
  margin-top: auto;
  
  i {
    margin-left: 5px;
    transition: transform var(--transition-fast);
  }
}
</style>