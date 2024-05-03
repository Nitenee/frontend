import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDragAndDrop = defineStore('drag-and-drop', () => {
	let isDragging = false
	const draggingElement = ref<HTMLElement | null>(null)
	const draggingMeaning = ref<string | null>(null)

	function setDragging(inSet: { element: HTMLElement, meaning: string}) {
		isDragging = true
		draggingElement.value = inSet.element
		draggingMeaning.value = inSet.meaning
	}
	function clearDragging() {
		isDragging = false
		draggingElement.value = null
		draggingMeaning.value = null
	}

	return {
		isDragging, draggingElement, draggingMeaning,

		setDragging, clearDragging
	}
})
