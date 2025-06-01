export const API_BASE_URL = 'https://www.dlmy.tech/chunshua-api/chunshua_questions'

export const API_ENDPOINTS = {
  vocabulary: {
    wordCards: `${API_BASE_URL}/vocabulary/wordCards`
  },
  grammar: {
    grammarCards: `${API_BASE_URL}/grammar/grammerCards`
  },
  practice: {
    questions: {
      getDanCiIndTi: `${API_BASE_URL}/questions/getDanCiIndTi`,
      getYuFaIndTi: `${API_BASE_URL}/questions/getYuFaIndTi`,
      getYueDuComTi: `${API_BASE_URL}/questions/getYueDuComTi`,
      getTiLiIndTi: `${API_BASE_URL}/questions/getTiLiIndTi`,
      getTiLiComTi: `${API_BASE_URL}/questions/getTiLiComTi`
    }
  }
}