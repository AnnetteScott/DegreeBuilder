import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/Pages/TEMPLATE.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/Pages/LoginPage.vue')
        }
    ]
})

export default router
