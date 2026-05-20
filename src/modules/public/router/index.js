const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/modules/public/views/HomeView.vue')
    }
];


export default routes; 