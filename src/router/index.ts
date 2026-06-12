import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '@/modules/public/router/index'
import authRoutes from '@/modules/auth/router/index'
import adminRoutes from '@/modules/admin/router/index'
import {authGuard} from './guards/authGuard'
import {useAuthStore} from '@/modules/auth/stores/authStore';
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
    },
    {
      path: '/solicitud',
      component: () => import('@/layouts/public/SolicitudLayout.vue'),
      children: [
        {
            path: '',
            name: 'solicitud-create',
            component: () =>
                import('@/modules/public/solicitud/views/SolicitudCreateView.vue')
        }
      ]
    },
    {
      path: '/inicio',
      component: () => import('@/layouts/public/SolicitudLayout.vue'),
      children: [
        {
          path: '',
          name: 'inicio',
          component: () =>
            import('@/modules/public/inicio/views/InicioView.vue')
        }
      ]
    }
    
  ],
})


router.beforeEach(authGuard);

export default router
