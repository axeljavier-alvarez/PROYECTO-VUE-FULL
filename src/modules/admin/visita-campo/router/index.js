const routes = [
    {
        path: 'visita-campo',
        name: 'admin.visita-campo',
        component: () => import('@/modules/admin/visita-campo/views/VisitaCampoView.vue')
    }

];

export default routes