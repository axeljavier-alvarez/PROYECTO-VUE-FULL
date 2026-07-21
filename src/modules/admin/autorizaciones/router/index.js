const routes = [
    {
        path: 'autorizaciones',
        name: 'admin.autorizaciones',
        component: () => import('@/modules/admin/autorizaciones/views/AutorizacionesView.vue')
    }

];

export default routes