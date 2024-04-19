<template>
	<div>
		{{ meaning }}
	</div>
</template>

<script setup lang='ts'>
	import { defineProps } from 'vue'
	defineProps({
		meaning: String
	});	
</script>

<style scoped>
	
</style>
