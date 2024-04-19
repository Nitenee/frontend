<template>
	<div class="kanji">
		<KanjiCharacter :character="kanji.character" />
		<div 
			ref="dropzone"
			class="meaning-drop-zone"
			@drop="drop"
			@dragover="allowDrop"
		></div>
	</div>
</template>

<script setup lang='ts'>
	import { defineProps, ref } from 'vue'
	import KanjiCharacter from '@/components/KanjiCharacter.vue'
	import { Kanji } from '@/utils/utils'

	let dropzone = ref(null)
	let attachedMeaning = ref("")

	defineProps({
		kanji: Kanji
	})

	function allowDrop(e) {
		e.preventDefault()
	}

	function drop(e) {
		e.preventDefault()
		let oldData = attachedMeaning.value
		let data = e.dataTransfer.getData("text")
		let inElement = document.getElementById(`meaning-node-${data}`)
		attachedMeaning.value = data
		dropzone.value.appendChild(inElement)
		if(oldData) {
			console.log(oldData, attachedMeaning.value)
			let oldElement = document.getElementById(`meaning-node-${oldData}`)
			document.getElementsByClassName('kanji-meanings')[0].appendChild(oldElement)
		}
	}
</script>

<style scoped>
	.kanji {
		display: flex;
		flex-direction: column;
	}
	.meaning-drop-zone {
		height: 100px;
		width: 100px;
		transform: translateY(-32px);
		z-index: 1;
	}
</style>
