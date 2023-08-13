<script lang="ts">
import { defineComponent, watch } from 'vue';
import Firebase from '@/firebase'
import { Course, Stream, ClassItem } from '@/types';

type Sem = "S1" | "S2"

interface ClassType {
	[year: string]: {
		[sem in Sem]: {[key: string]: Course}
	}
}

export default defineComponent({
	name: 'HomePage',
	data() {
		return {
			Firebase,
			Stream,
			ClassItem,
			form: '',
			code: '',
			sem: 'S1' as "S1" | "S2",
			year: 2023,
			prereq: [],
			stream: -1,
			classes: {} as ClassType
		};
	},
	mounted() {
		if(Object.keys(Firebase.dataBase).length > 0){
			this.load()
		}
		watch(Firebase.dataBase, async () => {
			this.load()
		})
	},
	methods: {
		load(){
			this.classes = {};
			const startYear = Firebase.dataBase.startYear
			for(let i = startYear; i < startYear + Firebase.dataBase.degreeLength; i++){
				this.classes[i] = {'S1': {}, 'S2': {}};
			}

			for(const [code, course] of Object.entries(Firebase.dataBase.courses)){
				this.classes[course.year][course.sem][code] = course;
			}

			console.log(this.classes)
		},
		addCourse(){
			this.form = '';
			const course = new Course();
			if(this.prereq[0] !== 'None'){
				course.prerequisites = this.prereq;
			}
			course.sem = this.sem;
			course.year = this.year;
			Firebase.dataBase.courses[this.code] = course;
			Firebase.updateDataBase();

			this.code = '';
			this.prereq = []
		},
		addMultiCourse(){
			this.form = '';

			const codes = this.code.split(",");
			for(const code of codes){
				if(code.trim().length === 7){
					const course = new Course();
					course.year = this.year;
					course.sem = this.sem;
					Firebase.dataBase.courses[code.trim()] = course;
				}
			}
			Firebase.updateDataBase();
			this.code = '';
			this.prereq = []
		},
		editCourse(){
			this.form = '';
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
			<div v-for="[year, info] of Object.entries(classes)">
				<h1>{{ year }}</h1>
				<button>View TimeTables</button>
				<div v-for="[sem, courses] of Object.entries(info)">
					<h2>{{ sem }}</h2>
					<div v-for="[code, course] of Object.entries(courses)">
						<h3>{{ code }}</h3>
					</div>
				</div>
			</div>
		</section>
	</main>

	<div class="forms_container" v-if="form === 'addCourse'">
		<form @submit.prevent="addCourse()">
			<fieldset>
				<h2>Add Course</h2>
				<label for="Course Code">
					Course Code
					<input type="text" v-model="code" required>
				</label>
				<label for="Year">
					Year
					<input type="number" v-model="year" min="2000" max="2099" step="1" required>
				</label>
				<label for="Semester">
					Semester
					<select name="Semester" v-model="sem">
						<option value="S1">S1</option>
						<option value="S2">S2</option>
					</select>
				</label>
				<label for="Prerequisites">
					Prerequisites
					<select name="Prerequisites" multiple v-model="prereq" style="height: 200px;">
						<option value="None">None</option>
						<option v-for="key of Object.keys(Firebase.dataBase.courses).sort()"
						:key="key" :value="key">{{ key }}</option>
					</select>
				</label>
				<button type="submit">Create</button>
				<button @click.prevent="form = ''">Cancel</button>
			</fieldset>
		</form>
	</div>
	<div class="forms_container" v-if="form === 'addMultiCourse'">
		<form @submit.prevent="addMultiCourse()">
			<fieldset>
				<h2>Add Multi Course</h2>
				<label for="Course Code">
					Course Code (Seperate with ,)
					<input type="text" v-model="code" required>
				</label>
				<label for="Year">
					Year
					<input type="number" v-model="year" min="2000" max="2099" step="1" required>
				</label>
				<label for="Semester">
					Semester
					<select name="Semester" v-model="sem">
						<option value="S1">S1</option>
						<option value="S2">S2</option>
					</select>
				</label>
				<button type="submit">Create</button>
				<button @click.prevent="form = ''">Cancel</button>
			</fieldset>
		</form>
	</div>
	<div class="forms_container" v-if="form === 'editCourse' && code != ''">
		<form @submit.prevent="editCourse()">
			<fieldset>
				<h2>Edit Course</h2>
				<label for="Course Code">
					Course Code
					<input type="text" v-model="code" required>
				</label>
				<label for="Completed">
					Completed
					<input type="checkbox" v-model="Firebase.dataBase.courses[code].completed">
				</label>
				<label for="Year">
					Year
					<input type="number" v-model="Firebase.dataBase.courses[code].year" min="2000" max="2099" step="1" required>
				</label>
				<label for="Semester">
					Semester
					<select name="Semester" v-model="Firebase.dataBase.courses[code].sem">
						<option value="S1">S1</option>
						<option value="S2">S2</option>
					</select>
				</label>
				<label for="Prerequisites">
					Prerequisites
					<select name="Prerequisites" multiple v-model="Firebase.dataBase.courses[code].prerequisites" style="height: 200px;">
						<option value="None">None</option>
						<option v-for="key of Object.keys(Firebase.dataBase.courses).sort()"
						:key="key" :value="key">{{ key }}</option>
					</select>
				</label>
				<button @click.prevent="form = 'editStream'">Edit Streams</button>
				<button type="submit">Save</button>
				<button @click.prevent="form = ''">Cancel</button>
			</fieldset>
		</form>
	</div>
	<div class="forms_container" v-if="form === 'editStream' && code != ''">
		<form @submit.prevent="form = '', Firebase.updateDataBase()">
			<fieldset>
				<select name="Stream" v-model="stream">
					<option
					v-for="ind of Firebase.dataBase.courses[code].streams.length" :key="ind"
					:value="ind - 1">{{ind}}</option>
				</select>
			</fieldset>
			<fieldset v-if="stream != -1">
				<label for="streamNum">
					Stream Num
					<input type="text" v-model="Firebase.dataBase.courses[code].streams[stream].streamNum" required>
				</label>
				<div v-for="classes, index of Firebase.dataBase.courses[code].streams[stream].classes"
					:key="index"
					style="display: flex; gap: 8px;"
				>
					<label for="StartHour" style="max-width: 12ch;">
						Start Hour
						<input type="number" min="8" :max="classes.endHour" step="1" v-model="classes.startHour" required>
					</label>
					<label for="endHour" style="max-width: 12ch;">
						End Hour
						<input type="number" :min="classes.startHour" max="20" step="1" v-model="classes.endHour" required>
					</label>
					<label for="Day" style="max-width: 12ch;">
						Day
						<input type="number" min="0" max="6" step="1" v-model="classes.day" required>
					</label>
				</div>
				<button @click.prevent="Firebase.dataBase.courses[code].streams[stream].classes.push(new ClassItem())">Add Class</button>
			</fieldset>
			<button @click.prevent="Firebase.dataBase.courses[code].streams.push(new Stream()), stream = Firebase.dataBase.courses[code].streams.length - 1">Add Stream</button>
			<button type="submit">Save</button>
			<button @click.prevent="form = '', stream = -1">Cancel</button>
		</form>
	</div>

</template>

<style scoped>
input[type='checkbox']{
	all: revert;
}

section {
	display: flex;
	justify-content: space-around;
}
</style>
