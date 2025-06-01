import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/jlpt-structure',
      name: 'jlpt-structure',
      component: () => import('../views/JLPTStructurePage.vue')
    },
    // ... other existing routes
  ]
})

export default router