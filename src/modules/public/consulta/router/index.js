const routes = [
    
    {
        path: '/consulta',
        name: 'consulta',
        component: () =>
            import('../views/ConsultaCreateView.vue')
    }  
];
export default routes; 