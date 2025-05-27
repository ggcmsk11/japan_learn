# 数据库设计

## 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
```

## 会员权限表 (user_permissions)
```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  level VARCHAR(10) NOT NULL, -- N1, N2, N3, N4, N5
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, level)
);

-- 索引
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_expires_at ON user_permissions(expires_at);
```

## 单词表 (vocabulary)
```sql
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kanji VARCHAR(50) NOT NULL,
  kana VARCHAR(50) NOT NULL,
  meaning TEXT NOT NULL,
  level VARCHAR(10) NOT NULL, -- N1, N2, N3, N4, N5
  example TEXT,
  example_meaning TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_vocabulary_level ON vocabulary(level);
```

## 用户单词学习记录表 (user_vocabulary)
```sql
CREATE TABLE user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  vocabulary_id UUID NOT NULL REFERENCES vocabulary(id),
  status VARCHAR(20) NOT NULL, -- new, review_later, mastered
  next_review_at TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, vocabulary_id)
);

-- 索引
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_next_review ON user_vocabulary(next_review_at);
CREATE INDEX idx_user_vocabulary_status ON user_vocabulary(status);
```

## 练习题表 (practice)
```sql
CREATE TABLE practice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- vocabulary, grammar, reading, listening
  level VARCHAR(10) NOT NULL, -- N1, N2, N3, N4, N5
  time_limit INTEGER NOT NULL, -- 秒
  average_accuracy NUMERIC(5,2) DEFAULT 0,
  completions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_practice_type_level ON practice(type, level);
```

## 练习题目表 (practice_questions)
```sql
CREATE TABLE practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practice(id),
  section_id UUID NOT NULL,
  section_title VARCHAR(255) NOT NULL,
  question_type VARCHAR(20) NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  audio_url VARCHAR(255), -- 听力题音频
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_practice_questions_practice_id ON practice_questions(practice_id);
CREATE INDEX idx_practice_questions_section ON practice_questions(section_id);
```

## 用户练习记录表 (user_practice)
```sql
CREATE TABLE user_practice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  practice_id UUID NOT NULL REFERENCES practice(id),
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  time_spent INTEGER NOT NULL, -- 秒
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_user_practice_user_id ON user_practice(user_id);
CREATE INDEX idx_user_practice_created_at ON user_practice(created_at);
```

## 反馈表 (feedback)
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_feedback_email ON feedback(email);
CREATE INDEX idx_feedback_status ON feedback(status);
```