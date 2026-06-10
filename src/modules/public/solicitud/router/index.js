const routes = [
    
    {
        path: '/solicitud',
        name: 'solicitud-create',
        component: () =>
            import('../views/SolicitudCreateView.vue')
    }
    
];

export default routes; 