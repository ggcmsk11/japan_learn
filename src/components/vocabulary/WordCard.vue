<template>
  <div class="word-card">
    <div :class="['card-inner', { 'is-flipped': isFlipped }]">
      <div class="card-front">
        <div :class="['level-badge', levelClass]">{{ word.level }}</div>
        <div class="favorite-btn" @click.stop="toggleFavorite">
          <i :class="isFavorite ? 'ri-heart-fill' : 'ri-heart-line'"></i>
        </div>
        
        <div class="card-content">
          <h3 class="kanji">{{ word.kanji }}</h3>
          <p class="kana">{{ word.kana }}</p>
          <p class="meaning">{{ word.meaning }}</p>
          
          <div class="card-action">
            <p class="card-hint">点击查看例句</p>
          </div>
        </div>
      </div>
      
      <div class="card-back">
        <div :class="['level-badge', levelClass]">{{ word.level }}</div>
        <div class="favorite-btn" @click.stop="toggleFavorite">
          <i :class="isFavorite ? 'ri-heart-fill' : 'ri-heart-line'"></i>
        </div>
        
        <div class="card-content">
          <div class="examples" v-if="hasExample">
            <div class="example" v-if="currentExample.text">
              <p class="jp-text">{{ currentExample.text }}</p>
              <p v-if="currentExample.meaning" class="example-meaning">{{ currentExample.meaning }}</p>
            </div>
          </div>
          
          <div class="example-tabs">
            <button 
              v-if="word.example"
              :class="['tab-btn', { active: currentExampleIndex === 0 }]"
              @click.stop="setExample(0)"
            >
              例句1
            </button>
            <button 
              v-if="word.example2"
              :class="['tab-btn', { active: currentExampleIndex === 1 }]"
              @click.stop="setExample(1)"
            >
              例句2
            </button>
            <button 
              v-if="word.example3"
              :class="['tab-btn', { active: currentExampleIndex === 2 }]"
              @click.stop="setExample(2)"
            >
              例句3
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.word-card {
  perspective: 1000px;
  height: 280px;
  cursor: pointer;
  user-select: none;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.is-flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  background-color: white;
}

.card-back {
  transform: rotateY(180deg);
}

.level-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  
  &.level-n5 { background-color: #4CAF50; }
  &.level-n4 { background-color: #2196F3; }
  &.level-n3 { background-color: #FF9800; }
  &.level-n2 { background-color: #F44336; }
  &.level-n1 { background-color: #9C27B0; }
}

.favorite-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: 50%;
  
  i {
    font-size: 1rem;
    color: #ff6b6b;
    transition: all var(--transition-fast);
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    
    i {
      transform: scale(1.1);
    }
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: var(--spacing-lg);
  padding: 0 var(--spacing-sm);
}

.kanji {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.kana {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}

.meaning {
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.card-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: var(--spacing-md);
  text-align: center;
}

.examples {
  flex: 1;
  margin-bottom: var(--spacing-md);
}

.example {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius);

  .jp-text {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 4px;
    word-break: break-all;
  }

  .example-meaning {
    font-size: 0.9rem;
    color: var(--text-light);
  }
}

.example-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: auto;
  padding-top: var(--spacing-md);
}

.tab-btn {
  flex: 1;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  color: var(--text-color);
  font-size: 0.9rem;
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
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  word: {
    id: string
    kanji: string
    kana: string
    meaning: string
    example: string
    exampleMeaning?: string
    example2?: string
    example2Meaning?: string
    example3?: string
    example3Meaning?: string
    level: string
    tags?: string[]
  }
}>()

const emit = defineEmits(['reviewLater', 'markMastered', 'favorite'])

const isFlipped = ref(false)
const isFavorite = ref(false)
const currentExampleIndex = ref(0)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite', props.word.id, isFavorite.value)
}

const levelClass = computed(() => {
  switch (props.word.level) {
    case 'N5': return 'level-n5'
    case 'N4': return 'level-n4'
    case 'N3': return 'level-n3'
    case 'N2': return 'level-n2'
    case 'N1': return 'level-n1'
    default: return ''
  }
})

const currentExample = computed(() => {
  switch (currentExampleIndex.value) {
    case 0:
      return {
        text: props.word.example,
        meaning: props.word.exampleMeaning
      }
    case 1:
      return {
        text: props.word.example2,
        meaning: props.word.example2Meaning
      }
    case 2:
      return {
        text: props.word.example3,
        meaning: props.word.example3Meaning
      }
    default:
      return {
        text: '',
        meaning: ''
      }
  }
})

const hasExample = computed(() => {
  return props.word.example || props.word.example2 || props.word.example3
})

const setExample = (index: number) => {
  currentExampleIndex.value = index
}
</script>
