<template>
	<svg v-if="!hideTopLeft" class="top-left" height="20" width="20">
		<path d="m20,0 h-20 v20 a20,20 0 0 1 20,-20 z" />
	</svg>
	<svg v-if="!hideTopRight" class="top-right" height="20" width="20">
		<path d="m20,20 v-20 h-20 a20,20 0 0 1 20,20 z" />
	</svg>
	<svg v-if="!hideBottomRight" class="bottom-right" height="20" width="20">
		<path d="m0,20 h20 v-20 a20,20 0 0 1 -20,20 z" />
	</svg>
	<svg v-if="!hideBottomLeft" class="bottom-left" height="20" width="20">
		<path d="m0,0 v20 h20 a20,20 0 0 1 -20,-20z" />
	</svg>
</template>

<script setup lang="ts">
	defineProps({
		hideTopLeft: 		 { type: Boolean, default: false },
		hideTopRight: 	 { type: Boolean, default: false },
		hideBottomRight: { type: Boolean, default: false },
		hideBottomLeft:  { type: Boolean, default: false }
	});
</script>

<style scoped>
	svg {
		position: absolute;
		fill: var(--color-surface1);
	}
	.top-left,    .top-right 	 { top: 0; }
	.bottom-left, .bottom-right { bottom: 0; }
	.top-left, 	  .bottom-left  { left: 0; }
	.top-right,   .bottom-right { right: 0; }
	
	.top-left 		{ filter: drop-shadow(2px 2px 1px #000a); }
	.top-right 		{ filter: drop-shadow(-2px 2px 1px #000a); }
	.bottom-right { filter: drop-shadow(-2px -2px 1px #000a); }
	.bottom-left 	{ filter: drop-shadow(2px -2px 1px #000a); }
</style>
