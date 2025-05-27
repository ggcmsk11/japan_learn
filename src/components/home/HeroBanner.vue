<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface SlideItem {
  title: string
  subtitle: string
  image: string
  buttonText: string
  buttonLink: string
}

const slides = ref<SlideItem[]>([
  {
    title: '轻松<span class="text-primary">快乐</span>学日语',
    subtitle: '使用科学的学习方法，提高您的日语水平',
    image: 'https://images.pexels.com/photos/5428832/pexels-photo-5428832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    buttonText: '浏览课程',
    buttonLink: '/courses'
  },
  {
    title: '<span class="text-accent">JLPT</span>考试备考',
    subtitle: 'N5到N1，为您提供针对性的JLPT备考内容',
    image: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    buttonText: '立即开始',
    buttonLink: '/practice'
  },
  {
    title: '提升<span class="text-secondary">词汇量</span>',
    subtitle: '使用科学的记忆方法，有效提高词汇量',
    image: 'https://images.pexels.com/photos/5417622/pexels-photo-5417622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    buttonText: '开始学习',
    buttonLink: '/vocabulary'
  }
])

const currentSlide = ref(0)
const isTransitioning = ref(false)

const nextSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

const prevSlide = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

const navigateToPage = (path: string) => {
  router.push(path)
}

const autoPlay = ref<number | null>(null)

const startAutoPlay = () => {
  autoPlay.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlay.value) {
    clearInterval(autoPlay.value)
  }
}

onMounted(() => {
  startAutoPlay()
})
</script>

<template>
  <div 
    class="hero-banner" 
    @mouseenter="stopAutoPlay" 
    @mouseleave="startAutoPlay"
  >
    <div class="slides-container">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        :class="['slide', { active: index === currentSlide }]"
        :style="{ backgroundImage: `url(${slide.image})` }"
      >
        <div class="slide-content">
          <h1 class="slide-title" v-html="slide.title"></h1>
          <p class="slide-subtitle">{{ slide.subtitle }}</p>
          <button class="btn btn-primary" @click="navigateToPage(slide.buttonLink)">
            {{ slide.buttonText }}
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="slide-controls">
      <button class="control-btn prev" @click="prevSlide">
        <i class="ri-arrow-left-s-line"></i>
      </button>
      <div class="slide-indicators">
        <button 
          v-for="(slide, index) in slides" 
          :key="index"
          :class="['indicator', { active: index === currentSlide }]"
          @click="currentSlide = index"
        ></button>
      </div>
      <button class="control-btn next" @click="nextSlide">
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-banner {
  position: relative;
  height: 600px;
  overflow: hidden;
  
  @media (max-width: 767px) {
    height: 450px;
  }
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
  }
  
  &.active {
    opacity: 1;
    z-index: 1;
    
    .slide-title {
      transform: translateY(0);
      opacity: 1;
    }
    
    .slide-subtitle {
      transform: translateY(0);
      opacity: 1;
    }
    
    .btn {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.slide-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 600px;
  padding: 0 20px;
  margin-left: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 767px) {
    margin-left: 5%;
  }
}

.slide-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease, opacity 0.6s ease;
  
  @media (max-width: 767px) {
    font-size: 2rem;
  }
  
  .text-primary {
    color: var(--primary-light);
  }
  
  .text-secondary {
    color: var(--secondary-color);
  }
  
  .text-accent {
    color: var(--accent-color);
  }
}

.slide-subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 80%;
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease 0.1s, opacity 0.6s ease 0.1s;
  
  @media (max-width: 767px) {
    font-size: 1rem;
  }
}

.btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 1rem;
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease 0.2s, opacity 0.6s ease 0.2s;
  
  i {
    margin-left: 8px;
    transition: transform var(--transition-fast);
  }
  
  &:hover {
    i {
      transform: translateX(4px);
    }
  }
}

.slide-controls {
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.control-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1.5rem;
  
  &:hover {
    background-color: var(--primary-color);
  }
}

.slide-indicators {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
  margin: 0 5px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &.active {
    background-color: white;
    transform: scale(1.2);
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>