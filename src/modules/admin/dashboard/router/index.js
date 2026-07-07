const routes = [
    {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/modules/admin/dashboard/views/DashboardView.vue')
    }

];

export default routes