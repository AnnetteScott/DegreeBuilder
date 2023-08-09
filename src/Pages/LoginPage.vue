<script lang="ts">
import { defineComponent } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth"
import Firebase from '@/firebase'

export default defineComponent({
	name: 'LoginUser',
	data() {
		return {
			email: '',
			password: '',
			showPassword: false,
            authUnsubscribe: {} as Unsubscribe
		};
	},
    mounted(){
        this.authUnsubscribe = onAuthStateChanged(Firebase.auth, (user) => {
            if(user){
                if(this.$route.query.redirect){
                    this.$router.push(this.$route.query.redirect as string);
                }else{
                    this.$router.push({name: 'Home'});
                }
            }
		});
    },
	methods: {
		login() {
			signInWithEmailAndPassword(Firebase.auth, this.email, this.password)
			.then(() => {
			})
			.catch((error) => {
				const errorCode = error.code;
				console.warn(errorCode)
			});
		}
	}
})

</script>

<template>
	<main>
		<div class="inner">
			<form @submit.prevent="login()">
				<fieldset>
					<h2>Login</h2>
					<label for="email">
						Email
						<input id="email" type="email" v-model="email" required autocomplete="on">
					</label>
					<label for="password">
						Password
						<div>
							<input id="password" name="password" :type="showPassword ? 'text' : 'password'" v-model="password" required autocomplete="on">
							<button class="icon_button" @click.prevent="(showPassword = !showPassword)">
								<div class="material-symbols-rounded" :title="showPassword ? 'Hide password' : 'Show password'">
									{{ showPassword ? 'visibility_off' : 'visibility' }}
								</div>
							</button>
						</div>
					</label>
					<button type="submit">Login</button>
				</fieldset>
			</form>
		</div>
	</main>
</template>

<style scoped>

</style>
