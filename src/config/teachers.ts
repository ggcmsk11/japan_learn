export interface TeacherInfo {
  id: string
  name: string
  nameEn: string
  role: string
  image: string
  description: string
  expertise: string[]
  education: string[]
  experience: string[]
  languages: {
    language: string
    level: string
  }[]
}

export const teachers: TeacherInfo[] = [
  {
    id: 'wang',
    name: '王语桥',
    nameEn: 'Wang Yuqiao',
    role: '高级日语讲师',
    image: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: '拥有10年以上日语教学经验，专注JLPT考试辅导和发音指导。',
    expertise: ['JLPT考试辅导', '发音纠正', '商务日语'],
    education: [
      '北京外国语大学 日语系硕士',
      '日语教育能力检定合格'
    ],
    experience: [
      '日语讲师（2011年至今）',
      '日语教材编写（2015年至今）'
    ],
    languages: [
      { language: '中文', level: '母语' },
      { language: '日语', level: 'N1' },
      { language: '英语', level: '精通' }
    ]
  },
  {
    id: 'li',
    name: '李明哲',
    nameEn: 'Li Mingzhe',
    role: '语法专家',
    image: 'https://images.pexels.com/photos/5490265/pexels-photo-5490265.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: '擅长将复杂语法简单化，深受初学者欢迎。',
    expertise: ['日语语法', '初学者指导', '教材开发'],
    education: [
      '复旦大学 日语系本科',
      '日语教育能力检定合格'
    ],
    experience: [
      '日语学校讲师（2013年至今）',
      '教材编写（2016年至今）'
    ],
    languages: [
      { language: '中文', level: '母语' },
      { language: '日语', level: 'N1' },
      { language: '英语', level: '精通' }
    ]
  },
  {
    id: 'zhang',
    name: '张雨晴',
    nameEn: 'Zhang Yuqing',
    role: '会话训练师',
    image: 'https://images.pexels.com/photos/5793953/pexels-photo-5793953.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: '提供生动有趣的会话课程，帮助学员掌握自然的日常对话。',
    expertise: ['日常会话', '敬语训练', '发音指导'],
    education: [
      '上海外国语大学 日语系硕士',
      '日语教学资格证'
    ],
    experience: [
      '在线日语讲师（2015年至今）',
      '会话教材开发（2017年至今）'
    ],
    languages: [
      { language: '中文', level: '母语' },
      { language: '日语', level: 'N1' },
      { language: '英语', level: '精通' }
    ]
  },
  {
    id: 'chen',
    name: '陈思远',
    nameEn: 'Chen Siyuan',
    role: 'JLPT考试指导专家',
    image: 'https://images.pexels.com/photos/8617969/pexels-photo-8617969.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: '专注JLPT考试辅导，已帮助数百名学员成功通过N1、N2考试。',
    expertise: ['JLPT N1/N2辅导', '阅读理解', '词汇积累'],
    education: [
      '南京大学 日语系博士',
      'JLPT考官经验'
    ],
    experience: [
      '考试辅导讲师（2010年至今）',
      'JLPT备考书籍作者'
    ],
    languages: [
      { language: '中文', level: '母语' },
      { language: '日语', level: 'N1' },
      { language: '英语', level: '精通' }
    ]
  }
]