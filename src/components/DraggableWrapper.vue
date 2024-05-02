<template>
	<div ref="draggableContainer" @pointerdown="onPointerDown" @pointerup="onPointerUp">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue"	

	const draggableContainer = ref<HTMLElement | null>(null)
	const originalParent = ref<HTMLElement | null>(null)

	function onPointerDown(e: PointerEvent) {
		if(!draggableContainer.value) throw new Error("Pointer down on element but ref is null")

		draggableContainer.value.setPointerCapture(e.pointerId)

		draggableContainer.value.addEventListener("pointermove", onPointerMove)
	}

	function onPointerMove(e: PointerEvent) {
		if(!draggableContainer.value) throw new Error("Dragging element but ref is null")
	
		if(draggableContainer.value.style.position !== "fixed") {
			draggableContainer.value.style.position = "fixed"
			document.body.append(draggableContainer.value)
		}
		draggableContainer.value.style.left = e.x - 50 + "px"
		draggableContainer.value.style.top = e.y - 20 + "px"
	}

	function onPointerUp(e: PointerEvent) {
		if(!draggableContainer.value) throw new Error("Pointer up on element but ref is null")

		draggableContainer.value.releasePointerCapture(e.pointerId)
		draggableContainer.value.removeEventListener("pointermove", onPointerMove)
		draggableContainer.value.style.position = "initial"
		originalParent.value?.append(draggableContainer.value)
	}

	onMounted(() => {
		if(!draggableContainer.value) throw new Error("DraggableContainer mounted but ref is null")

		originalParent.value = draggableContainer.value.parentElement
	})

</script>

<style scoped>
</style>
