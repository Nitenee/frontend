<template>
		<div 
			class="container"
			:class="attached"
			ref="containerElement"
			@pointerdown.prevent.stop="onPointerDown"
		>
			<div>
				<div class="puzzle-knob-container">
					<svg class="puzzle-knob" height="32" width="100">
						<path d="m 18 30 C 24 30 29 25 29 20 V 12 C 29 7 34 2 39 2 H 61 C 66 2 71 7 71 12 V 20 C 71 25 76 30 81 30 L 100 30 L 100 32 L 0 32 L 0 30 z" />
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

	function onPointerDown(_: PointerEvent) {
		if(!containerElement.value) throw new Error("Clicked on meaning but ref is null")
		if(!props.meaning) throw new Error("Clicked on meaning but meaning prop is null")

		store.setDragging({
			element: containerElement.value,
			meaning: props.meaning,
			draggingAttachedCharacter: props.attachedCharacter
		})
	}
</script>

<style scoped>
	.container {
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
	.container.attached:hover > div{
		translate: 0px 0px;
	}
	.meaning {
		margin-bottom: 20px;
		position: relative;
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
		transition: box-shadow 0.3s;
		word-wrap: break-word;
	}
	.container:hover .meaning {
		box-shadow: 4px 4px 4px #0004;
	}
	.meaning span {
		width: 100%;
		user-select: none;
	}
	.puzzle-knob-container {
		height: 30px;
	}
	.puzzle-knob {
		fill: #81c8be;
	}
	.container.attached .meaning {
		box-shadow: inherit;
		margin-bottom: auto;
	}
	
</style>
