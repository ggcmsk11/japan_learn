<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface ExamSection {
  id: string
  title: string
  questions: Question[]
}

const props = defineProps<{
  exam: {
    id: string
    title: string
    level: string
    year: string
    timeLimit: number
    sections: ExamSection[]
  }
}>()

const emit = defineEmits(['complete'])

const currentSection = ref(0)
const currentQuestion = ref(0)
const userAnswers = ref<Record<string, number | null>>({})
const remainingTime = ref(props.exam.timeLimit * 60) // in seconds
const isExamActive = ref(false)
const showResults = ref(false)
const timer = ref<number | null>(null)

// Initialize userAnswers
onMounted(() => {
  props.exam.sections.forEach(section => {
    section.questions.forEach(question => {
      userAnswers.value[question.id] = null
    })
  })
})

const startExam = () => {
  isExamActive.value = true
  startTimer()
}

const startTimer = () => {
  timer.value = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      finishExam()
    }
  }, 1000)
}

const pauseTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

onUnmounted(() => {
  pauseTimer()
})

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const currentSectionData = computed(() => {
  return props.exam.sections[currentSection.value]
})

const currentQuestionData = computed(() => {
  return currentSectionData.value.questions[currentQuestion.value]
})

const answeredQuestionsCount = computed(() => {
  return Object.values(userAnswers.value).filter(answer => answer !== null).length
})

const totalQuestionsCount = computed(() => {
  return Object.keys(userAnswers.value).length
})

const progressPercentage = computed(() => {
  return (answeredQuestionsCount.value / totalQuestionsCount.value) * 100
})

const selectAnswer = (questionId: string, optionIndex: number) => {
  userAnswers.value[questionId] = optionIndex
}

const goToPrevQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  } else if (currentSection.value > 0) {
    currentSection.value--
    currentQuestion.value = props.exam.sections[currentSection.value].questions.length - 1
  }
}

const goToNextQuestion = () => {
  if (currentQuestion.value < currentSectionData.value.questions.length - 1) {
    currentQuestion.value++
  } else if (currentSection.value < props.exam.sections.length - 1) {
    currentSection.value++
    currentQuestion.value = 0
  }
}

const finishExam = () => {
  pauseTimer()
  showResults.value = true
  
  // Calculate results
  const results = {
    totalQuestions: totalQuestionsCount.value,
    answeredQuestions: answeredQuestionsCount.value,
    correctAnswers: countCorrectAnswers(),
    timeSpent: props.exam.timeLimit * 60 - remainingTime.value,
    accuracy: 0
  }
  
  results.accuracy = (results.correctAnswers / results.totalQuestions) * 100
  
  emit('complete', results)
}

const countCorrectAnswers = (): number => {
  let correct = 0
  
  props.exam.sections.forEach(section => {
    section.questions.forEach(question => {
      if (userAnswers.value[question.id] === question.correctAnswer) {
        correct++
      }
    })
  })
  
  return correct
}

const isAnswerCorrect = (questionId: string): boolean => {
  const question = findQuestionById(questionId)
  return question ? userAnswers.value[questionId] === question.correctAnswer : false
}

const findQuestionById = (questionId: string): Question | undefined => {
  for (const section of props.exam.sections) {
    const question = section.questions.find(q => q.id === questionId)
    if (question) return question
  }
  return undefined
}
</script>

