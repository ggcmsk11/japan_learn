export interface Course {
  id: string
  title: string
  level: string
  type: string
  image: string
  lessons: number
  duration: string
  rating: number
  students: number
  price: number
  tag?: 'popular' | 'new'
  description: string
}

export const courses: Course[] = [
  {
    id: 'n5-grammar',
    title: 'JLPT N5 语法精讲',
    level: 'N5',
    type: '语法',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 20,
    duration: '10周',
    rating: 4.8,
    students: 1250,
    price: 9800,
    tag: 'popular',
    description: '系统掌握N5级语法知识，打好基础'
  },
  {
    id: 'n4-listening',
    title: 'JLPT N4 听力强化',
    level: 'N4',
    type: '听力',
    image: 'https://images.pexels.com/photos/5428003/pexels-photo-5428003.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 15,
    duration: '8周',
    rating: 4.7,
    students: 980,
    price: 8800,
    description: '提高听力理解能力，备战N4考试'
  },
  {
    id: 'n3-reading',
    title: 'JLPT N3 阅读技巧',
    level: 'N3',
    type: '阅读',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 25,
    duration: '12周',
    rating: 4.9,
    students: 760,
    price: 12800,
    tag: 'new',
    description: '掌握文章要点，提高阅读速度'
  },
  {
    id: 'n3-reading',
    title: 'JLPT N3 阅读技巧',
    level: 'N3',
    type: '阅读',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 25,
    duration: '12周',
    rating: 4.9,
    students: 760,
    price: 12800,
    tag: 'new',
    description: '掌握文章要点，提高阅读速度'
  },
  {
    id: 'n3-reading',
    title: 'JLPT N3 阅读技巧',
    level: 'N3',
    type: '阅读',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 25,
    duration: '12周',
    rating: 4.9,
    students: 760,
    price: 12800,
    tag: 'new',
    description: '掌握文章要点，提高阅读速度'
  },
  {
    id: 'n3-reading',
    title: 'JLPT N3 阅读技巧',
    level: 'N3',
    type: '阅读',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 25,
    duration: '12周',
    rating: 4.9,
    students: 760,
    price: 12800,
    tag: 'new',
    description: '掌握文章要点，提高阅读速度'
  }
]