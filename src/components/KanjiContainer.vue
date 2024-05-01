<template>
	<div class="kanji" @drop.prevent.stop="onDrop" @dragover.prevent>
		<KanjiCharacter :character="kanji" :incorrect="incorrect" />
		<div 
			class="meaning-drop-zone"
		>
			<KanjiMeaning 
				v-if="attachedMeaning"
				:meaning="attachedMeaning" 
				:attachedCharacter="kanji"
			/>
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

	const props = defineProps<{
		kanji: string,
		attachedMeaning: string,
		incorrect: boolean | null
	}>()
	const emit  = defineEmits(['dropmeaning'])

	function onDrop(e: DragEvent) {
		if(!e.dataTransfer) throw new Error("Missing dataTransfer on drop event")
		const { meaning, attachedCharacter} = JSON.parse(e.dataTransfer.getData("text"))
		emit('dropmeaning', {
			goingToCharacter: props.kanji,
			comingFromCharacter: attachedCharacter,
			oldMeaning: props.attachedMeaning,
			newMeaning: meaning
		})
	}
</script>

<style scoped>
	.kanji {
		display: flex;
		flex-direction: column;
		background-color: #414559;
		padding: 5px;
		border-radius: 15px;
		border: 5px solid #51576d;
		transition: scale 0.3s, border 0.3s, background-color 0.3s, box-shadow 0.3s;
		box-shadow: 2px 2px 2px #0004;
	}
	.kanji:hover {
		scale: 1.1;
		border: 5px solid #ca9ee6;
		background-color: #626880;
		box-shadow: 4px 4px 8px #0003;
}
	.meaning-drop-zone {
		margin-top: -32px;
		height: 100px;
		width: 100px;
		z-index: 1;
	}
</style>
