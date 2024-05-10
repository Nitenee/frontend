<template>
	<div>
		<div class="character" :class="incorrectStyle">
			<span>{{ character }}</span>
		</div>
		<div class="puzzle-hole-container">
			<svg class="puzzle-hole" :class="incorrectStyle" height="32" width="100">
				<path d="m 20 32 C 25 32 30 27 30 22 V 14 C 30 7 35 4 40 4 H 60 C 65 4 70 9 70 14 V 22 C 70 27 75 32 80 32 L 100 32 L 100 0 L 0 0 L 0 32 z" />
			</svg>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { computed } from 'vue'
	const props = defineProps<{
		character: string,
		incorrect: boolean | null
	}>()	
	const incorrectStyle = computed(() => {
		return props.incorrect ? "incorrect" : ""
	})
</script>

<style scoped>
	.character {
		position: relative;
		display: flex;
		width: 100px;
		height: 100px;
		background-color: var(--color-green);
		font-size: 70px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		user-select: none;
		transition: background-color 0.5s;
	}
	.character.incorrect {
		background-color: var(--color-red);
	}
	span {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.puzzle-hole-container {
		height: 30px;
	}
	.puzzle-hole {
		translate: 0px -2px;
		fill: var(--color-green);
		transition: fill 0.5s;
	}
	.puzzle-hole.incorrect {
		fill: var(--color-red);
	}
</style>
