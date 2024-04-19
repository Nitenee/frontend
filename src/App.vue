<template>
	<main>
		<AppStage />
	</main>
</template>

<script setup lang="ts">
	import { provide } from 'vue'
	import AppStage from './components/AppStage.vue'
	import kanji from './assets/indexed_kanji.json'
	provide('kanji', kanji)
</script>

<style>
	html, body {
		margin: 0;
		background-color: #303446;
		color: #fff;
	}
</style>
