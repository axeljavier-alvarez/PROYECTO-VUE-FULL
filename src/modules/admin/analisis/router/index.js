const routes = [
    {
        path: 'analisis',
        name: 'admin.analisis',
        component: () => import('@/modules/admin/analisis/views/AnalisisView.vue')
    }

];

export default routes