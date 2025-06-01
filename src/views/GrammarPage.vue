<template>
  <div class="grammar-page">
    <div class="page-header">
      <div class="container">
        <h1>语法学习</h1>
        <p>系统掌握日语语法知识</p>
      </div>
    </div>

    <div class="container">
      <div class="grammar-filters">
        <div class="filter-group">
          <label>等级</label>
          <div class="filter-buttons">
            <button 
              v-for="level in levels"
              :key="level"
              :class="['filter-btn', { active: currentLevel === level }]"
              @click="currentLevel = level"
            >
              {{ level }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading && !grammarPoints.length" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else-if="error" class="error-state">
        <i class="ri-error-warning-line"></i>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchGrammar">重试</button>
      </div>

      <div v-else class="grammar-grid">
        <div v-for="type in filteredTypes" :key="type" class="question-type-group">
          <h3 class="type-title">{{ type }}</h3>
          <div class="questions-list">
            <div 
              v-for="grammar in getGrammarByType(type)" 
              :key="grammar.grammarId"
              class="question-card"
              @click="startPractice(grammar)"
            >
              <div :class="['question-id', getLevelClass(grammar.jlptLevel)]">
                {{ grammar.grammarId }}
              </div>
              <div class="question-info">
                <h4 class="question-title">{{ grammar.grammarName }}</h4>
                <p class="question-description">{{ grammar.grammarMeaning }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="load-more" v-if="grammarPoints.length > 0">
        <button 
          class="btn btn-primary" 
          @click="loadMore"
          :disabled="loading"
        >
          {{ loading ? '加载中...' : '再来一组语法' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const currentLevel = ref('全部')
const grammarPoints = ref([])
const loading = ref(false)
const error = ref('')

const levels = ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']
const types = ['文字', '文法', '読解', '聴解']

const filteredTypes = computed(() => {
  const types = new Set(grammarPoints.value.map(g => g.type))
  return Array.from(types)
})

const getGrammarByType = (type: string) => {
  return grammarPoints.value.filter(g => g.type === type)
}

const getLevelClass = (level: string) => {
  return {
    'level-n1': level === 'N1',
    'level-n2': level === 'N2',
    'level-n3': level === 'N3',
    'level-n4': level === 'N4',
    'level-n5': level === 'N5'
  }
}

const fetchGrammar = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/auth/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('https://www.dlmy.tech/chunshua-api/chunshua_questions/questions/getYuFaIndTi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: authStore.userInfo?.userId || '',
        token: authStore.token || '',
        user_phone: authStore.phoneNumber?.replace(/^\+/, '') || '',
        jpltLevel: currentLevel.value === '全部' ? 'N' : currentLevel.value,
        loginType: 2,
        useType: 0,
        userTypeUseGrammarId: 2025000241
      })
    })

    const data = await response.json()

    if (data.code === 200) {
      grammarPoints.value = data.data
    } else {
      throw new Error(data.msg || '获取语法失败')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取语法失败，请稍后重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  fetchGrammar()
}

const startPractice = (grammar: any) => {
  if (!authStore.isLoggedIn) {
    router.push('/auth/login')
    return
  }

  const level = grammar.jlptLevel as keyof typeof authStore.permissions
  if (!authStore.hasPermission(level)) {
    ElMessage.warning('请先开通会员')
    return
  }

  // Store grammar data in sessionStorage
  sessionStorage.setItem('currentGrammar', JSON.stringify(grammar))
  router.push(`/grammar/${grammar.grammarId}`)
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/auth/login')
    return
  }
  fetchGrammar()
})
</script>

<style lang="scss" scoped>
.grammar-page {
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

.grammar-filters {
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
}

.filter-group {
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

.question-type-group {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.type-title {
  font-size: 1.3rem;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.questions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.question-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
}

.question-id {
  padding: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  min-width: 50px;
  text-align: center;

  &.level-n1 {
    background-color: #9C27B0;
  }

  &.level-n2 {
    background-color: #F44336;
  }

  &.level-n3 {
    background-color: #FF9800;
  }

  &.level-n4 {
    background-color: #2196F3;
  }

  &.level-n5 {
    background-color: #4CAF50;
  }
}

.question-info {
  flex: 1;
}

.question-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.question-description {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.4;
}

.loading-state,
.error-state {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.error-state {
  i {
    font-size: 3rem;
    color: var(--error-color);
    margin-bottom: var(--spacing-md);
  }

  p {
    color: var(--text-light);
    margin-bottom: var(--spacing-md);
  }
}

.load-more {
  text-align: center;
  margin-top: var(--spacing-xl);

  button {
    padding: 12px 30px;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style>