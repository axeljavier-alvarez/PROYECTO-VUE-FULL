const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/modules/public/submodules/home/views/HomeView.vue')
    }
];

export default routes