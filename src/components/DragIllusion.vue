<template>
	<div :style="computedStyle">
		<KanjiMeaning :meaning="draggingMeaning" attached-character=""/>
	</div>
</template>

<script setup lang='ts'>
	import { computed } from 'vue'
	import { storeToRefs } from 'pinia'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import { useDragAndDrop } from '@/stores/draganddrop'
	
	const { isDragging, draggingMeaning, pointerPosition } = storeToRefs(useDragAndDrop())

	const computedStyle = computed(() => {
		if(!isDragging.value) {
			return 'display: none;'
		}
		const { x, y } = pointerPosition.value
		return `left: ${x - 50}px; top: ${y - 15}px;`
	})
</script>

<style scoped>
	div {
		position: fixed;
		z-index: 10000;
		pointer-events: none;
		user-select: none;
	}
</style>
