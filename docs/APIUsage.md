# API 使用说明文档

## 1. 用户认证相关

### 1.1 登录接口
- **使用位置**: `src/views/auth/LoginPage.vue`
- **代码示例**:
```typescript
const handleLogin = async () => {
  try {
    isSubmitting.value = true
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password
      })
    })
    
    if (!response.ok) {
      throw new Error('登录失败')
    }
    
    const data = await response.json()
    // 存储token
    localStorage.setItem('token', data.token)
    // 更新用户信息和权限
    authStore.login()
    // 跳转到首页或之前的页面
    const redirect = route.query.redirect as string
    router.push(redirect || '/profile')
    
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error('登录失败，请检查账号密码')
  } finally {
    isSubmitting.value = false
  }
}
```

## 2. 单词学习相关

### 2.1 获取单词列表
- **使用位置**: `src/views/VocabularyPage.vue`
- **代码示例**:
```typescript
const fetchVocabulary = async () => {
  try {
    const response = await fetch(
      `/api/vocabulary/list?level=${currentLevel.value}&page=${currentPage.value}&pageSize=${itemsPerPage}`
    )
    
    if (!response.ok) {
      throw new Error('获取单词列表失败')
    }
    
    const data = await response.json()
    words.value = data.items
    totalPages.value = Math.ceil(data.total / itemsPerPage)
  } catch (error) {
    ElMessage.error('获取单词列表失败')
  }
}
```

### 2.2 标记单词状态
- **使用位置**: `src/components/vocabulary/WordCard.vue`
- **代码示例**:
```typescript
const handleMarkWord = async (status: 'review_later' | 'mastered') => {
  try {
    const response = await fetch('/api/vocabulary/mark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        wordId: props.word.id,
        status: status
      })
    })
    
    if (!response.ok) {
      throw new Error('标记单词状态失败')
    }
    
    ElMessage.success(status === 'review_later' ? '已加入复习列表' : '已标记为掌握')
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}
```

## 3. 练习相关

### 3.1 获取练习列表
- **使用位置**: `src/views/PracticePage.vue`
- **代码示例**:
```typescript
const fetchPracticeList = async () => {
  try {
    const response = await fetch(
      `/api/practice/list?level=${currentLevel.value}&type=${currentType.value}&page=${currentPage.value}&pageSize=${itemsPerPage}`
    )
    
    if (!response.ok) {
      throw new Error('获取练习列表失败')
    }
    
    const data = await response.json()
    practices.value = data.items
    totalPages.value = Math.ceil(data.total / itemsPerPage)
  } catch (error) {
    ElMessage.error('获取练习列表失败')
  }
}
```

### 3.2 获取练习详情
- **使用位置**: `src/views/PracticeDetailPage.vue`
- **代码示例**:
```typescript
const fetchPracticeDetail = async (id: string) => {
  try {
    const response = await fetch(`/api/practice/detail?id=${id}`)
    
    if (!response.ok) {
      throw new Error('获取练习详情失败')
    }
    
    const data = await response.json()
    exam.value = data
    remainingTime.value = data.timeLimit
    startTimer()
  } catch (error) {
    ElMessage.error('获取练习详情失败')
    router.push('/practice')
  }
}
```

### 3.3 提交练习答案
- **使用位置**: `src/views/PracticeDetailPage.vue`
- **代码示例**:
```typescript
const submitAnswers = async () => {
  try {
    const response = await fetch('/api/practice/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        practiceId: exam.value.id,
        answers: userAnswers.value,
        timeSpent: exam.value.timeLimit - remainingTime.value
      })
    })
    
    if (!response.ok) {
      throw new Error('提交答案失败')
    }
    
    const data = await response.json()
    // 显示结果
    examResults.value = data
    examCompleted.value = true
  } catch (error) {
    ElMessage.error('提交答案失败，请重试')
  }
}
```

## 4. 会员权限相关

### 4.1 检查权限
- **使用位置**: `src/views/PracticePage.vue`
- **代码示例**:
```typescript
const startPractice = (exam: any) => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: `/practice/${exam.id}` }
    })
    return
  }

  const level = exam.level as keyof typeof authStore.permissions
  if (!authStore.hasPermission(level)) {
    showPurchaseDialog.value = true
    return
  }

  router.push(`/practice/${exam.id}`)
}
```

### 4.2 更新用户资料
- **使用位置**: `src/views/ProfileEditPage.vue`
- **代码示例**:
```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        nickname: formData.value.nickname,
        email: formData.value.email,
        phone: formData.value.phone
      })
    })
    
    if (!response.ok) {
      throw new Error('更新资料失败')
    }
    
    ElMessage.success('个人资料更新成功')
    router.back()
  } catch (error) {
    ElMessage.error('更新失败，请重试')
  }
}
```

## 5. 用户反馈相关

### 5.1 提交反馈
- **使用位置**: `src/components/common/ServiceFAB.vue`
- **代码示例**:
```typescript
const handleSubmitFeedback = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error)
    }

    ElMessage.success(data.message)
    showContactForm.value = false
    formData.name = ''
    formData.email = ''
    formData.message = ''
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '提交反馈失败，请稍后重试')
  }
}
```