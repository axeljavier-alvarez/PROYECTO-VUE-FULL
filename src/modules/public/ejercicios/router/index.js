const routes = [
    
    {
        path: '/ejercicios',
        name: 'ejercicios',
        component: () =>
            import('../views/EjerciciosView.vue')
    }  
];
export default routes; 