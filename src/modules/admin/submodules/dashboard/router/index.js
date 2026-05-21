const routes = [
    {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/modules/admin/submodules/dashboard/views/Dashboard.vue')
    }

];

export default routes