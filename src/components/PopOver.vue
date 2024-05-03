<template>
	<div class="popover" ref="popover">
		<div>
			<div class="popover-text">{{ popoverText }}</div>
			<div class="popover-subtext">{{ popoverSubtext }}</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { ref } from 'vue'

	const popover = ref<HTMLElement | null>(null)

	defineProps<{
		popoverText: string;
		popoverSubtext: string;
	}>()
	defineExpose({ popover })
</script>

<style scoped>
	.popover {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #000e;
		color: #c6d0f5;
		font-weight: bold;
		display: grid;
		grid-template-rows: 1fr 1fr;
		place-items: center;
		opacity: 0;
		pointer-events: none;
		user-select: none;
		transition: opacity 0.25s;
		z-index: 50;
		text-align: center;
	}
	.popover-text {
		font-size: 80px;
	}
	.popover-subtext {
		font-size: 30px;
	}
</style>
