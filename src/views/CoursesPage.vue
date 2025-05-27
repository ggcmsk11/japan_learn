<template>
  <div class="courses-page">
    <div class="page-header">
      <div class="container">
        <h1>课程列表</h1>
        <p>为您提供适合您水平的日语学习课程</p>
      </div>
    </div>

    <div class="container">
      <div class="courses-filters">
        <div class="filter-group">
          <label>等级</label>
          <div class="filter-buttons">
            <button 
              v-for="level in levels"
              :key="level"
              :class="['filter-btn', { active: currentLevel === level }]"
              @click="filterCourses('level', level)"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>分类</label>
          <div class="filter-buttons">
            <button 
              v-for="type in types"
              :key="type"
              :class="['filter-btn', { active: currentType === type }]"
              @click="filterCourses('type', type)"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>排序</label>
          <select class="sort-select" v-model="currentSort" @change="sortCourses">
            <option value="popular">按人气</option>
            <option value="new">最新</option>
            <option value="price-low">价格从低到高</option>
            <option value="price-high">价格从高到低</option>
          </select>
        </div>
      </div>

      <div class="courses-grid">
        <div 
          v-for="course in filteredAndSortedCourses" 
          :key="course.id"
          class="course-card"
        >
          <div class="course-image">
            <img :src="course.image" :alt="course.title">
            <div class="course-level">{{ course.level }}</div>
            <div v-if="course.tag" :class="['course-tag', `tag-${course.tag}`]">
              {{ course.tag === 'popular' ? '热门' : '新课' }}
            </div>
          </div>

          <div class="course-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>

            <div class="course-details">
              <div class="detail-item">
                <i class="ri-time-line"></i>
                <span>{{ course.duration }}</span>
              </div>
              <div class="detail-item">
                <i class="ri-book-open-line"></i>
                <span>{{ course.lessons }}课时</span>
              </div>
              <div class="detail-item">
                <i class="ri-user-line"></i>
                <span>{{ course.students }}人学习</span>
              </div>
            </div>

            <div class="course-rating">
              <div class="stars">
                <i class="ri-star-fill" v-for="n in Math.floor(course.rating)" :key="n"></i>
                <i v-if="course.rating % 1 >= 0.5" class="ri-star-half-fill"></i>
              </div>
              <span class="rating-value">{{ course.rating }}</span>
              <span class="reviews-count">({{ course.students }}人已学)</span>
            </div>

            <div class="course-footer">
              <div class="course-price">¥{{ course.price.toLocaleString() }}</div>
              <button class="btn-enroll" @click="showEnrollModal = true">
                报名
                <i class="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button class="page-btn prev">
          <i class="ri-arrow-left-s-line"></i>
          上一页
        </button>
        <div class="page-numbers">
          <button class="page-number active">1</button>
          <button class="page-number">2</button>
          <button class="page-number">3</button>
          <span class="page-dots">...</span>
          <button class="page-number">8</button>
        </div>
        <button class="page-btn next">
          下一页
          <i class="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </div>

    <!-- 报名弹窗 -->
    <div v-if="showEnrollModal" class="enroll-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>课程报名</h3>
          <button class="btn-close" @click="showEnrollModal = false">
            <i class="ri-close-line"></i>
          </button>
        </div>
        <div class="modal-body">
          <img src="https://images.pexels.com/photos/8737558/pexels-photo-8737558.jpeg?auto=compress&cs=tinysrgb&w=300" alt="微信二维码" class="qr-image">
          <p>扫描二维码添加老师微信，完成报名</p>
        </div>
      </div>
      <div class="modal-backdrop" @click="showEnrollModal = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showEnrollModal = ref(false)
const currentLevel = ref('全部')
const currentType = ref('全部')
const currentSort = ref('popular')

const levels = ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']
const types = ['全部', '语法', '会话', '阅读', '听力']

interface Course {
  id: string
  title: string
  description: string
  level: string
  type: string
  image: string
  lessons: number
  duration: string
  rating: number
  students: number
  price: number
  tag?: string
}

const courses = ref<Course[]>([
  {
    id: 'n5-grammar',
    title: 'JLPT N5 语法精讲',
    description: '系统掌握N5级语法知识，打好基础',
    level: 'N5',
    type: '语法',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 20,
    duration: '10周',
    rating: 4.8,
    students: 1250,
    price: 9800,
    tag: 'popular'
  },
  {
    id: 'n4-listening',
    title: 'JLPT N4 听力强化',
    description: '提高听力理解能力，备战N4考试',
    level: 'N4',
    type: '听力',
    image: 'https://images.pexels.com/photos/5428003/pexels-photo-5428003.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 15,
    duration: '8周',
    rating: 4.7,
    students: 980,
    price: 8800
  },
  {
    id: 'n3-reading',
    title: 'JLPT N3 阅读技巧',
    description: '掌握文章要点，提高阅读速度',
    level: 'N3',
    type: '阅读',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 25,
    duration: '12周',
    rating: 4.9,
    students: 760,
    price: 12800,
    tag: 'new'
  }
])

const filterCourses = (filterType: string, value: string) => {
  if (filterType === 'level') {
    currentLevel.value = value
  } else if (filterType === 'type') {
    currentType.value = value
  }
}

const filteredAndSortedCourses = computed(() => {
  let filtered = courses.value

  // 应用等级筛选
  if (currentLevel.value !== '全部') {
    filtered = filtered.filter(course => course.level === currentLevel.value)
  }

  // 应用类型筛选
  if (currentType.value !== '全部') {
    filtered = filtered.filter(course => course.type === currentType.value)
  }

  // 应用排序
  return filtered.sort((a, b) => {
    switch (currentSort.value) {
      case 'popular':
        return b.students - a.students
      case 'new':
        return b.id.localeCompare(a.id)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      default:
        return 0
    }
  })
})

const sortCourses = () => {
  // 排序逻辑已经在 computed 属性中处理
}
</script>

<style lang="scss" scoped>
.courses-page {
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

.courses-filters {
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.filter-group {
  flex: 1;
  min-width: 200px;

  label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--spacing-sm);
    color: var(--text-light);
  }
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.9rem;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &.active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
}

.sort-select {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.95rem;
  color: var(--text-color);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.course-card {
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);

    .course-image img {
      transform: scale(1.05);
    }
  }
}

.course-image {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .course-level {
    position: absolute;
    top: 15px;
    left: 15px;
    background-color: var(--primary-dark);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .course-tag {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;

    &.tag-popular {
      background-color: var(--accent-color);
      color: white;
    }

    &.tag-new {
      background-color: var(--secondary-color);
      color: white;
    }
  }
}

.course-content {
  padding: var(--spacing-lg);
}

.course-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.course-description {
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  height: 3em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-details {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);

  .detail-item {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: var(--text-light);

    i {
      margin-right: 5px;
      font-size: 1rem;
    }
  }
}

.course-rating {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);

  .stars {
    color: #FFD700;
    margin-right: 5px;
  }

  .rating-value {
    font-weight: 500;
    margin-right: 5px;
  }

  .reviews-count {
    font-size: 0.9rem;
    color: var(--text-light);
  }
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.course-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
}

.btn-enroll {
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  i {
    margin-left: 5px;
    transition: transform var(--transition-fast);
  }

  &:hover {
    background-color: var(--primary-dark);

    i {
      transform: translateX(3px);
    }
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.page-btn {
  display: flex;
  align-items: center;
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

  &.prev i {
    margin-right: 5px;
  }

  &.next i {
    margin-left: 5px;
  }
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &.active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
}

.page-dots {
  color: var(--text-light);
}

// 报名弹窗样式
.enroll-modal {
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