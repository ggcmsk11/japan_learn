<template>
  <div class="practice-detail">
    <div v-if="!examStarted && !examCompleted" class="exam-intro">
      <div class="container">
        <div class="exam-header">
          <h1>{{ currentQuestion?.question }}</h1>
          <div class="exam-meta">
            <div class="meta-item">
              <i class="ri-time-line"></i>
              <span>{{ timeLimit }}分钟</span>
            </div>
            <div class="meta-item">
              <i class="ri-file-list-line"></i>
              <span>{{ currentQuestion?.tixing }}</span>
            </div>
            <div class="meta-item">
              <i class="ri-award-line"></i>
              <span>{{ currentQuestion?.jlptLevel }}</span>
            </div>
          </div>
        </div>

        <div class="exam-instructions">
          <h2>考试说明</h2>
          <ul>
            <li>考试时间为{{ timeLimit }}分钟，请合理分配时间</li>
            <li>考试过程中请勿刷新页面或离开当前页面</li>
            <li>所有题目答完后才能提交考试</li>
            <li>提交后将立即显示考试结果</li>
          </ul>
        </div>

        <button class="btn-start-exam" @click="startExam">
          开始考试
          <i class="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>

    <div v-else-if="examStarted && !examCompleted" class="exam-content">
      <div class="exam-header">
        <div class="container">
          <div class="header-content">
            <div class="exam-progress">
              <div class="progress-text">
                第 {{ currentQuestionIndex + 1 }}/{{ questions.length }} 题
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="exam-timer">
              <i class="ri-time-line"></i>
              <span :class="{ 'time-warning': remainingTime <= 300 }">
                {{ formatTime(remainingTime) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="question-container">
          <div class="question-content">
            <p class="question-text jp-text">{{ questions[currentQuestionIndex]?.text }}</p>
            
            <div class="answer-options">
              <label 
                v-for="(option, index) in questions[currentQuestionIndex]?.options" 
                :key="index"
                :class="['option-item', { selected: userAnswers[questions[currentQuestionIndex]?.id] === index }]"
              >
                <input 
                  type="radio" 
                  :name="questions[currentQuestionIndex]?.id"
                  :value="index"
                  v-model="userAnswers[questions[currentQuestionIndex]?.id]"
                >
                <span class="option-text jp-text">{{ option }}</span>
              </label>
            </div>
          </div>

          <div class="question-navigation">
            <button 
              class="nav-btn prev" 
              @click="prevQuestion"
              :disabled="currentQuestionIndex === 0"
            >
              <i class="ri-arrow-left-s-line"></i>
              上一题
            </button>
            <button 
              class="nav-btn next" 
              @click="nextQuestion"
              :disabled="currentQuestionIndex === questions.length - 1"
            >
              下一题
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>

        <div class="exam-actions">
          <button 
            class="btn-submit" 
            @click="submitExam"
            :disabled="!canSubmit"
          >
            提交答案
          </button>
        </div>
      </div>
    </div>

    <div v-else class="exam-results">
      <div class="container">
        <div class="results-header">
          <h1>考试结果</h1>
          <div class="score-overview">
            <div class="score-card">
              <div class="score-value">{{ examResults.score }}</div>
              <div class="score-label">总分</div>
            </div>
            <div class="score-card">
              <div class="score-value">{{ examResults.correctCount }}</div>
              <div class="score-label">正确题数</div>
            </div>
            <div class="score-card">
              <div class="score-value">{{ examResults.accuracy }}%</div>
              <div class="score-label">正确率</div>
            </div>
            <div class="score-card">
              <div class="score-value">{{ formatTime(examResults.timeSpent) }}</div>
              <div class="score-label">用时</div>
            </div>
          </div>
        </div>

        <div class="results-content">
          <div class="questions-review">
            <div 
              v-for="(question, index) in questions" 
              :key="question.id"
              class="question-review"
            >
              <div class="question-header">
                <div class="question-number">Q{{ index + 1 }}</div>
                <div 
                  :class="['answer-status', 
                    userAnswers[question.id] === question.correctAnswer ? 'correct' : 'incorrect'
                  ]"
                >
                  <i :class="userAnswers[question.id] === question.correctAnswer ? 
                    'ri-check-line' : 'ri-close-line'"></i>
                </div>
              </div>

              <div class="question-content">
                <p class="question-text jp-text">{{ question.text }}</p>
                <div class="options-review">
                  <div 
                    v-for="(option, optionIndex) in question.options" 
                    :key="optionIndex"
                    :class="['option-item',
                      {
                        'selected': userAnswers[question.id] === optionIndex,
                        'correct': question.correctAnswer === optionIndex,
                        'incorrect': userAnswers[question.id] === optionIndex && 
                          userAnswers[question.id] !== question.correctAnswer
                      }
                    ]"
                  >
                    {{ option }}
                  </div>
                </div>
                <div v-if="question.explanation" class="explanation">
                  <div class="explanation-title">解析</div>
                  <p>{{ question.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn-retry" @click="retryExam">
            <i class="ri-refresh-line"></i>
            重新考试
          </button>
          <button class="btn-back" @click="backToPractice">
            <i class="ri-arrow-left-line"></i>
            返回练习列表
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { QuestionBank } from '../config/questionBanks'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

const timeLimit = 30 // 默认30分钟
const examStarted = ref(false)
const examCompleted = ref(false)
const currentQuestionIndex = ref(0)
const remainingTime = ref(timeLimit * 60)
const userAnswers = ref<Record<string, number>>({})
const timer = ref<number | null>(null)
const questions = ref<Question[]>([])
const currentQuestion = ref<QuestionBank | null>(null)

const examResults = ref({
  score: 0,
  correctCount: 0,
  accuracy: 0,
  timeSpent: 0
})

const canSubmit = computed(() => {
  return questions.value.length === Object.keys(userAnswers.value).length
})

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startExam = async () => {
  if (!currentQuestion.value) return

  try {
    const response = await axios.post(currentQuestion.value.apiEndpoint, {
      userId: authStore.userInfo?.userId || '',
      token: authStore.token || '',
      user_phone: authStore.phoneNumber?.replace(/^\+/, '') || '',
      jpltLevel: currentQuestion.value.jlptLevel,
      isPaid: authStore.isPaid || 0,
      isReadAllQuestions: authStore.isReadAllQuestions || 1,
      usedGids: []
    })

    if (response.data.code === 200) {
      questions.value = response.data.data.map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
      examStarted.value = true
      startTimer()
    } else {
      throw new Error(response.data.msg || '获取题目失败')
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '获取题目失败，请稍后重试')
    router.push('/practice')
  }
}

const startTimer = () => {
  timer.value = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      submitExam()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

const calculateResults = () => {
  let correctCount = 0
  let totalQuestions = questions.value.length

  for (const question of questions.value) {
    if (userAnswers.value[question.id] === question.correctAnswer) {
      correctCount++
    }
  }

  const timeSpent = timeLimit * 60 - remainingTime.value
  const accuracy = Math.round((correctCount / totalQuestions) * 100)
  const score = Math.round((correctCount / totalQuestions) * 100)

  examResults.value = {
    score,
    correctCount,
    accuracy,
    timeSpent
  }
}

const submitExam = () => {
  stopTimer()
  calculateResults()
  examCompleted.value = true
}

const retryExam = () => {
  examStarted.value = false
  examCompleted.value = false
  currentQuestionIndex.value = 0
  remainingTime.value = timeLimit * 60
  userAnswers.value = {}
  questions.value = []
  examResults.value = {
    score: 0,
    correctCount: 0,
    accuracy: 0,
    timeSpent: 0
  }
}

const backToPractice = () => {
  router.push('/practice')
}

onMounted(() => {
  // Check authentication
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: route.fullPath }
    })
    return
  }

  // Get question data from sessionStorage
  const storedQuestion = sessionStorage.getItem('currentQuestion')
  if (storedQuestion) {
    currentQuestion.value = JSON.parse(storedQuestion)
  } else {
    router.push('/practice')
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style lang="scss" scoped>
.practice-detail {
  min-height: calc(100vh - 60px);
  background-color: var(--background-color);
}

.exam-intro {
  padding: var(--spacing-xl) 0;

  .exam-header {
    background-color: white;
    padding: var(--spacing-xl);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-sm);

    h1 {
      font-size: 2rem;
      margin-bottom: var(--spacing-md);
    }
  }

  .exam-meta {
    display: flex;
    gap: var(--spacing-lg);

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-light);

      i {
        font-size: 1.2rem;
        color: var(--primary-color);
      }
    }
  }
}

