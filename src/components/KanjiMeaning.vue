<template>
		<div 
			class="container"
			:class="attached"
			ref="containerElement"
			@pointerdown.prevent.stop="onPointerDown"
		>
			<div>
				<div class="puzzle-hole-container">
					<div :class="puzzleHoleClasses">
						<div class="puzzle-hole-shadow-hider"></div>
					</div>
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
		transition: translate 0.3s;
		user-select: none;
	}
	.container:hover {
		cursor: grab;
		translate: -2px -2px;
	}
	.container.attached:hover {
		translate: 0px 10px;
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
	.puzzle-hole-container {
		display: flex;
		justify-content: center;
	}
	.puzzle-hole {
		position: relative;
		width: 40px;
		height: 30px;
		background-color:	#81c8be;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		transition: box-shadow 0.3s;
		z-index: 1;
	}
	.container:not(:hover) .no-shadow {
		box-shadow: initial;
	}
	.puzzle-hole::before {
		position: absolute;
		content: "";
		left: 0;
		transform: translateX(-100%);
		border-bottom-right-radius: 10px;
		width: 30px;
		height: 30px;
		box-shadow: 0px 10px 0px #81c8be;
	}
	.puzzle-hole::after {
		position: absolute;
		content: "";
		right: 0;
		transform: translateX(100%);
		border-bottom-left-radius: 10px;
		width: 30px;
		height: 30px;
		box-shadow: 0px 10px 0px #81c8be;
	}
	.puzzle-hole-shadow-hider {
		position: absolute;
		width: 100%;
		height: 10px;
		bottom: -5px;
		background-color: #81c8be;
}
</style>
