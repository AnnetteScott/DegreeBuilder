<script lang="ts">
import { defineComponent } from 'vue';
import Firebase from '@/firebase'
import { Course } from '@/types';

export default defineComponent({
	name: 'HomePage',
	data() {
		return {
			Firebase,
			form: '',
			code: '',
			sem: 'S1' as "S1" | "S2",
			year: 2023,
		};
	},
	mounted() {

	},
	methods: {
		addCourse(){
			this.form = '';
			const course = new Course();
			Firebase.dataBase.courses[this.code] = course;
			Firebase.updateDataBase();

			this.code = '';
		},
		addMultiCourse(){
			this.form = '';

			const codes = this.code.split(",");

			for(const code of codes){
				const course = new Course();
				Firebase.dataBase.courses[code.trim()] = course;
			}

			Firebase.updateDataBase();

			this.code = '';
		}
	},

})

</script>

<template>
	<main>
		<nav>
			<button @click="form = 'addCourse'">Add Course</button>
			<button @click="form = 'addMultiCourse'">Add Multi Course</button>
		</nav>
		<section>
			<div v-for="key of Object.keys(Firebase.dataBase.courses)" :key="key">
				<h1>{{ key }}</h1>
			</div>
		</section>
	</main>

	<form @submit.prevent="addCourse()" v-if="form === 'addCourse'">
		<fieldset>
			<h2>Add Course</h2>
			<label for="Course Code">
				Course Code
				<input type="text" v-model="code" required>
			</label>

			<button type="submit">Create</button>
			<button @click.prevent="form = ''">Cancel</button>
		</fieldset>
	</form>
	<form @submit.prevent="addMultiCourse()" v-if="form === 'addMultiCourse'">
		<fieldset>
			<h2>Add Course</h2>
			<label for="Course Code">
				Course Code (Seperate with ,)
				<input type="text" v-model="code" required>
			</label>

			<button type="submit">Create</button>
			<button @click.prevent="form = ''">Cancel</button>
		</fieldset>
	</form>
</template>

<style scoped>

</style>
