import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

interface PointerPosition {
	x: number;
	y: number;
}

export const useDragAndDrop = defineStore('drag-and-drop', () => {
	const isDragging = ref(false)
	const draggingElement = ref<HTMLElement | null>(null)
	const draggingMeaning = ref<string | null>(null)
	const draggingAttachedCharacter = ref<string | undefined>(undefined)
	const pointerPosition = reactive({ x: 0, y: 0 })

	function setDragging(inSet: { element: HTMLElement, meaning: string, draggingAttachedCharacter: string | undefined }) {
		inSet.element.style.opacity = '0.3'
		isDragging.value = true
		draggingElement.value = inSet.element
		draggingMeaning.value = inSet.meaning
		draggingAttachedCharacter.value = inSet.draggingAttachedCharacter

	}
	function clearDragging() {
		if(draggingElement.value)
			draggingElement.value.style.opacity = '1'

		isDragging.value = false
		draggingElement.value = null
		draggingMeaning.value = null
		draggingAttachedCharacter.value = undefined
	}
	function setPointerPosition(inPosition: PointerPosition) {
		pointerPosition.x = inPosition.x
		pointerPosition.y = inPosition.y
	}

	function checkCursor() {
		if(isDragging.value) {
			document.body.style.cursor = 'grabbing'
		} else {
			document.body.style.cursor = 'default'
		}
	}

	return {
		isDragging, draggingElement, draggingMeaning, draggingAttachedCharacter,
		setDragging, clearDragging,

		pointerPosition,
		setPointerPosition,

		checkCursor
	}
})