<template>
  <div class="exam-simulator">
    <div v-if="!isExamActive && !showResults" class="exam-intro">
      <h2>{{ exam.title }}</h2>
      <div class="exam-info">
        <div class="info-item">
          <i class="ri-file-list-3-line"></i>
          <span>レベル: {{ exam.level }}</span>
        </div>
        <div class="info-item">
          <i class="ri-calendar-line"></i>
          <span>年度: {{ exam.year }}</span>
        </div>
        <div class="info-item">
          <i class="ri-time-line"></i>
          <span>制限時間: {{ exam.timeLimit }}分</span>
        </div>
        <div class="info-item">
          <i class="ri-question-line"></i>
          <span>問題数: {{ totalQuestionsCount }}</span>
        </div>
      </div>
      
      <div class="section-overview">
        <h3>セクション</h3>
        <div class="section-list">
          <div v-for="(section, index) in exam.sections" :key="section.id" class="section-item">
            <span class="section-number">{{ index + 1 }}</span>
            <div class="section-details">
              <h4>{{ section.title }}</h4>
              <p>{{ section.questions.length }}問</p>
            </div>
          </div>
        </div>
      </div>
      
      <button class="btn btn-primary start-btn" @click="startExam">
        <i class="ri-play-circle-line"></i>
        試験を開始する
      </button>
    </div>
    
    <div v-else-if="isExamActive && !showResults" class="exam-active">
      <div class="exam-header">
        <div class="exam-timer">
          <i class="ri-time-line"></i>
          <span :class="{ 'time-warning': remainingTime < 300 }">{{ formatTime(remainingTime) }}</span>
        </div>
        
        <div class="exam-progress">
          <div class="progress-text">
            {{ answeredQuestionsCount }}/{{ totalQuestionsCount }}問回答済み
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
        </div>
        
        <button class="finish-btn" @click="finishExam">
          <i class="ri-check-double-line"></i>
          終了する
        </button>
      </div>
      
      <div class="question-container">
        <div class="section-title">
          <h3>{{ currentSectionData.title }} - 問題 {{ currentQuestion + 1 }}/{{ currentSectionData.questions.length }}</h3>
        </div>
        
        <div class="question-content">
          <p class="question-text jp-text">{{ currentQuestionData.text }}</p>
          
          <div class="answer-options">
            <label 
              v-for="(option, index) in currentQuestionData.options" 
              :key="index"
              :class="['option-item', { 'selected': userAnswers[currentQuestionData.id] === index }]"
            >
              <input 
                type="radio" 
                :checked="userAnswers[currentQuestionData.id] === index"
                @change="selectAnswer(currentQuestionData.id, index)"
              >
              <span class="option-text jp-text">{{ option }}</span>
            </label>
          </div>
        </div>
        
        <div class="question-navigation">
          <button class="nav-btn prev" @click="goToPrevQuestion" :disabled="currentSection === 0 && currentQuestion === 0">
            <i class="ri-arrow-left-s-line"></i>
            前の問題
          </button>
          <button class="nav-btn next" @click="goToNextQuestion" :disabled="currentSection === exam.sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1">
            次の問題
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="exam-results">
      <h2>試験結果</h2>
      
      <div class="results-summary">
        <div class="result-card">
          <div class="result-icon correct">
            <i class="ri-check-line"></i>
          </div>
          <div class="result-value">{{ countCorrectAnswers() }}</div>
          <div class="result-label">正解</div>
        </div>
        
        <div class="result-card">
          <div class="result-icon incorrect">
            <i class="ri-close-line"></i>
          </div>
          <div class="result-value">{{ totalQuestionsCount - countCorrectAnswers() }}</div>
          <div class="result-label">不正解</div>
        </div>
        
        <div class="result-card">
          <div class="result-icon accuracy">
            <i class="ri-percent-line"></i>
          </div>
          <div class="result-value">{{ Math.round((countCorrectAnswers() / totalQuestionsCount) * 100) }}%</div>
          <div class="result-label">正確度</div>
        </div>
        
        <div class="result-card">
          <div class="result-icon time">
            <i class="ri-time-line"></i>
          </div>
          <div class="result-value">{{ formatTime(props.exam.timeLimit * 60 - remainingTime) }}</div>
          <div class="result-label">所要時間</div>
        </div>
      </div>
      
      <div class="answers-review">
        <h3>解答の確認</h3>
        
        <div v-for="(section, sectionIndex) in exam.sections" :key="section.id" class="review-section">
          <h4>{{ section.title }}</h4>
          
          <div class="review-questions">
            <div 
              v-for="(question, questionIndex) in section.questions" 
              :key="question.id"
              class="review-question"
            >
              <div class="question-number">Q{{ sectionIndex + 1 }}-{{ questionIndex + 1 }}</div>
              <div :class="['answer-status', isAnswerCorrect(question.id) ? 'correct' : 'incorrect']">
                <i :class="isAnswerCorrect(question.id) ? 'ri-check-line' : 'ri-close-line'"></i>
              </div>
              
              <div v-if="!isAnswerCorrect(question.id)" class="explanation">
                <div class="explanation-title">正解と解説</div>
                <div class="correct-answer">
                  正解: {{ question.options[question.correctAnswer] }}
                </div>
                <div v-if="question.explanation" class="explanation-text">
                  {{ question.explanation }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="results-actions">
        <button class="btn btn-primary" @click="$emit('complete')">
          別の試験を選ぶ
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exam-simulator {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.exam-intro {
  padding: var(--spacing-xl);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: var(--spacing-lg);
  }
}

.exam-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.info-item {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  
  i {
    font-size: 1.2rem;
    color: var(--primary-color);
    margin-right: var(--spacing-sm);
  }
  
  span {
    font-weight: 500;
  }
}

.section-overview {
  margin-bottom: var(--spacing-xl);
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-md);
  }
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.section-item {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  
  .section-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    font-weight: 600;
    margin-right: var(--spacing-md);
  }
  
  .section-details {
    h4 {
      font-size: 1.1rem;
      margin-bottom: 4px;
    }
    
    p {
      color: var(--text-light);
      font-size: 0.9rem;
    }
  }
}

