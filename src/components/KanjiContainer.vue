<template>
	<div 
		class="kanji"
		@pointerup.prevent.stop="onPointerUp"
		:class="attachedMeaning ? 'attached' : ''"
	>
		<div>
			<KanjiCharacter :character="kanji" :incorrect="incorrect" />
			<div 
				class="meaning-drop-zone"
				:class="attachedMeaning ? 'attached' : ''"
			>
				<KanjiMeaning 
					v-if="attachedMeaning"
					:meaning="attachedMeaning" 
					:attachedCharacter="kanji"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
	/*
		TODO:
		Make puzzle piece sections of KanjiCharacter and KanjiMeaning SVG so the elements don't get cracks in them when scale is being animated
	*/
	import KanjiCharacter from '@/components/KanjiCharacter.vue'
	import KanjiMeaning   from '@/components/KanjiMeaning.vue'
	import { useDragAndDrop } from '@/stores/draganddrop'
	import { useKanjiState } from '@/stores/kanjistate'

	const props = defineProps<{
		kanji: string,
		attachedMeaning: string,
		incorrect: boolean | null
	}>()
	const emit  = defineEmits(['dropmeaning'])
	const dragAndDrop = useDragAndDrop()
	const state = useKanjiState()

	function onPointerUp(_: PointerEvent) {
		if(dragAndDrop.isDragging) {
			if(dragAndDrop.draggingAttachedCharacter == undefined || dragAndDrop.draggingMeaning == null) throw new Error("Trying to drop an undefined or null")
			state.processDrop({
				goingToCharacter: props.kanji,
				comingFromCharacter: dragAndDrop.draggingAttachedCharacter,
				oldMeaning: props.attachedMeaning,
				newMeaning: dragAndDrop.draggingMeaning
			})
			dragAndDrop.clearDragging()
		}
	}
</script>

<style scoped>
	.kanji > div {
		display: flex;
		flex-direction: column;
		background-color: #414559;
		padding: 5px;
		border-radius: 15px;
		border: 5px solid #737994;
		transition: all 0.15s ease;
		user-select: none;
		filter: drop-shadow(2px 2px 2px #0004);
	}
	.kanji:hover > div {
		scale: 1.2;
		border: 5px solid #ca9ee6;
		background-color: #626880;
		box-shadow: 0px 0px 2px 0px #000a;
	}
	.kanji.attached > div {
		padding: 0;
		margin: 5px;
	}
	.meaning-drop-zone {
		margin-top: -32px;
		height: 100px;
		width: 100px;
		z-index: 1;
	}
	.meaning-drop-zone.attached {
		height: fit-content;
	}
</style>
