<template>
		<div 
			class="container"
			:class="attached"
			ref="containerElement"
			@pointerdown.prevent.stop="onPointerDown"
		>
			<div>
				<div class="puzzle-knob-container">
					<svg class="puzzle-knob" height="35" width="100">
						<path class="puzzle-knob-stroker" d="m 16 29 C 24 29 27 29 27 19 V 16 C 27 5 32 2 43 2 H 57 C 68 2 73 5 73 16 V 19 C 73 29 76 29 84 29 L 100 29 L 100 34 L 0 34 L 0 29 z" />
						<path v-if="attachedCharacter" class="puzzle-knob-inner" d="m 19 31 C 24 31 32 27 32 19 V 10 C 32 7 35 3 38 3 H 62 C 65 3 68 7 68 10 V 19 C 68 27 76 31 81 31 L 100 31 L 100 32 L 0 32 L 0 31 z" />
						<path v-else class="puzzle-knob-inner" d="m 19 31 C 24 31 32 27 32 19 V 10 C 32 7 35 3 38 3 H 62 C 65 3 68 7 68 10 V 19 C 68 27 76 31 81 31 L 95 31 L 95 32 L 5 32 L 5 31 z" />
					</svg>
				</div>
				<div class="meaning" lang="en">
					<span>{{ meaning }}</span>
				</div>
			</div>
		</div>
</template>

<script setup lang='ts'>
	import { ref, computed } from 'vue'
	import { useDragAndDrop } from '@/stores/draganddrop'

	const containerElement = ref<HTMLElement | null>(null)
	const store = useDragAndDrop()
	const props = defineProps({
		meaning: String,
		attachedCharacter: String
	});	

	const puzzleHoleClasses = computed(() => {
		const classes = ['puzzle-hole']
		if(props.attachedCharacter) {
			classes.push('no-shadow')
		}
		return classes.join(' ')
	})
	const attached = computed(() => {
		if(props.attachedCharacter) {
			return "attached"
		} else {
			return ""
		}
	})

	function onPointerDown(e: PointerEvent) {
		if(!containerElement.value) throw new Error("Clicked on meaning but ref is null")
		if(!props.meaning) throw new Error("Clicked on meaning but meaning prop is null")
		//If mouse, only take left click
		if(e.pointerType === "mouse" && e.button !== 0) return

		store.setDragging({
			element: containerElement.value,
			meaning: props.meaning,
			draggingAttachedCharacter: props.attachedCharacter
		})
	}
</script>

<style scoped>
	.container {
		position: relative;
		margin: auto;
		width: 100px;
		user-select: none;
		transform-origin: 50% 50%;
	}
	.container > div {
		transition: translate 0.15s, filter 0.15s;
	}
	.container:hover > div {
		cursor: grab;
		translate: -2px -2px;
	}
	.container.attached:hover > div {
		translate: 0px 0px;
	}
	.meaning {
		margin-top: -3px;
		margin-bottom: 20px;
		padding: 10px;
		display: flex;
		justify-content: center;
		width: 100px;
		background-color: #81c8be;
		font-size: 15px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		text-align: center;
		box-shadow: 2px 2px 2px #0004;
		transition: all 0.3s ease;
		word-wrap: break-word;
		border: 5px solid #232634;
		border-top: none;
	}
	.container:hover .meaning {
		box-shadow: 4px 4px 4px #0004;
	}
	.container.attached .meaning {
		border: none;
	}
	.meaning span {
		width: 100%;
		user-select: none;
	}
	.puzzle-knob-container {
		position: relative;
		height: 37px;
		translate: 0px 2px;
	}
	.puzzle-knob {
		position: absolute;
		z-index: 2;
	}
	.puzzle-knob-stroker {
		fill: #232634;
		filter: drop-shadow(4px 4px 4px #0004);
	}
	.puzzle-knob-separator {
		fill: #232634;
		translate: 0px -7px;
	}
	.container.attached .puzzle-knob-stroker {
		display: none;
	}
	.puzzle-knob-inner {
		fill: #81c8be;
		translate: 0px 5px;
	}
	.container.attached .meaning {
		box-shadow: inherit;
		margin-bottom: auto;
	}
	.container.attached .puzzle-knob-inner {
		translate: 0px 1px;
	}
	
</style>
