<template>
	<div>
		<div class="character">
			<span>{{ character }}</span>
		</div>
		<div class="puzzle-hole-container">
			<div class="puzzle-hole-corner left-corner"></div>
			<div class="puzzle-hole"></div>
			<div class="puzzle-hole-corner right-corner"></div>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { defineProps } from 'vue'
	defineProps({
		character: String
	});	
</script>

<style scoped>
	.character {
		position: relative;
		display: flex;
		width: 100px;
		height: 100px;
		background-color: #a6d189;
		color: #232634;
		font-size: 70px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		user-select: none;
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
	}
</style>
