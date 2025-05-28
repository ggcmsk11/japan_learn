export interface Course {
  id: string
  title: string
  level: string
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
    id: 'n5-beginner',
    title: 'JLPT N5 初级课程',
    level: 'N5',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 20,
    duration: '10周',
    rating: 4.8,
    students: 1250,
    price: 9800,
    tag: 'popular',
    description: '从零开始学习日语，掌握基础词汇和语法。'
  },
  {
    id: 'n4-elementary',
    title: 'JLPT N4 基础课程',
    level: 'N4',
    image: 'https://images.pexels.com/photos/5428003/pexels-photo-5428003.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 25,
    duration: '12周',
    rating: 4.7,
    students: 980,
    price: 12800,
    description: '进一步提升日语水平，加强听说读写能力。'
  },
  {
    id: 'n3-intermediate',
    title: 'JLPT N3 中级课程',
    level: 'N3',
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=600',
    lessons: 30,
    duration: '15周',
    rating: 4.9,
    students: 760,
    price: 14800,
    tag: 'new',
    description: '掌握中级日语，提高实际应用能力。'
  }
]