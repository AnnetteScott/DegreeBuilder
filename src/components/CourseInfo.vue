<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Course } from '@/classes';

export default defineComponent({
	name: 'CourseInfo',
    emits: ['click'],
	props: {
		completed: {
			type: Boolean,
			default: false
		},
		course: {
			type: Object as PropType<Course>,
			required: true
		},
		code: {
			type: String,
			required: true
		}
	},
})

</script>

<template>
	<div :class="{ completed, incomplete: !completed, course_item: true }" @click="$emit('click')">
		<h1> {{ code }}: {{ course.title }}</h1>
		<p>
			<span v-for="prereq in course.prerequisites">{{ prereq }}</span>
		</p>
    </div>
</template>

<style scoped>
h1 {
	font-size: 1.2rem;
}

.course_item {
	border-radius: 10px;
	padding: 5px 10px;
}

.course_item > p {
	display: flex;
	flex-direction: column;
}

.completed {
	border: 1px solid green;
}
</style>
@/classes