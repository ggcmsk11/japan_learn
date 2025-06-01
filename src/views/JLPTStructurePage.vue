<template>
  <div class="jlpt-structure">
    <div class="page-header">
      <div class="container">
        <h1>JLPT 详细结构</h1>
        <p>了解每个 JLPT 级别中的具体题型和问题类型，帮助你全面掌握考试内容</p>
      </div>
    </div>

    <div class="container">
      <div class="level-buttons">
        <button 
          v-for="level in ['N1', 'N2', 'N3', 'N4', 'N5']"
          :key="level"
          :class="['level-btn', { active: currentLevel === level }]"
          @click="currentLevel = level"
        >
          {{ level }}
        </button>
      </div>

      <div class="section-grid">
        <div class="section-card">
          <div class="card-header">
            <i class="ri-file-text-line"></i>
            <h2>文字</h2>
          </div>
          <div class="question-list">
            <div 
              v-for="question in filteredQuestions.filter(q => q.tixing === '文字')"
              :key="question.questionBankId"
              class="question-item"
            >
              <div class="question-number">{{ question.questionBankId }}</div>
              <div class="question-content">
                <h3>{{ question.question }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="card-header">
            <i class="ri-book-open-line"></i>
            <h2>文法</h2>
          </div>
          <div class="question-list">
            <div 
              v-for="question in filteredQuestions.filter(q => q.tixing === '文法')"
              :key="question.questionBankId"
              class="question-item"
            >
              <div class="question-number">{{ question.questionBankId }}</div>
              <div class="question-content">
                <h3>{{ question.question }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="card-header">
            <i class="ri-book-read-line"></i>
            <h2>読解</h2>
          </div>
          <div class="question-list">
            <div 
              v-for="question in filteredQuestions.filter(q => q.tixing === '読解')"
              :key="question.questionBankId"
              class="question-item"
            >
              <div class="question-number">{{ question.questionBankId }}</div>
              <div class="question-content">
                <h3>{{ question.question }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="card-header">
            <i class="ri-volume-up-line"></i>
            <h2>聴解</h2>
          </div>
          <div class="question-list">
            <div 
              v-for="question in filteredQuestions.filter(q => q.tixing === '聴解')"
              :key="question.questionBankId"
              class="question-item"
            >
              <div class="question-number">{{ question.questionBankId }}</div>
              <div class="question-content">
                <h3>{{ question.question }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { questionBanks } from '../config/questionBanks'

const currentLevel = ref('N1')

const filteredQuestions = computed(() => {
  return questionBanks.filter(q => q.jlptLevel === currentLevel.value)
})
</script>

<style lang="scss" scoped>
.jlpt-structure {
  padding-bottom: var(--spacing-xxl);
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-sm);
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

.level-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.level-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: var(--background-color);
  color: var(--text-color);

  &:hover {
    background-color: var(--primary-light);
    color: white;
  }

  &.active {
    background-color: var(--primary-color);
    color: white;
  }
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.section-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);

  i {
    font-size: 1.5rem;
    color: var(--primary-color);
  }

  h2 {
    font-size: 1.3rem;
    margin: 0;
  }
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.question-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--background-color);
  }
}

.question-number {
  background-color: var(--primary-light);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.question-content {
  h3 {
    font-size: 1rem;
    margin: 0;
  }
}
</style>