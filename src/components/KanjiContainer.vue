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
	}
	.meaning-drop-zone {
		margin-top: -32px;
		height: 100px;
		width: 100px;
		z-index: 1;
	}
</style>
