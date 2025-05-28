<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { teachers } from '../../config/teachers'

const router = useRouter()
const activeTeacher = ref<string | null>(null)

const showProfile = (id: string) => {
  activeTeacher.value = id
}

const hideProfile = () => {
  activeTeacher.value = null
}

const navigateToTeacher = (id: string) => {
  router.push(`/teachers/${id}`)
}
</script>

<template>
  <section class="teacher-section section">
    <div class="container">
      <h2 class="section-title">教师介绍</h2>
      <p class="section-subtitle">我们的教师团队拥有丰富的教学经验和专业知识，为您的日语学习提供最好的指导。</p>
      
      <div class="teachers-grid">
        <div 
          v-for="teacher in teachers" 
          :key="teacher.id"
          class="teacher-card"
          @mouseenter="showProfile(teacher.id)"
          @mouseleave="hideProfile()"
          @touchstart="showProfile(teacher.id)"
          @click="navigateToTeacher(teacher.id)"
        >
          <div class="teacher-image">
            <img :src="teacher.image" :alt="teacher.name">
          </div>
          <div class="teacher-info">
            <h3 class="teacher-name">{{ teacher.name }}</h3>
            <p class="teacher-name-en">{{ teacher.nameEn }}</p>
            <p class="teacher-role">{{ teacher.role }}</p>
            <p class="teacher-description">{{ teacher.description }}</p>
          </div>
          
          <!-- Teacher Profile Card -->
          <div class="teacher-profile" v-if="activeTeacher === teacher.id">
            <div class="profile-header">
              <h3 class="profile-name">{{ teacher.name }}</h3>
              <p class="profile-role">{{ teacher.role }}</p>
            </div>
            
            <div class="profile-section">
              <h4>专业领域</h4>
              <ul>
                <li v-for="(item, index) in teacher.expertise" :key="index">{{ item }}</li>
              </ul>
            </div>
            
            <div class="profile-section">
              <h4>学历背景</h4>
              <ul>
                <li v-for="(item, index) in teacher.education" :key="index">{{ item }}</li>
              </ul>
            </div>
            
            <div class="profile-section">
              <h4>工作经历</h4>
              <ul>
                <li v-for="(item, index) in teacher.experience" :key="index">{{ item }}</li>
              </ul>
            </div>
            
            <div class="profile-section">
              <h4>语言能力</h4>
              <div class="language-badges">
                <div class="language-badge" v-for="(lang, index) in teacher.languages" :key="index">
                  <span class="language-name">{{ lang.language }}</span>
                  <span class="language-level">{{ lang.level }}</span>
                </div>
              </div>
            </div>
            
            <div class="profile-footer">
              <button class="btn-contact">
                <i class="ri-message-3-line"></i>
                咨询老师
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="teachers-cta">
        <p>我们的教师团队随时准备为您提供专业的学习指导。</p>
        <router-link to="/courses" class="btn btn-primary">
          预约课程
          <i class="ri-arrow-right-line"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.teacher-section {
  background-color: white;
  padding: var(--spacing-xxl) 0;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.teacher-card {
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
}

.teacher-image {
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.teacher-info {
  padding: var(--spacing-lg);
}

.teacher-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.teacher-name-en {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: var(--spacing-sm);
}

.teacher-role {
  color: var(--primary-color);
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.teacher-description {
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.5;
}

.teacher-profile {
  position: absolute;
  top: 0;
  left: 100%;
  width: 300px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  animation: fadeIn var(--transition-fast);
  
  @media (max-width: 1280px) {
    left: auto;
    right: 0;
  }
  
  @media (max-width: 767px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 350px;
    max-height: 80vh;
    overflow-y: auto;
  }
}

.profile-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md);
  
  .profile-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .profile-role {
    font-size: 0.9rem;
    opacity: 0.9;
  }
}

.profile-section {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--text-color);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 5px;
      font-size: 0.9rem;
      color: var(--text-light);
      
      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--primary-color);
      }
    }
  }
  
  &:last-of-type {
    border-bottom: none;
  }
}

.language-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.language-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px 12px;
  
  .language-name {
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .language-level {
    font-size: 0.8rem;
    color: var(--text-light);
  }
}

.profile-footer {
  padding: var(--spacing-md);
  text-align: center;
  
  .btn-contact {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    width: 100%;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
}

.teachers-cta {
  text-align: center;
  margin-top: var(--spacing-xl);
  
  p {
    margin-bottom: var(--spacing-md);
    color: var(--text-light);
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    
    i {
      transition: transform var(--transition-fast);
    }
    
    &:hover i {
      transform: translateX(4px);
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>