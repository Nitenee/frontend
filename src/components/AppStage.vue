<template>
	<div id="stage">
		<div id="nice-job-popover" ref="popover">
			<div id="nice-job-text">
				ナイス！
			</div>
		</div>
		<section class="kanji-meanings" @dragover.prevent @drop="meaningSectionDropHandler">
			<div class="button-container">
				<div>
					<button class="submit-button" @click.prevent="checkAnswers">
						Check
					</button>
				</div>
			</div>
			<div class="kanji-meaning-items-container">
				<KanjiMeaning 
					v-for="meaning in modelData.meanings" 
					:key="meaning" 
					:meaning="meaning" 
					:attachedCharacter="''"
				/>
			</div>
		</section>
		<section class="kanji-characters-container" @dragover.prevent @drop="meaningSectionDropHandler">
			<div class="kanji-characters">
				<KanjiContainer 
					v-for="kanji in modelData.characters" 
					:key="kanji.kanji" 
					:kanji="kanji.kanji" 
					:attachedMeaning="kanji.attachedMeaning"
					:incorrect="kanji.incorrect"
					@dropmeaning="processDrop"
				/>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, inject, computed, watch, onMounted } from 'vue'
	import { buildLimitedKanjiSet, getRandomKanjiSet } from '@/utils/utils'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import KanjiContainer from '@/components/KanjiContainer.vue'

	const allKanji = inject('kanji')
	const levelLimit = 14
	const batchSize = 5
	const dragPreview = ref(null)
	const popover = ref(null)
	let kanjiList = reactive(buildLimitedKanjiSet(allKanji, levelLimit))
	let selectedKanji = reactive(getRandomKanjiSet(kanjiList, batchSize))
	const selectedKanjiList = computed(() => {
		let list = []
		selectedKanji.forEach(sk => {
			sk.forEach(sk2 => {
				sk2.similar_kanji.forEach(sk3 => list.push(sk3))
				list.push(sk2)
			})
		})
		return list
	})
	const modelData = reactive({
		meanings: shuffle(selectedKanjiList.value.map(k => k.meaning)),
		characters: shuffle(selectedKanjiList.value.map(k => {
			return {
				kanji: k.character,
				correctMeaning: k.meaning,
				attachedMeaning: "",
				incorrect: null
			}
		}))
	})

	watch(selectedKanjiList, (newValue, oldValue) => {
		modelData.meanings = shuffle(selectedKanjiList.value.map(k => k.meaning));
		modelData.characters = shuffle(newValue.map(k => {
			return {
				kanji: k.character,
				correctMeaning: k.meaning,
				attachedMeaning: null,
				incorrect: null
			}
		}))
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

	function checkAnswers() {
		let allAnswersCorrect = true
		modelData.characters.forEach(character => {
			let correct = character.correctMeaning == character.attachedMeaning
			if(!correct) {
				allAnswersCorrect = false
			}
			character.incorrect = !correct
		})

		if(allAnswersCorrect) {
			popover.value.style.pointerEvents = 'initial'
			popover.value.style.opacity = 1
			setTimeout(() => {
				getNextKanjiSet()
				setTimeout(() => {
					popover.value.style.pointerEvents = 'none'
					popover.value.style.opacity = 0
				}, 500)
			}, 250)
		}
	}

	function processDrop(e) {
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
		return array
	}
	function resetKanjiList() {
		Object.assign(kanjiList, buildLimitedKanjiSet(allKanji, levelLimit))
	}
	function getNextKanjiSet() {
		Object.assign(selectedKanji, getRandomKanjiSet(kanjiList, batchSize))
		console.log(`${kanjiList.length} kanji left`)
	}
</script>

<style scoped>
	#stage {
		display: grid;
		grid-template-columns: 200px 1fr;
		height: 100dvh;
		overflow: hidden;
	}
	.kanji-characters-container {
		height: 100%;
	}
	.kanji-characters {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 20px;
		padding: 20px;
		height: fit-content;
	}
	.kanji-meanings {
		height: 100dvh;
		background-color: #51576d;
		box-shadow: 3px 0px 5px #0004;
	}
	.kanji-meaning-items-container {
		position: relative;
		height: calc(100% - 110px);
		padding-top: 20px;
		overflow-y: auto;
		scrollbar-gutter: stable both-edges;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
		background-color: #414559;
	}
	.button-container {
		position: relative;
		z-index: 10;
		padding-top: 10px;
		padding-bottom: 20px;
		box-shadow: 0px 2px 4px #000a;
}
	.button-container div {
		margin: auto;
		display: flex;
		align-items: center;
		width: 90%;
		height: 80px;
		background-color: #414559;
		border-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
	}
	.submit-button {
		all: unset;
		display: block;
		margin: auto;
		width: 150px;
		height: 50px;
		text-align: center;
		border-radius: 10px;
		font-size: 20px;
		background-color: #babbf1;
		box-shadow: 2px 2px 2px #0004;
	}
	.submit-button:hover {
		cursor: pointer;
		background-color: #cacbff;
	}
	#nice-job-popover {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #000d;
		color: #c6d0f5;
		font-size: 80px;
		font-weight: bold;
		display: grid;
		grid-template-rows: 1fr 1fr;
		place-items: center;
		opacity: 0;
		pointer-events: none;
		user-select: none;
		transition: opacity 0.25s;
		z-index: 5;
	}
</style>
