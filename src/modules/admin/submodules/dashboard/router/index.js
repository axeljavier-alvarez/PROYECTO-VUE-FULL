const routes = [
    {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/modules/admin/submodules/dashboard/views/Dashboard.vue')
    }

];

export default routes