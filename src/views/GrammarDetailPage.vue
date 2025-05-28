<template>
  <div class="grammar-detail">
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="back-button" @click="router.back()">
            <i class="ri-arrow-left-line"></i>
            返回
          </div>
          <h1>语法详情</h1>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="grammar-content">
        <div class="level-badge">{{ grammar?.jlptLevel }}</div>
        <h2 class="grammar-title">{{ grammar?.grammarName }}</h2>
        
        <section class="explanation-section">
          <h3>
            <i class="ri-book-open-line"></i>
            説明
          </h3>
          <p class="jp-text">{{ grammar?.grammarMeaning }}</p>
        </section>
        
        <section class="examples-section">
          <h3>
            <i class="ri-file-list-line"></i>
            例文
          </h3>
          <div class="example-cards">
            <div v-if="grammar?.exampleSentence1" class="example-card">
              <div class="example-number">例文 1</div>
              <p class="example-japanese jp-text">{{ grammar.exampleSentence1 }}</p>
              <p class="example-chinese">{{ grammar.exampleTranslation1 }}</p>
            </div>
            <div v-if="grammar?.exampleSentence2" class="example-card">
              <div class="example-number">例文 2</div>
              <p class="example-japanese jp-text">{{ grammar.exampleSentence2 }}</p>
              <p class="example-chinese">{{ grammar.exampleTranslation2 }}</p>
            </div>
            <div v-if="grammar?.exampleSentence3" class="example-card">
              <div class="example-number">例文 3</div>
              <p class="example-japanese jp-text">{{ grammar.exampleSentence3 }}</p>
              <p class="example-chinese">{{ grammar.exampleTranslation3 }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

interface Grammar {
  grammarId: number
  grammarName: string
  grammarForm: string
  grammarMeaning: string
  exampleSentence1: string
  exampleTranslation1: string
  exampleSentence2: string
  exampleTranslation2: string
  exampleSentence3: string
  exampleTranslation3: string
  jlptLevel: string
}

const grammar = ref<Grammar | null>(null)

onMounted(() => {
  // Check authentication
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: route.fullPath }
    })
    return
  }

  // Get grammar data from router state
  const state = router.currentRoute.value.state
  if (state && 'grammar' in state) {
    grammar.value = state.grammar as Grammar
  } else {
    // If no data in state, go back to grammar list
    router.push('/grammar')
  }
})
</script>

<style lang="scss" scoped>
.grammar-detail {
  padding-bottom: var(--spacing-xxl);
  min-height: calc(100vh - 60px);
  background-color: var(--background-color);
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);

  .header-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    i {
      font-size: 1.2rem;
    }
  }

  h1 {
    font-size: 2rem;
    margin: 0;
  }
}

.grammar-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.level-badge {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background-color: var(--primary-color);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 500;
}

.grammar-title {
  font-size: 2rem;
  margin-bottom: var(--spacing-xl);
  padding-right: 100px;
  color: var(--primary-color);
}

section {
  margin-bottom: var(--spacing-xl);

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-lg);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    i {
      font-size: 1.4rem;
    }

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: var(--border-color);
      margin-left: var(--spacing-md);
    }
  }
}

.explanation-section {
  .jp-text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-color);
    background-color: var(--background-color);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
  }
}

.example-cards {
  display: grid;
  gap: var(--spacing-md);
}

.example-card {
  background-color: var(--background-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
  position: relative;

  .example-number {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    font-size: 0.9rem;
    color: var(--text-light);
  }

  .example-japanese {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-md);
    line-height: 1.8;
  }

  .example-chinese {
    color: var(--text-light);
    font-size: 1.1rem;
    line-height: 1.6;
    padding-top: var(--spacing-md);
    border-top: 1px dashed var(--border-color);
  }
}
</style>