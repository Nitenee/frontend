<template>
	<div class="kanji" @drop.prevent="onDrop" @dragover.prevent>
		<KanjiCharacter :character="kanji" />
		<div 
			class="meaning-drop-zone"
		>
			<KanjiMeaning 
				v-if="attachedMeaning != ''"
				:meaning="attachedMeaning" 
				:attachedCharacter="kanji"
			/>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { defineProps, defineEmits, ref } from 'vue'
	import KanjiCharacter from '@/components/KanjiCharacter.vue'
	import KanjiMeaning   from '@/components/KanjiMeaning.vue'
	import { Kanji } from '@/utils/utils'

	const props = defineProps({ kanji: Kanji, attachedMeaning: String })
	const emit  = defineEmits(['dropmeaning'])

	function onDrop(e) {
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
