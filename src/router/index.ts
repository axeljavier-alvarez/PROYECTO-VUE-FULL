import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '@/modules/public/router/index'
import authRoutes from '@/modules/auth/router/index'
import adminRoutes from '@/modules/admin/router/index'
import {authGuard} from './guards/authGuard'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/public/PublicLayout.vue'),
      children: publicRoutes
    },
    {
      path: '/auth',
      meta: {
        requiresGuest: true 
      },
      component: () => import('@/layouts/auth/AuthLayout.vue'),
      children: authRoutes
    },
    {
      path: '/admin',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/layouts/admin/AdminLayout.vue'),
      children: adminRoutes
    }
    
  ],
})


router.beforeEach(authGuard);

export default router
