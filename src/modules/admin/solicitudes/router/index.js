const routes = [
    {
        path: 'solicitudes',
        name: 'admin.solicitudes',
        component: () => import('@/modules/admin/solicitudes/views/SolicitudView.vue')
    }

];

export default routes