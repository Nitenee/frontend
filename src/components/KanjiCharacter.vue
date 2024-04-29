<template>
	<div>
		<div class="character" :class="incorrectStyle">
			<span>{{ character }}</span>
		</div>
		<div class="puzzle-hole-container">
			<div class="puzzle-hole-corner left-corner" :class="incorrectStyle"></div>
			<div class="puzzle-hole" :class="incorrectStyle"></div>
			<div class="puzzle-hole-corner right-corner" :class="incorrectStyle"></div>
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
		background-color: #a6d189;
		font-size: 70px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		user-select: none;
		transition: background-color 0.5s;
	}
	.character.incorrect {
		background-color: #e78284;
	}
	span {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.puzzle-hole-container {
		display: flex;
	}
	.puzzle-hole-corner {
		height: 30px;
		width: 30px;
		background-color: #a6d189;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		z-index: 1;
		transition: background-color 0.5s;
	}
	.puzzle-hole-corner.incorrect {
		background-color: #e78284;
	}
	.left-corner {
		border-bottom-left-radius: 0px;
	}
	.right-corner {
		border-bottom-right-radius: 0px;
	}
	.puzzle-hole {
		position: relative;
		height: 30px;
		width: 40px;
	}
	.puzzle-hole::after {
		position: absolute;
		content: "";
		height: 100%;
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		z-index: 2;
		box-shadow: 0px -10px 0px #a6d189;
		transition: box-shadow 0.5s;
	}
	.puzzle-hole.incorrect::after {
		box-shadow: 0px -10px 0px #e78284;
	}
</style>
