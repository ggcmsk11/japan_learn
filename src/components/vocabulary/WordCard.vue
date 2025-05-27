```vue
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
    level: string
    tags?: string[]
  }
}>()

const emit = defineEmits(['reviewLater', 'markMastered', 'favorite'])

const isFlipped = ref(false)
const isFavorite = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite', props.word.id, isFavorite.value)
}

const handleReviewLater = (event: Event) => {
  event.stopPropagation()
  emit('reviewLater', props.word.id)
}

const handleMarkMastered = (event: Event) => {
  event.stopPropagation()
  emit('markMastered', props.word.id)
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
</script>

<template>
  <div :class="['word-card', { 'is-flipped': isFlipped }]" @click="toggleFlip">
    <div class="card-inner">
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
          <div class="examples">
            <div class="example" v-if="word.example">
              <p class="jp-text">{{ word.example }}</p>
              <p v-if="word.exampleMeaning" class="example-meaning">{{ word.exampleMeaning }}</p>
            </div>
            <div class="example" v-if="word.example2">
              <p class="jp-text">{{ word.example2 }}</p>
              <p v-if="word.example2Meaning" class="example-meaning">{{ word.example2Meaning }}</p>
            </div>
            <div class="example" v-if="word.example3">
              <p class="jp-text">{{ word.example3 }}</p>
              <p v-if="word.example3Meaning" class="example-meaning">{{ word.example3Meaning }}</p>
            </div>
          </div>
          
          <div class="tags" v-if="word.tags && word.tags.length">
            <span v-for="(tag, index) in word.tags" :key="index" class="tag">{{ tag }}</span>
          </div>
          
          <div class="card-actions">
            <button class="action-btn review-later" @click="handleReviewLater">
              <i class="ri-time-line"></i>
              稍后复习
            </button>
            <button class="action-btn mark-mastered" @click="handleMarkMastered">
              <i class="ri-check-double-line"></i>
              已掌握
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
  height: 250px;
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
}

.card-front {
  background-color: white;
}

.card-back {
  background-color: white;
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
  
  &.level-n5 {
    background-color: #4CAF50;
  }
  
  &.level-n4 {
    background-color: #2196F3;
  }
  
  &.level-n3 {
    background-color: #FF9800;
  }
  
  &.level-n2 {
    background-color: #F44336;
  }
  
  &.level-n1 {
    background-color: #9C27B0;
  }
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
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  margin-top: var(--spacing-lg);
}

.kanji {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.kana {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: var(--spacing-sm);
}

.meaning {
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
}

.card-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: var(--spacing-md);
}

.examples {
  margin-bottom: var(--spacing-md);
}

.example {
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.jp-text {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 4px;
}

.example-meaning {
  font-size: 0.9rem;
  color: var(--text-light);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-bottom: var(--spacing-sm);
}

.tag {
  background-color: #f0f0f0;
  color: var(--text-light);
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  i {
    margin-right: 4px;
    font-size: 1rem;
  }
  
  &.review-later {
    background-color: #f8f9fa;
    color: var(--text-color);
    
    &:hover {
      background-color: #e9ecef;
    }
  }
  
  &.mark-mastered {
    background-color: var(--success-color);
    color: white;
    
    &:hover {
      background-color: darken(#2ecc71, 10%);
    }
  }
}
</style>
```