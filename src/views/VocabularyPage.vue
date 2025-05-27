```vue
<template>
  <div class="vocabulary-page">
    <div class="page-header">
      <div class="container">
        <h1>单词学习</h1>
        <p>基于艾宾浩斯记忆曲线的高效单词学习系统</p>
      </div>
    </div>

    <div class="container">
      <div class="level-filters">
        <button 
          v-for="level in ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']" 
          :key="level"
          :class="['level-btn', { active: currentLevel === level }]"
          @click="setLevel(level)"
        >
          {{ level }}
        </button>
      </div>

      <div v-if="loading && !words.length" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else-if="error" class="error-state">
        <i class="ri-error-warning-line"></i>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchWords">重试</button>
      </div>

      <div v-else class="word-cards">
        <WordCard 
          v-for="word in words"
          :key="word.wordId"
          :word="{
            id: word.wordId.toString(),
            kanji: word.wordKanji,
            kana: word.wordKana,
            meaning: word.wordMeaning,
            example: word.wordExampleSentence1,
            exampleMeaning: word.wordExampleTranslation1,
            example2: word.wordExampleSentence2,
            example2Meaning: word.wordExampleTranslation2,
            example3: word.wordExampleSentence3,
            example3Meaning: word.wordExampleTranslation3,
            level: word.jlptLevel,
            tags: word.tags ? word.tags.split(',') : []
          }"
          @markKnown="handleMarkKnown"
          @markUnknown="handleMarkUnknown"
          @favorite="handleFavorite"
        />
      </div>

      <div class="load-more" v-if="words.length > 0">
        <button 
          class="btn btn-primary" 
          @click="loadMore"
          :disabled="loading"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import WordCard from '../components/vocabulary/WordCard.vue'

// API配置
const API_URL = 'https://www.dlmy.tech/chunshua-api/chunshua_questions/vocabulary/wordCards'
const DEFAULT_CONFIG = {
  userId: '20250309125643',
  token: '99b90b812938ea7929fc5f267f305843',
  user_phone: '15998658809',
  loginType: 0,
  useType: 0,
  userTypeUseWordId: 2025000488,
  wordCount: 10
}

interface WordResponse {
  wordId: number
  wordKanji: string
  wordKana: string
  wordMeaning: string
  jlptLevel: string
  tags: string
  wordExampleSentence1: string
  wordExampleTranslation1: string
  wordExampleSentence2: string
  wordExampleTranslation2: string
  wordExampleSentence3: string
  wordExampleTranslation3: string
}

const currentLevel = ref('全部')
const words = ref<WordResponse[]>([])
const loading = ref(false)
const error = ref('')

const setLevel = (level: string) => {
  currentLevel.value = level
  words.value = []
  fetchWords()
}

const fetchWords = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.post(API_URL, {
      ...DEFAULT_CONFIG,
      jpltLevel: currentLevel.value === '全部' ? 'N' : currentLevel.value
    })

    if (response.data.code === 200) {
      words.value = [...words.value, ...response.data.data]
    } else {
      throw new Error(response.data.msg || '获取单词失败')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取单词失败，请稍后重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  fetchWords()
}

const handleMarkKnown = (wordId: string) => {
  ElMessage.success('已标记为已掌握')
}

const handleMarkUnknown = (wordId: string) => {
  ElMessage.success('已标记为待复习')
}

const handleFavorite = (wordId: string, isFavorite: boolean) => {
  ElMessage.success(isFavorite ? '已添加到收藏' : '已取消收藏')
}

onMounted(() => {
  fetchWords()
})
</script>

<style lang="scss" scoped>
.vocabulary-page {
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

.level-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.level-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
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

.word-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
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
```