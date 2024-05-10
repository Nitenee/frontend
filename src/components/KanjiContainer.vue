<template>
	<div 
		class="kanji"
		@pointerup.prevent.stop="onPointerUp"
		:class="attachedMeaning ? 'attached' : ''"
	>
		<div>
			<div class="shine"></div>
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
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: var(--color-surface0);
		padding: 5px;
		border-radius: 15px;
		border: 5px solid var(--color-overlay0);
		transition: all 0.15s ease;
		user-select: none;
		filter: drop-shadow(2px 2px 2px #0004);
		overflow: hidden;
	}
	.kanji.attached > div {
		padding: 0;
		margin: 5px;
		box-shadow: 0px 0px 10px var(--color-overlay0);
		border: 5px solid var(--color-crust);
		background-color: var(--color-crust);
	}
	.kanji:hover > div {
		scale: 1.2;
	}
	.kanji:not(.attached):hover > div {
		background-color: var(--color-surface2);
		border: 5px solid var(--color-overlay2);
		box-shadow: 0px 0px 2px 0px #000a;
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
	.kanji:hover .puzzle-knob-inner-connected {
		fill: red;
	}
	.shine {
		position: absolute;
		width: 200px;
		translate: 0 -110%;
		height: 200%;
		rotate: 45deg;
		background-image: linear-gradient(to right, transparent, #fff7, transparent);
		z-index: 10;
	}
</style>
