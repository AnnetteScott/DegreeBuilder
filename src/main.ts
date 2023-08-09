import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import Firebase from '@/firebase'

import './assets/main.css'

const app = createApp(App)

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        if (!Firebase.user) {
            return {
                path: '/login'
            }
        }
    }
})


app.use(router)

app.mount('#app')