.start-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    margin-right: var(--spacing-sm);
    font-size: 1.3rem;
  }
}

.exam-active {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.exam-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
}

.exam-timer {
  display: flex;
  align-items: center;
  
  i {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-right: var(--spacing-xs);
  }
  
  span {
    font-size: 1.1rem;
    font-weight: 600;
    font-family: monospace;
    
    &.time-warning {
      color: var(--error-color);
      animation: pulse 1s infinite;
    }
  }
}

.exam-progress {
  flex: 1;
  max-width: 400px;
  margin: 0 var(--spacing-xl);
  
  .progress-text {
    font-size: 0.9rem;
    margin-bottom: 5px;
    text-align: center;
  }
  
  .progress-bar {
    height: 6px;
    background-color: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
}

.finish-btn {
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  i {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: var(--accent-dark);
  }
}

.question-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
}

.section-title {
  margin-bottom: var(--spacing-lg);
  
  h3 {
    font-size: 1.3rem;
    color: var(--primary-color);
  }
}

.question-content {
  flex: 1;
  margin-bottom: var(--spacing-xl);
}

.question-text {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  input {
    margin-top: 5px;
    margin-right: var(--spacing-md);
  }
  
  .option-text {
    flex: 1;
  }
  
  &:hover {
    background-color: rgba(74, 144, 226, 0.05);
    border-color: var(--primary-color);
  }
  
  &.selected {
    background-color: rgba(74, 144, 226, 0.1);
    border-color: var(--primary-color);
  }
}

.question-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.nav-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: none;
  background-color: #f8f9fa;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background-color: var(--border-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.prev i {
    margin-right: 5px;
  }
  
  &.next i {
    margin-left: 5px;
  }
}

.exam-results {
  padding: var(--spacing-xl);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.result-card {
  background-color: var(--background-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
  
  i {
    font-size: 1.5rem;
    color: white;
  }
  
  &.correct {
    background-color: var(--success-color);
  }
  
  &.incorrect {
    background-color: var(--error-color);
  }
  
  &.accuracy {
    background-color: var(--primary-color);
  }
  
  &.time {
    background-color: var(--accent-color);
  }
}

.result-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.result-label {
  color: var(--text-light);
  font-size: 0.9rem;
}

.answers-review {
  margin-bottom: var(--spacing-xl);
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-lg);
  }
}

.review-section {
  margin-bottom: var(--spacing-lg);
  
  h4 {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid var(--border-color);
  }
}

.review-questions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.review-question {
  position: relative;
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover .explanation {
    display: block;
  }
}

.question-number {
  font-weight: 500;
}

.answer-status {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    font-size: 0.9rem;
    color: white;
  }
  
  &.correct {
    background-color: var(--success-color);
  }
  
  &.incorrect {
    background-color: var(--error-color);
  }
}

.explanation {
  display: none;
  position: absolute;
  bottom: 110%;
  left: 0;
  width: 250px;
  background-color: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    border-width: 8px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
}

.explanation-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--primary-color);
}

.correct-answer {
  font-size: 0.9rem;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.explanation-text {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
}

.results-actions {
  text-align: center;
  
  button {
    padding: 12px 30px;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>