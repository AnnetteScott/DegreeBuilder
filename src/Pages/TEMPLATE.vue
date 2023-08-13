<script lang="ts">
import { defineComponent, watch } from 'vue';
import Firebase from '@/firebase'

export default defineComponent({
	name: 'DashBoard',
	data() {
		return {
			Firebase,
		};
	},
	mounted() {
		if(Object.keys(Firebase.dataBase).length > 0){
			// Code here
		}
		watch(Firebase.dataBase, async () => {

		})
	},
	methods: {

	},

})

</script>

<template>
	<main>

	</main>
</template>

<style scoped>

</style>
