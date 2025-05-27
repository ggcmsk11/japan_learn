# API 文档

## 用户相关接口

### 1. 用户登录
- **接口**: `/api/auth/login`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "token": "string",
      "user": {
        "id": "string",
        "nickname": "string",
        "email": "string",
        "avatar": "string",
        "permissions": {
          "N5": true,
          "N4": true,
          "N3": false,
          "N2": false,
          "N1": false
        }
      }
    }
  }
  ```

### 2. 用户注册
- **接口**: `/api/auth/register`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "email": "string",
    "password": "string",
    "nickname": "string"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "token": "string",
      "user": {
        "id": "string",
        "nickname": "string",
        "email": "string",
        "permissions": {
          "N5": true,
          "N4": true,
          "N3": false,
          "N2": false,
          "N1": false
        }
      }
    }
  }
  ```

## 单词相关接口

### 1. 获取单词列表
- **接口**: `/api/vocabulary/list`
- **方法**: GET
- **请求参数**:
  ```
  level: string (N1-N5)
  page: number
  pageSize: number
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "total": 100,
      "items": [
        {
          "id": "string",
          "kanji": "string",
          "kana": "string",
          "meaning": "string",
          "level": "string",
          "example": "string",
          "exampleMeaning": "string"
        }
      ]
    }
  }
  ```

### 2. 标记单词状态
- **接口**: `/api/vocabulary/mark`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "wordId": "string",
    "status": "review_later | mastered"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "status": "success"
    }
  }
  ```

## 练习相关接口

### 1. 获取练习列表
- **接口**: `/api/practice/list`
- **方法**: GET
- **请求参数**:
  ```
  level: string (N1-N5)
  type: string (vocabulary | grammar | reading | listening)
  page: number
  pageSize: number
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "total": 100,
      "items": [
        {
          "id": "string",
          "title": "string",
          "type": "string",
          "level": "string",
          "timeLimit": 3600,
          "questionCount": 10,
          "averageAccuracy": 85,
          "completions": 1250
        }
      ]
    }
  }
  ```

### 2. 获取练习详情
- **接口**: `/api/practice/detail`
- **方法**: GET
- **请求参数**:
  ```
  id: string
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "id": "string",
      "title": "string",
      "timeLimit": 3600,
      "sections": [
        {
          "id": "string",
          "title": "string",
          "questions": [
            {
              "id": "string",
              "type": "string",
              "text": "string",
              "options": ["string"],
              "correctAnswer": 0,
              "explanation": "string"
            }
          ]
        }
      ]
    }
  }
  ```

### 3. 提交练习答案
- **接口**: `/api/practice/submit`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "practiceId": "string",
    "answers": {
      "questionId": "number"
    },
    "timeSpent": "number"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "score": 80,
      "correctCount": 8,
      "totalCount": 10,
      "timeSpent": 1800,
      "accuracy": 80
    }
  }
  ```

## 反馈相关接口

### 1. 提交反馈
- **接口**: `/api/feedback/submit`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "name": "string",
    "email": "string",
    "message": "string"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "感谢您的反馈！我们会尽快处理。"
  }
  ```