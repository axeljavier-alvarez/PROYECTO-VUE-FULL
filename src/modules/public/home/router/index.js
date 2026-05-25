const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/modules/public/home/views/HomeView.vue')
    }
];

export default routes