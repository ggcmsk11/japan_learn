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
              @click="filterGrammar('level', level)"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>类型</label>
          <div class="filter-buttons">
            <button 
              v-for="type in types"
              :key="type"
              :class="['filter-btn', { active: currentType === type }]"
              @click="filterGrammar('type', type)"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div class="grammar-grid">
        <div 
          v-for="point in filteredGrammarPoints" 
          :key="point.id" 
          class="grammar-card"
          @click="navigateToDetail(point.id)"
        >
          <div class="level-badge">{{ point.level }}</div>
          <h3>{{ point.title }}</h3>
          <p class="explanation">{{ point.explanation }}</p>
          
          <div class="usage-list">
            <div class="usage-item" v-for="(usage, index) in point.usage" :key="index">
              {{ usage }}
            </div>
          </div>
          
          <button class="btn-detail">
            查看详情
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentLevel = ref('全部')
const currentType = ref('全部')

const levels = ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']
const types = ['全部', '助词', '时态', '敬语', '条件', '被动', '使役', '授受']

interface GrammarPoint {
  id: string
  title: string
  level: string
  type: string
  explanation: string
  usage: string[]
}

const grammarPoints = ref<GrammarPoint[]>([
  {
    id: 'n3-001',
    title: '〜ようになる',
    level: 'N3',
    type: '时态',
    explanation: '表示状态或能力的变化。用于描述从"不能做"到"能做"的变化，或是新习惯的养成。',
    usage: [
      '動詞（辞書形）+ ようになる',
      '動詞（ない形）+ ようになる',
      'イ形容詞 + ようになる',
      'ナ形容詞/名詞 + になる'
    ]
  },
  {
    id: 'n3-002',
    title: '〜てしまう',
    level: 'N3',
    type: '时态',
    explanation: '表示动作的完成，有时带有遗憾或后悔的语气。也可以表示某事的彻底完成。',
    usage: [
      '動詞（て形）+ しまう',
      '動詞（て形）+ ちゃう（口語）',
      '動詞（て形）+ じゃう（口語）'
    ]
  },
  {
    id: 'n4-001',
    title: '〜ている',
    level: 'N4',
    type: '时态',
    explanation: '表示动作的进行或状态的持续。',
    usage: [
      '動詞（て形）+ いる',
      '動詞（て形）+ います（敬体）'
    ]
  },
  {
    id: 'n5-001',
    title: 'は vs が',
    level: 'N5',
    type: '助词',
    explanation: '区分主题和主语的使用。は用于引出话题，が用于强调或指明主语。',
    usage: [
      '名詞 + は',
      '名詞 + が'
    ]
  }
])

const filterGrammar = (filterType: string, value: string) => {
  if (filterType === 'level') {
    currentLevel.value = value
  } else if (filterType === 'type') {
    currentType.value = value
  }
}

const filteredGrammarPoints = computed(() => {
  let filtered = grammarPoints.value

  // 应用等级筛选
  if (currentLevel.value !== '全部') {
    filtered = filtered.filter(point => point.level === currentLevel.value)
  }

  // 应用类型筛选
  if (currentType.value !== '全部') {
    filtered = filtered.filter(point => point.type === currentType.value)
  }

  return filtered
})

const navigateToDetail = (grammarId: string) => {
  router.push(`/grammar/${grammarId}`)
}
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

.grammar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.grammar-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);

    .btn-detail {
      background-color: var(--primary-dark);

      i {
        transform: translateX(4px);
      }
    }
  }
}

.level-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

h3 {
  font-size: 1.3rem;
  margin-bottom: var(--spacing-md);
  padding-right: 60px;
}

.explanation {
  color: var(--text-light);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.usage-list {
  margin-bottom: var(--spacing-md);
}

.usage-item {
  background-color: var(--background-color);
  padding: var(--spacing-sm);
  border-radius: 4px;
  margin-bottom: var(--spacing-xs);
  font-family: monospace;
  font-size: 0.95rem;
}

.btn-detail {
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
}
</style>