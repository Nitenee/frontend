<template>
	<div 
		ref="draggableContainer" 
		@mouseleave ="onMouseLeave" 
		@pointerdown="onPointerDown" 
		@pointerup="onPointerUp"
	>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue"	

	const draggableContainer = ref<HTMLElement | null>(null)
	let pointerId: number | null = null

	function onPointerDown(e: PointerEvent) {
		if(!draggableContainer.value) throw new Error("Pointer down on element but ref is null")

		pointerId = e.pointerId
		draggableContainer.value.setPointerCapture(e.pointerId)

		draggableContainer.value.addEventListener("pointermove", onPointerMove)
	}

	function onPointerMove(e: PointerEvent) {
		if(!draggableContainer.value) throw new Error("Dragging element but ref is null")
	
		if(draggableContainer.value.style.position !== "fixed") {
			draggableContainer.value.style.position = "fixed"
			draggableContainer.value.style.zIndex = "5000"
			document.body.style.cursor = "grabbing"
		}
		draggableContainer.value.style.left = e.x - 50 + "px"
		draggableContainer.value.style.top = e.y - 20 + "px"
	}

	function onPointerUp(e: PointerEvent) {
		if(!draggableContainer.value) throw new Error("Pointer up on element but ref is null")

		draggableContainer.value.releasePointerCapture(e.pointerId)
		draggableContainer.value.removeEventListener("pointermove", onPointerMove)
		draggableContainer.value.style.position = "initial"
		document.body.style.cursor = "inherit"
	}

	function onMouseLeave(e: MouseEvent) {
		if(pointerId) {
			if(!draggableContainer.value) throw new Error("Blur on element but ref is null")
			draggableContainer.value.releasePointerCapture(pointerId)
			draggableContainer.value.removeEventListener("pointermove", onPointerMove)
			draggableContainer.value.style.position = "initial"
			document.body.style.cursor = "inherit"
		}
	}
</script>
