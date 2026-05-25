const routes = [
    {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/modules/admin/dashboard/views/Dashboard.vue')
    }

];

export default routes