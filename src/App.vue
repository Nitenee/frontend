<template>
	<main>
		<AppStage />
	</main>
</template>

<script setup lang="ts">
	import AppStage from './components/AppStage.vue'
</script>

<style>
	* {
		box-sizing: border-box;
	}
	html, body {
		margin: 0;
		background-color: #303446;
		color: #232634;
		overflow: hidden;
	}
	main {
		padding: 2px;
		background-color: #51576d;
		overflow: hidden;
	}
</style>
