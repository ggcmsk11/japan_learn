<template>
  <div class="vocabulary-detail">
    <div class="page-header">
      <div class="container">
        <h1>单词学习</h1>
        <p>基于艾宾浩斯记忆曲线的高效单词学习系统</p>
      </div>
    </div>

    <div class="container">
      <div class="content-grid">
        <div class="main-content">
          <div class="study-section">
            <h2>学习进度</h2>
            <div class="progress-stats">
              <div class="stat-card">
                <div class="stat-value">235</div>
                <div class="stat-label">已学单词</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">85%</div>
                <div class="stat-label">掌握率</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">15</div>
                <div class="stat-label">连续学习天数</div>
              </div>
            </div>
          </div>

          <div class="word-cards">
            <h2>今日单词</h2>
            <p class="section-desc">根据记忆曲线，为您安排了以下单词的学习和复习</p>

            <div class="cards-container">
              <WordCard 
                v-for="word in vocabulary.slice(0, 4)"
                :key="word.id"
                :word="word"
                @markKnown="handleMarkKnown"
                @markUnknown="handleMarkUnknown"
                @favorite="handleFavorite"
              />
            </div>
          </div>

          <div class="review-section">
            <h2>复习统计</h2>
            <div class="review-chart">
              <!-- 这里可以添加学习统计图表 -->
              <div class="chart-placeholder">
                学习数据统计图表
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="study-plan">
            <h3>学习计划</h3>
            <div class="plan-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 65%"></div>
              </div>
              <div class="progress-text">65% 完成</div>
            </div>
            <div class="plan-stats">
              <div class="plan-stat">
                <div class="stat-label">目标</div>
                <div class="stat-value">N3 级别</div>
              </div>
              <div class="plan-stat">
                <div class="stat-label">预计完成</div>
                <div class="stat-value">2024/06/30</div>
              </div>
            </div>
            <button class="btn-adjust-plan">
              调整学习计划
              <i class="ri-settings-3-line"></i>
            </button>
          </div>

          <div class="learning-tips">
            <h3>学习技巧</h3>
            <div class="tip-list">
              <div class="tip-item">
                <i class="ri-lightbulb-line"></i>
                <p>使用联想记忆法能够提高单词记忆效率</p>
              </div>
              <div class="tip-item">
                <i class="ri-time-line"></i>
                <p>建议每天固定时间学习，培养学习习惯</p>
              </div>
              <div class="tip-item">
                <i class="ri-book-read-line"></i>
                <p>多阅读例句，加深对单词用法的理解</p>
              </div>
            </div>
          </div>

          <div class="word-categories">
            <h3>词汇分类</h3>
            <div class="category-list">
              <button class="category-btn">
                <i class="ri-building-line"></i>
                建筑物
                <span class="word-count">45</span>
              </button>
              <button class="category-btn">
                <i class="ri-restaurant-line"></i>
                饮食
                <span class="word-count">68</span>
              </button>
              <button class="category-btn">
                <i class="ri-car-line"></i>
                交通
                <span class="word-count">32</span>
              </button>
              <button class="category-btn">
                <i class="ri-home-line"></i>
                家居
                <span class="word-count">54</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WordCard from '../components/vocabulary/WordCard.vue'

// 模拟数据
const vocabulary = ref([
  {
    id: "N2_001",
    kanji: "勉強",
    kana: "べんきょう",
    meaning: "学习，研究，学问",
    example: "毎日日本語を勉強しています",
    exampleMeaning: "我每天都在学习日语",
    level: "N5",
    tags: ["动词", "学习"]
  },
  {
    id: "N2_002",
    kanji: "事実",
    kana: "じじつ",
    meaning: "事实，实情",
    example: "それは事実です",
    exampleMeaning: "那是事实",
    level: "N3",
    tags: ["名词"]
  },
  {
    id: "N2_003",
    kanji: "積極的",
    kana: "せっきょくてき",
    meaning: "积极的，主动的",
    example: "彼は積極的に質問します",
    exampleMeaning: "他积极提问",
    level: "N2",
    tags: ["形容词", "态度"]
  },
  {
    id: "N2_004",
    kanji: "向上心",
    kana: "こうじょうしん",
    meaning: "上进心",
    example: "向上心を持つことが大切です",
    exampleMeaning: "拥有上进心很重要",
    level: "N1",
    tags: ["名词", "心理"]
  }
])

const handleMarkKnown = (wordId: string) => {
  console.log('Marked as known:', wordId)
}

const handleMarkUnknown = (wordId: string) => {
  console.log('Marked as unknown:', wordId)
}

const handleFavorite = (wordId: string, isFavorite: boolean) => {
  console.log('Favorite toggled:', wordId, isFavorite)
}
</script>

<style lang="scss" scoped>
.vocabulary-detail {
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-xl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.study-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  h2 {
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
  }
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  text-align: center;

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 5px;
  }

  .stat-label {
    color: var(--text-light);
    font-size: 0.9rem;
  }
}

.word-cards {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  h2 {
    margin-bottom: var(--spacing-sm);
    font-size: 1.5rem;
  }

  .section-desc {
    color: var(--text-light);
    margin-bottom: var(--spacing-lg);
  }
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.review-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  h2 {
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
  }
}

.chart-placeholder {
  background-color: var(--background-color);
  height: 300px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.study-plan {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  h3 {
    margin-bottom: var(--spacing-md);
    font-size: 1.2rem;
  }
}

.plan-progress {
  margin-bottom: var(--spacing-md);

  .progress-bar {
    height: 8px;
    background-color: var(--background-color);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 5px;

    .progress-fill {
      height: 100%;
      background-color: var(--primary-color);
    }
  }

  .progress-text {
    font-size: 0.9rem;
    color: var(--text-light);
    text-align: right;
  }
}

.plan-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.plan-stat {
  .stat-label {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 4px;
  }

  .stat-value {
    font-weight: 500;
  }
}

.btn-adjust-plan {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--background-color);
  border: none;
  padding: 10px;
  border-radius: 4px;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--border-color);
  }
}

.learning-tips {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  h3 {
    margin-bottom: var(--spacing-md);
    font-size: 1.2rem;
  }
}

.tip-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);

  i {
    color: var(--primary-color);
    font-size: 1.2rem;
    margin-top: 3px;
  }

  p {
    font-size: 0.95rem;
    color: var(--text-light);
    line-height: 1.5;
  }
}

.word-categories {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  h3 {
    margin-bottom: var(--spacing-md);
    font-size: 1.2rem;
  }
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.category-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: var(--background-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);

  i {
    margin-right: 8px;
    color: var(--primary-color);
  }

  .word-count {
    margin-left: auto;
    background-color: var(--primary-color);
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
  }

  &:hover {
    background-color: var(--border-color);
  }
}
</style>