import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDragAndDrop = defineStore('drag-and-drop', () => {
	const isDragging = ref(false)
	const draggingElement = ref<HTMLElement | null>(null)
	const draggingMeaning = ref<string | null>(null)
	const draggingAttachedCharacter = ref<string | undefined>(undefined)

	function setDragging(inSet: { element: HTMLElement, meaning: string, draggingAttachedCharacter: string | undefined }) {
		isDragging.value = true
		draggingElement.value = inSet.element
		draggingMeaning.value = inSet.meaning
		draggingAttachedCharacter.value = inSet.draggingAttachedCharacter
	}
	function clearDragging() {
		isDragging.value = false
		draggingElement.value = null
		draggingMeaning.value = null
		draggingAttachedCharacter.value = undefined
	}

	return {
		isDragging, draggingElement, draggingMeaning, draggingAttachedCharacter,

		setDragging, clearDragging
	}
})
