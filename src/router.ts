import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/Pages/HomePage.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/Pages/LoginPage.vue')
        }
    ]
})

export default router
