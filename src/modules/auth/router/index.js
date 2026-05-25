const routes = [
    {
        path: '',
        redirect: {
            name: 'login'
        }
    },
    {
        path: 'login',
        name: 'login',
        component: () => import('@/modules/auth/views/LoginView.vue')
    },
    {
        path: 'register',
        name: 'register',
        component: () => import('@/modules/auth/views/RegisterView.vue')

    }
];


export default routes; 