.exam-instructions {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);

  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-lg);
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      position: relative;
      padding-left: 20px;
      margin-bottom: var(--spacing-sm);
      color: var(--text-light);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--primary-color);
      }
    }
  }
}

.btn-start-exam {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 15px;
  border-radius: var(--border-radius);
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--primary-dark);

    i {
      transform: translateX(4px);
    }
  }

  i {
    transition: transform var(--transition-fast);
  }
}

.exam-content {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.exam-header {
  background-color: white;
  padding: var(--spacing-md) 0;
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.exam-progress {
  flex: 1;
  max-width: 400px;

  .progress-text {
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: var(--text-light);
  }

  .progress-bar {
    height: 6px;
    background-color: var(--background-color);
    border-radius: 3px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }
  }
}

.exam-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-family: monospace;

  i {
    color: var(--text-light);
  }

  .time-warning {
    color: var(--error-color);
    animation: pulse 1s infinite;
  }
}

.question-container {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
}

.question-content {
  margin-bottom: var(--spacing-xl);

  .question-text {
    font-size: 1.3rem;
    margin-bottom: var(--spacing-xl);
    line-height: 1.8;
  }
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
    font-size: 1.1rem;
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
  margin-top: var(--spacing-xl);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.exam-actions {
  text-align: center;
}

.btn-submit {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.exam-results {
  padding: var(--spacing-xl) 0;
}

.results-header {
  background-color: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  text-align: center;

  h1 {
    font-size: 2rem;
    margin-bottom: var(--spacing-xl);
  }
}

.score-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.score-card {
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius);

  .score-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 5px;
  }

  .score-label {
    color: var(--text-light);
    font-size: 0.9rem;
  }
}

.results-content {
  margin-bottom: var(--spacing-xl);
}

.questions-review {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.question-review {
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);

  .question-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-md);

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
      color: white;

      &.correct {
        background-color: var(--success-color);
      }

      &.incorrect {
        background-color: var(--error-color);
      }
    }
  }

  .options-review {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;

    .option-item {
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: 4px;
      font-size: 0.95rem;

      &.correct {
        background-color: rgba(46, 204, 113, 0.1);
        color: var(--success-color);
      }

      &.incorrect {
        background-color: rgba(231, 76, 60, 0.1);
        color: var(--error-color);
      }

      &.selected {
        font-weight: 500;
      }
    }
  }
}

.explanation {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);

  .explanation-title {
    font-weight: 500;
    margin-bottom: 5px;
    color: var(--primary-color);
  }

  p {
    color: var(--text-light);
    font-size: 0.95rem;
    line-height: 1.6;
  }
}

.results-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .btn-retry {
    background-color: var(--primary-color);
    color: white;
    border: none;

    &:hover {
      background-color: var(--primary-dark);
    }
  }

  .btn-back {
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-color);

    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
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