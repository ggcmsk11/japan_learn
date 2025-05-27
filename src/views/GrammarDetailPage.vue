<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const grammarId = route.params.id

const grammarPoint = ref({
  id: 'n3-001',
  title: '〜ようになる',
  level: 'N3',
  explanation: '状態や能力の変化を表す文型。以前はできなかったことができるようになったり、以前とは異なる習慣が身についたことを表現します。',
  usage: [
    '動詞（辞書形）+ ようになる',
    '動詞（ない形）+ ようになる',
    'イ形容詞 + ようになる',
    'ナ形容詞/名詞 + になる'
  ],
  examples: [
    {
      japanese: '日本に来てから、納豆が食べられるようになりました。',
      chinese: '来到日本后，开始能吃纳豆了。',
      points: '以前は食べられなかった納豆が食べられるという変化を表現'
    },
    {
      japanese: '毎日運動するようになって、体の調子がよくなりました。',
      chinese: '开始每天运动后，身体状况变好了。',
      points: '新しい習慣が身についたことを表現'
    },
    {
      japanese: '子供の頃は野菜が嫌いでしたが、大人になって好きになりました。',
      chinese: '小时候讨厌蔬菜，长大后开始喜欢了。',
      points: '好みの変化を表現'
    }
  ],
  relatedGrammar: [
    {
      pattern: '〜ことになる',
      explanation: '決定や結果を表す'
    },
    {
      pattern: '〜つつある',
      explanation: '変化の途中を表す'
    }
  ],
  exercises: [
    {
      question: '私は日本語の勉強を始めてから、（　　）。',
      options: [
        'アニメが理解できるようになりました',
        'アニメが理解できることになりました',
        'アニメが理解できてなりました',
        'アニメが理解できませんようになりました'
      ],
      correctAnswer: 0,
      explanation: '能力の向上による変化を表現するため、「〜ようになる」が適切です。'
    }
  ]
})

const isExerciseAnswered = ref(false)
const selectedAnswer = ref<number | null>(null)
const showExplanation = ref(false)

const checkAnswer = (index: number) => {
  selectedAnswer.value = index
  isExerciseAnswered.value = true
  showExplanation.value = true
}

const resetExercise = () => {
  isExerciseAnswered.value = false
  selectedAnswer.value = null
  showExplanation.value = false
}
</script>

<template>
  <div class="grammar-detail">
    <div class="container">
      <div class="grammar-header">
        <div class="level-badge">{{ grammarPoint.level }}</div>
        <h1 class="grammar-title">{{ grammarPoint.title }}</h1>
      </div>
      
      <div class="grammar-content">
        <section class="explanation-section">
          <h2>説明</h2>
          <p class="jp-text">{{ grammarPoint.explanation }}</p>
        </section>
        
        <section class="usage-section">
          <h2>使い方</h2>
          <ul class="usage-list">
            <li v-for="(usage, index) in grammarPoint.usage" :key="index">
              {{ usage }}
            </li>
          </ul>
        </section>
        
        <section class="examples-section">
          <h2>例文</h2>
          <div class="example-cards">
            <div v-for="(example, index) in grammarPoint.examples" :key="index" class="example-card">
              <p class="example-japanese jp-text">{{ example.japanese }}</p>
              <p class="example-chinese">{{ example.chinese }}</p>
              <p class="example-points">{{ example.points }}</p>
            </div>
          </div>
        </section>
        
        <section class="related-grammar-section">
          <h2>関連文法</h2>
          <div class="related-grammar-list">
            <div v-for="(grammar, index) in grammarPoint.relatedGrammar" :key="index" class="related-grammar-item">
              <h3>{{ grammar.pattern }}</h3>
              <p>{{ grammar.explanation }}</p>
            </div>
          </div>
        </section>
        
        <section class="exercise-section">
          <h2>練習問題</h2>
          <div class="exercise-card" v-for="(exercise, exerciseIndex) in grammarPoint.exercises" :key="exerciseIndex">
            <p class="exercise-question jp-text">{{ exercise.question }}</p>
            
            <div class="exercise-options">
              <button 
                v-for="(option, optionIndex) in exercise.options" 
                :key="optionIndex"
                :class="[
                  'option-button',
                  {
                    'correct': isExerciseAnswered && optionIndex === exercise.correctAnswer,
                    'incorrect': isExerciseAnswered && selectedAnswer === optionIndex && optionIndex !== exercise.correctAnswer,
                    'selected': selectedAnswer === optionIndex
                  }
                ]"
                @click="checkAnswer(optionIndex)"
                :disabled="isExerciseAnswered"
              >
                {{ option }}
              </button>
            </div>
            
            <div v-if="showExplanation" class="exercise-explanation">
              <p>{{ exercise.explanation }}</p>
              <button class="btn btn-primary" @click="resetExercise">
                次の問題
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grammar-detail {
  padding: var(--spacing-xl) 0;
}

.grammar-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.level-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
}

.grammar-title {
  font-size: 2rem;
  font-weight: 700;
}

.grammar-content {
  section {
    background-color: white;
    border-radius: var(--border-radius);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-lg);
      color: var(--primary-color);
      
      &::after {
        content: '';
        display: block;
        width: 50px;
        height: 3px;
        background-color: var(--primary-color);
        margin-top: var(--spacing-xs);
      }
    }
  }
}

.usage-list {
  list-style: none;
  padding: 0;
  
  li {
    background-color: var(--background-color);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-sm);
    font-family: monospace;
    font-size: 1.1rem;
  }
}

.example-cards {
  display: grid;
  gap: var(--spacing-md);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
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
    margin-bottom: var(--spacing-sm);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
  }
  
  .example-points {
    font-size: 0.9rem;
    color: var(--text-light);
  }
}

.related-grammar-list {
  display: grid;
  gap: var(--spacing-md);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.related-grammar-item {
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  
  h3 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    font-size: 0.9rem;
    color: var(--text-light);
  }
}

.exercise-card {
  background-color: var(--background-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  
  .exercise-question {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-lg);
  }
}

.exercise-options {
  display: grid;
  gap: var(--spacing-md);
}

.option-button {
  width: 100%;
  padding: var(--spacing-md);
  text-align: left;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background-color: var(--background-color);
    border-color: var(--primary-color);
  }
  
  &.selected {
    border-color: var(--primary-color);
  }
  
  &.correct {
    background-color: rgba(46, 204, 113, 0.1);
    border-color: var(--success-color);
    color: var(--success-color);
  }
  
  &.incorrect {
    background-color: rgba(231, 76, 60, 0.1);
    border-color: var(--error-color);
    color: var(--error-color);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.exercise-explanation {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  
  p {
    margin-bottom: var(--spacing-md);
    color: var(--text-light);
  }
}
</style>