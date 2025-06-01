<template>
  <div class="vocabulary-game">
    <div class="game-header">
      <h3>单词记忆游戏</h3>
      <div class="game-stats">
        <div class="stat">
          <span class="stat-label">得分</span>
          <span class="stat-value">{{ score }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">剩余时间</span>
          <span class="stat-value">{{ formatTime(remainingTime) }}</span>
        </div>
      </div>
    </div>

    <div v-if="!gameStarted && !gameOver" class="game-intro">
      <p>测试你的日语词汇量！在限定时间内选择正确的中文含义。</p>
      <button class="btn-start" @click="startGame">
        开始游戏
        <i class="ri-gamepad-line"></i>
      </button>
    </div>

    <div v-else-if="gameStarted && !gameOver" class="game-content">
      <div class="word-display">
        <div class="kanji">{{ currentWord.kanji }}</div>
        <div class="kana">{{ currentWord.kana }}</div>
      </div>

      <div class="options">
        <button 
          v-for="(option, index) in currentOptions" 
          :key="index"
          class="option-btn"
          :class="{ 
            'correct': showAnswer && index === correctOptionIndex,
            'wrong': showAnswer && selectedOption === index && index !== correctOptionIndex
          }"
          @click="checkAnswer(index)"
          :disabled="showAnswer"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else class="game-over">
      <h3>游戏结束！</h3>
      <div class="final-score">
        <div class="score-value">{{ score }}</div>
        <div class="score-label">最终得分</div>
      </div>
      <div class="score-details">
        <div class="detail-item">
          <span class="detail-label">正确答案</span>
          <span class="detail-value">{{ correctAnswers }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">错误答案</span>
          <span class="detail-value">{{ wrongAnswers }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">正确率</span>
          <span class="detail-value">{{ accuracy }}%</span>
        </div>
      </div>
      <button class="btn-restart" @click="resetGame">
        再玩一次
        <i class="ri-restart-line"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'

const gameStarted = ref(false)
const gameOver = ref(false)
const score = ref(0)
const correctAnswers = ref(0)
const wrongAnswers = ref(0)
const remainingTime = ref(60) // 60 seconds
const timer = ref<number | null>(null)
const words = ref<any[]>([])
const currentWordIndex = ref(0)
const showAnswer = ref(false)
const selectedOption = ref<number | null>(null)

const currentWord = computed(() => words.value[currentWordIndex.value] || {})

const accuracy = computed(() => {
  const total = correctAnswers.value + wrongAnswers.value
  return total > 0 ? Math.round((correctAnswers.value / total) * 100) : 0
})

// Generate 3 wrong options and 1 correct option
const currentOptions = computed(() => {
  if (!currentWord.value) return []
  
  const correctMeaning = currentWord.value.meaning
  const otherWords = words.value.filter(w => w.meaning !== correctMeaning)
  const wrongOptions = shuffleArray(otherWords)
    .slice(0, 3)
    .map(w => w.meaning)
  
  const allOptions = [...wrongOptions, correctMeaning]
  return shuffleArray(allOptions)
})

const correctOptionIndex = computed(() => {
  return currentOptions.value.findIndex(option => option === currentWord.value?.meaning)
})

const formatTime = (seconds: number) => {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const fetchWords = async () => {
  try {
    const response = await axios.post('https://www.dlmy.tech/chunshua-api/chunshua_questions/vocabulary/wordCards', {
      userId: '20250309125643',
      token: '99b90b812938ea7929fc5f267f305843',
      user_phone: '15998658809',
      loginType: 2,
      useType: 0,
      userTypeUseWordId: 2025000488,
      wordCount: 20
    })

    if (response.data.code === 200) {
      words.value = response.data.data.map((word: any) => ({
        kanji: word.wordKanji,
        kana: word.wordKana,
        meaning: word.wordMeaning
      }))
      words.value = shuffleArray(words.value)
    }
  } catch (error) {
    console.error('Failed to fetch words:', error)
  }
}

const startGame = async () => {
  await fetchWords()
  if (words.value.length === 0) return
  
  gameStarted.value = true
  startTimer()
}

const startTimer = () => {
  timer.value = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      endGame()
    }
  }, 1000)
}

const checkAnswer = (index: number) => {
  selectedOption.value = index
  showAnswer.value = true
  
  if (index === correctOptionIndex.value) {
    score.value += 10
    correctAnswers.value++
  } else {
    wrongAnswers.value++
  }
  
  setTimeout(() => {
    showAnswer.value = false
    selectedOption.value = null
    nextWord()
  }, 1000)
}

const nextWord = () => {
  if (currentWordIndex.value < words.value.length - 1) {
    currentWordIndex.value++
  } else {
    endGame()
  }
}

const endGame = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  gameOver.value = true
}

const resetGame = () => {
  gameStarted.value = false
  gameOver.value = false
  score.value = 0
  correctAnswers.value = 0
  wrongAnswers.value = 0
  remainingTime.value = 60
  currentWordIndex.value = 0
  words.value = []
  showAnswer.value = false
  selectedOption.value = null
}
</script>

<style lang="scss" scoped>
.vocabulary-game {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  h3 {
    font-size: 1.3rem;
    margin: 0;
  }
}

.game-stats {
  display: flex;
  gap: var(--spacing-lg);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-label {
    font-size: 0.9rem;
    color: var(--text-light);
  }
  
  .stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
  }
}

.game-intro {
  text-align: center;
  padding: var(--spacing-xl) 0;
  
  p {
    color: var(--text-light);
    margin-bottom: var(--spacing-lg);
  }
}

.btn-start,
.btn-restart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  i {
    font-size: 1.2rem;
  }
}

.game-content {
  text-align: center;
}

.word-display {
  margin-bottom: var(--spacing-xl);
  
  .kanji {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
  }
  
  .kana {
    font-size: 1.2rem;
    color: var(--text-light);
  }
}

.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  max-width: 600px;
  margin: 0 auto;
}

.option-btn {
  background-color: var(--background-color);
  border: 2px solid var(--border-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    background-color: rgba(74, 144, 226, 0.1);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &.correct {
    background-color: rgba(46, 204, 113, 0.1);
    border-color: var(--success-color);
    color: var(--success-color);
  }
  
  &.wrong {
    background-color: rgba(231, 76, 60, 0.1);
    border-color: var(--error-color);
    color: var(--error-color);
  }
}

.game-over {
  text-align: center;
  padding: var(--spacing-xl) 0;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xl);
  }
}

.final-score {
  margin-bottom: var(--spacing-xl);
  
  .score-value {
    font-size: 4rem;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: var(--spacing-sm);
  }
  
  .score-label {
    color: var(--text-light);
  }
}

.score-details {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .detail-label {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 4px;
  }
  
  .detail-value {
    font-size: 1.2rem;
    font-weight: 600;
  }
}
</style>