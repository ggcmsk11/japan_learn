<template>
  <div class="conversation-page">
    <div class="page-header">
      <div class="container">
        <h1>会话练习</h1>
        <p>提高日语口语交际能力</p>
      </div>
    </div>

    <div class="container">
      <div class="conversation-section">
        <h2>常用会话场景</h2>
        
        <div class="scene-list">
          <div class="scene-card" v-for="scene in scenes" :key="scene.id">
            <div class="scene-image">
              <img :src="scene.image" :alt="scene.title">
            </div>
            <div class="scene-content">
              <h3>{{ scene.title }}</h3>
              <p>{{ scene.description }}</p>
              <button class="btn-practice" @click="startPractice(scene.id)">
                开始练习
                <i class="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Scene {
  id: string
  title: string
  description: string
  image: string
}

const scenes = ref<Scene[]>([
  {
    id: 'restaurant',
    title: '餐厅点餐',
    description: '学习在日本餐厅如何点餐、询问菜品、结账等实用对话',
    image: 'https://images.pexels.com/photos/2290070/pexels-photo-2290070.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'shopping',
    title: '购物场景',
    description: '掌握在商店购物时的常用表达，包括询问价格、讨价还价等',
    image: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'station',
    title: '车站问路',
    description: '学习在车站询问方向、购买车票、确认时刻表等对话',
    image: 'https://images.pexels.com/photos/2815033/pexels-photo-2815033.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'hospital',
    title: '医院就医',
    description: '掌握在医院挂号、描述症状、听取医嘱等重要对话',
    image: 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
])

const startPractice = (sceneId: string) => {
  router.push(`/conversation/${sceneId}`)
}
</script>

<style lang="scss" scoped>
.conversation-page {
  padding-bottom: var(--spacing-xxl);
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
  }

  p {
    opacity: 0.9;
    font-size: 1.1rem;
  }
}

.conversation-section {
  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }
}

.scene-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.scene-card {
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);

    .scene-image img {
      transform: scale(1.05);
    }
  }
}

.scene-image {
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }
}

.scene-content {
  padding: var(--spacing-lg);

  h3 {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--text-light);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
  }
}

.btn-practice {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  i {
    transition: transform var(--transition-fast);
  }

  &:hover {
    background-color: var(--primary-dark);

    i {
      transform: translateX(4px);
    }
  }
}
</style>