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
		isolation: isolate;
		width: 100%;
		height: 100%;
		color: #c6d0f5;
		font-weight: bold;
		display: grid;
		grid-template-areas: 
			"top"
			"text"
			"bottom";
		place-items: center;
		opacity: 0;
		pointer-events: none;
		user-select: none;
		transition: opacity 0.25s, backdrop-filter 0.25s;
		z-index: 10;
		text-align: center;
	}
	.popover.show {
		opacity: 1;
	}
	.popover::after {
		position: absolute;
		top: 0;
		left: 0;
		content: "";
		width: 100%;
		height: 100%;
		backdrop-filter: blur(0px);
		transition: backdrop-filter 0.25s;
	}
	.popover.show::after {
		backdrop-filter: blur(2.5px);
	}
	.popover > div {
		position: relative;
		grid-area: text;
		background-color: #0004;
		width: 100%;
		padding: 50px 0px;
		z-index: 1;
		box-shadow: 0px 0px 10px 5px #0005;
		transition: backdrop-filter 0.25s;
		backdrop-filter: blur(0px);
	}
	.popover.show > div {
		backdrop-filter: blur(10px);
	}
	.popover-text {
		visibility: hidden;
		font-size: 80px;
		filter: drop-shadow(3px 3px 0px black);
	}
	.popover.show .popover-text,
	.popover.show .popover-subtext {
		visibility: inherit;
	}
	.popover.show.animate .popover-text {
		animation: popovertext 2s linear forwards;
	}
	.popover-subtext {
		visibility: hidden;
		font-size: 30px;
		filter: drop-shadow(1px 1px 0px black);
	}
	.popover.show.animate .popover-subtext {
		animation: popovertext 2s linear forwards reverse;
		animation-name: popovertext;
		animation-duration: 2s;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	@keyframes popovertext {
		0% { translate: -3000px 0px }
		15% { translate: -25px 0px }
		85% { translate: 25px 0px }
		100% { translate: 3000px 0px }
	}
</style>
