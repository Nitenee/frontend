<template>
	<div id="stage">
		<section class="kanji-meanings" @dragover.prevent @drop="meaningSectionDropHandler">
			<KanjiMeaning 
				v-for="meaning in modelData.meanings" 
				:key="meaning" 
				:meaning="meaning" 
				:attachedCharacter="''"
			/>
		</section>
		<section class="kanji-characters">
			<KanjiContainer 
				v-for="kanji in modelData.characters" 
				:key="kanji.kanji" 
				:kanji="kanji.kanji" 
				:attachedMeaning="kanji.attachedMeaning"
				@dropmeaning="processDrop"/>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, inject, computed, watch } from 'vue'
	import { buildLimitedKanjiSet, getRandomKanjiSet } from '@/utils/utils'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import KanjiContainer from '@/components/KanjiContainer.vue'

	const allKanji = inject('kanji')
	const levelLimit = 14
	const kanjiList = reactive(buildLimitedKanjiSet(allKanji, levelLimit))
	const selectedKanji = reactive(getRandomKanjiSet(kanjiList))
	const shuffledKanjiList = computed(() => {
		let list = []
		selectedKanji.similar_kanji.forEach(sk => list.push(sk))
		list.push(selectedKanji)
		shuffle(list)
		return list
	})
	const modelData = reactive({
		meanings: shuffledKanjiList.value.map(k => k.meaning),
		characters: shuffledKanjiList.value.map(k => {
			return {
				kanji: k.character,
				attachedMeaning: ""
			}
		})
	})

	watch(shuffledKanjiList, (newValue, oldValue) => {
		modelData.meanings = shuffledKanjiList.value.map(k => k.meaning);
		modelData.characters = newValue.map(k => {
			return {
				kanji: k.character,
				attachedMeaning: null
			}
		});
	})

	function meaningSectionDropHandler(e) {
		const { meaning, attachedCharacter} = JSON.parse(e.dataTransfer.getData("text"))
		processDrop({
			goingToCharacter: "MEANINGZONE",
			comingFromCharacter: attachedCharacter,
			oldMeaning: "MEANINGZONE",
			newMeaning: meaning
		})
	}

	function processDrop(e) {
		console.dir(e)
		const { goingToCharacter, comingFromCharacter, oldMeaning, newMeaning  } = e
		if(goingToCharacter === "MEANINGZONE") {
			//Ignore drop if picked up and dropped in meaning zone
			if(modelData.meanings.find(m => m == newMeaning)) return

			let char = modelData.characters.find(c => c.kanji == comingFromCharacter)
			if(!char) throw new Error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)

			char.attachedMeaning = ""
			modelData.meanings.push(newMeaning)
			return
		}

		if(comingFromCharacter && oldMeaning) {
			let char = modelData.characters.find(c => c.kanji == comingFromCharacter)
			if(!char) throw new Error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)

			char.attachedMeaning = oldMeaning
		} else if(!comingFromCharacter && oldMeaning) {
			modelData.meanings.push(oldMeaning)
		} else if(comingFromCharacter && !oldMeaning) {
			let char = modelData.characters.find(c => c.kanji == comingFromCharacter)
			if(!char) throw new Error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)

			char.attachedMeaning = ""
		}

		modelData.meanings = modelData.meanings.filter(m => m != newMeaning)

		let char = modelData.characters.find(c => c.kanji == goingToCharacter)
		char.attachedMeaning = newMeaning
	}
	function shuffle(array) {
		let currentIndex = array.length;

		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}
	}
	function resetKanjiList() {
		selectedKanji.value = buildLimitedKanjiSet(allKanji, levelLimit)
	}
	function getNextKanjiSet() {
		selectedKanji.value = getRandomKanjiSet(kanjiList)
	}
</script>

<style scoped>
	#stage {
		display: grid;
		grid-template-columns: 200px 1fr;
		height: 100dvh;
	}
	.kanji-characters {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		padding: 20px;
	}
	.kanji-meanings {
		padding-top: 20px;
		background-color: #51576d;
		box-shadow: 3px 0px 5px #0004;
	}
</style>
