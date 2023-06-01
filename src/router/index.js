import { createRouter, createWebHistory } from 'vue-router'
import Weather from '../components/Weather.vue'

const routes = [
  {
    path: '/',
    name: 'weather',
    component: Weather
  },
 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
