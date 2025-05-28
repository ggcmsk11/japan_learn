<template>
  <div class="grammar-detail">
    <div class="page-header">
      <div class="container">
        <h1>语法详情</h1>
      </div>
    </div>

    <div class="container">
      <div class="grammar-content">
        <div class="level-badge">{{ grammar?.jlptLevel }}</div>
        <h2 class="grammar-title">{{ grammar?.grammarName }}</h2>
        
        <section class="explanation-section">
          <h3>説明</h3>
          <p class="jp-text">{{ grammar?.grammarMeaning }}</p>
        </section>
        
        <section class="examples-section">
          <h3>例文</h3>
          <div class="example-cards">
            <div v-if="grammar?.exampleSentence1" class="example-card">
              <p class="example-japanese jp-text">{{ grammar.exampleSentence1 }}</p>
              <p class="example-chinese">{{ grammar.exampleTranslation1 }}</p>
            </div>
            <div v-if="grammar?.exampleSentence2" class="example-card">
              <p class="example-japanese jp-text">{{ grammar.exampleSentence2 }}</p>
              <p class="example-chinese">{{ grammar.exampleTranslation2 }}</p>
            </div>
            <div v-if="grammar?.exampleSentence3" class="example-card">
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
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const grammarId = route.params.id

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

// Get grammar points from parent component
const grammarPoints = inject<Ref<Grammar[]>>('grammarPoints')
const grammar = ref<Grammar | null>(null)

onMounted(() => {
  if (grammarPoints?.value) {
    grammar.value = grammarPoints.value.find(g => g.grammarId.toString() === grammarId)
  }
})
</script>

<style lang="scss" scoped>
.grammar-detail {
  padding-bottom: var(--spacing-xxl);
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: 2rem;
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
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.grammar-title {
  font-size: 2rem;
  margin-bottom: var(--spacing-xl);
  padding-right: 100px;
}

section {
  margin-bottom: var(--spacing-xl);

  h3 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-lg);
    color: var(--primary-color);
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

  .example-japanese {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-sm);
  }

  .example-chinese {
    color: var(--text-light);
  }
}
</style>