<template>
	<div id="stage" :class="toggleSettingsStyle">
		<div id="nice-job-popover" ref="popover">
			<div id="nice-job-text">
				<div>{{ popoverText }}</div>
				<div>{{ popoverSubtext }}</div>
			</div>
		</div>
		<nav>
			<div class="app-name">
				<div>似</div>
				<div>て</div>
				<div>ね</div>
				<div>ー</div>
				<div>！</div>
			</div>
			<div class="settings-button-container">
				<button class="settings-button" @click.prevent="toggleSettings">
					<svg height="35px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="35px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1  c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1  c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6  c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9  c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2  c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4  c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2  c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80  c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z"/>
					</svg>
				</button>
			</div>
		</nav>
		<section class="kanji-meanings" @dragover.prevent @drop="meaningSectionDropHandler">
			<div class="button-container">
				<div>
					<button class="submit-button" @click.prevent="checkAnswers">
						Check
					</button>
				</div>
			</div>
			<div class="kanji-meaning-items-container">
				<RoundedCorners hideBottomRight="true" hideTopRight="true" />
				<div v-if="modelData.meanings.length > 0">
					<KanjiMeaning 
						v-for="meaning in modelData.meanings" 
						:key="meaning" 
						:meaning="meaning" 
						:attachedCharacter="''"
					/>
				</div>
			</div>
		</section>
		<section class="kanji-characters-container" @dragover.prevent @drop="meaningSectionDropHandler">
			<RoundedCorners hideBottomLeft="true" />
			<div class="kanji-characters" v-if="modelData.characters.length > 0">
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
		<SettingsPanel @settingsUpdated="updateSettings"/>
	</div>
</template>

<script setup lang="ts">
	/*
		FIX:
		Meanings not breaking mid word correctly
		TODO:
		Connect to backend and use database instead of loading JSON in frontend
		TODO:
		Add option to input WaniKani API key to sync with WaniKani level 
		TODO:
		Add options to manually choose upper and lower level limits 
	*/
	import { ref, reactive, inject, computed, watch, onMounted } from 'vue'
	import { apiRequest, shuffleArray } from '@/utils/utils'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import KanjiContainer from '@/components/KanjiContainer.vue'
	import RoundedCorners from '@/components/RoundedCorners.vue'
	import SettingsPanel from '@/components/SettingsPanel.vue'

	let levelLimitUpper = ref(60)
	let levelLimitLower = ref(1)
	let batchSize = ref(3)
	let group = ref(true)
	let autoCheck = ref(true)
	const popover = ref(null)
	const popoverText = ref("")
	const popoverSubtext = ref("")
	const showSettings = ref(true)
	const toggleSettingsStyle = computed(() => {
		if(showSettings.value) {
			return "showSettings"
		} else {
			return ""
		}
	})
	const modelData = reactive({
		meanings: [],
		characters: []
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
			getNextKanjiBatch("ナイス！", "Retrieving next kanji set...")
		}
	}

	function popoverShow(popupText, popupSubtext) {
		popoverText.value = popupText
		popoverSubtext.value = popupSubtext
		popover.value.style.pointerEvents = 'initial'
		popover.value.style.opacity = 1
	}

	function popoverHide() {
		popover.value.style.pointerEvents = 'none'
		popover.value.style.opacity = 0
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

		if(modelData.meanings.length <= 0 && autoCheck.value) {
			checkAnswers()
		}
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

	function toggleSettings() {
		showSettings.value = !showSettings.value
	}

	function updateSettings(newSettings) {
		batchSize.value = newSettings.batchSize
		group.value = newSettings.groupKanji
		autoCheck.value = newSettings.autoCheck
		levelLimitUpper.value = newSettings.levelLimit.upper
		levelLimitLower.value = newSettings.levelLimit.lower
		toggleSettings()
		getNextKanjiBatch("設定を保存しました！", "Retrieving kanji list...")
	}

	function getNextKanjiBatch(popoverText, popoverSubtext) {
		popoverShow(popoverText, popoverSubtext)
		setTimeout(() => {
			let request = apiRequest({
				type: "KanjiBatchRequest",
				data: {
					user_id: "star",
					group_count: batchSize.value,
					max_level: levelLimitUpper.value,
					min_level: levelLimitLower.value,
					min_group_size: 2,
				}
			})
			request.then(newKanji => {
				updateKanji(newKanji)
				setTimeout(popoverHide, 500)
			})
		}, 500)
	}

	function updateKanji(newKanji) {
		let meanings = []
		let characters = []
		for(const kanji of Object.values(newKanji)) {
			meanings.push(kanji.meaning)
			characters.push({
				kanji: kanji.character,
				correctMeaning: kanji.meaning,
				attachedMeaning: "",
				incorrect: null
			})
		}
		modelData.meanings = shuffleArray(meanings)
		modelData.characters = shuffleArray(characters)
	}
</script>

<style scoped>
	#stage {
		display: grid;
		grid-template-rows: 60px 1fr;
		grid-template-columns: 200px 1fr 0;
		height: calc(100dvh - 4px);
		overflow: hidden;
		transition: grid-template-columns 1s cubic-bezier(.75,0,.25,1);
	}
	#stage.showSettings {
		grid-template-columns: 200px 1fr 300px;
	}
	nav {
		grid-column: span 3;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.app-name {
		margin-left: 10px;
		display: flex;
		user-select: none;
		font-family: 'MikanNoki';
		font-size: 50px;
		font-weight: bold;
		color: #c6d0f5;
		-webkit-text-stroke: 1.5pt #303446;
		text-shadow: 2px 2px 2px #0007;
		letter-spacing: -10px;
		transition: translate 0.3s, text-shadow 0.3s;
	}
	.app-name:hover {
		translate: -2px -2px;
		text-shadow: 4px 4px 8px #0007;
	}
	.app-name div:nth-child(odd) {
		translate: 0 -5px;
	}
	.app-name div:nth-child(even) {
		translate: 0 5px;
	}
	.app-name div:nth-child(7) {
		translate: 0 0px;
	}
	.settings-button-container {
		margin-right: 10px;
		display: flex;
		width: 80px;
		height: 50px;
		padding: 5px 10px;
		align-items: center;
		justify-content: center;
		background-color: #414559;
		border-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.settings-button-container:hover {
		translate: 1px 1px;
		box-shadow: 1px 1px 1px #0007;
	}
	.settings-button {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
		width: 150px;
		height: 35px;
		border-radius: 5px;
		font-size: 20px;
		background-color: #737994;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.settings-button:hover {
		translate: -2px -2px;
		box-shadow: 4px 4px 8px #0004;
		background-color: #838ba7;
		cursor: pointer;
	}
	.settings-button svg {
		fill: #c6d0f5;
		transition: rotate 0.3s, fill 0.3s;
		filter: drop-shadow(1px 1px #0007);
	}
	.settings-button:hover svg {
		rotate: 90deg;
	}
	.kanji-characters-container {
		position: relative;
		height: calc(100% - 64px);
		box-shadow: inset 0px 0px 2px 2px #0007;
		background-color: #303446;
	}
	.kanji-characters {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		justify-content: space-evenly;
		gap: 20px;
		padding: 20px;
		height: 100dvh;
		overflow-y: auto;
		scrollbar-gutter: stable both-edges;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
	}
	.kanji-meanings {
		height: calc(100dvh - 64px);
		background-color: #51576d;
	}
	.kanji-meaning-items-container {
		position: relative;
		height: calc(100% - 110px);
		background-color: #414559;
		box-shadow: inset 0px 0px 2px 2px #0007;
	}
	.kanji-meaning-items-container > div {
		height: 100%;
		padding-top: 20px;
		overflow-y: scroll;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
	}
	.button-container {
		position: relative;
		z-index: 10;
		padding-top: 10px;
		padding-bottom: 20px;
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
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.button-container div:has(> .submit-button:hover) {
		box-shadow: 1px 1px 1px #0007;
		translate: 1px 1px;
	}
	.submit-button {
		all: unset;
		display: block;
		margin: auto;
		width: 150px;
		height: 50px;
		text-align: center;
		border-radius: 5px;
		font-size: 20px;
		background-color: #babbf1;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.submit-button:hover {
		cursor: pointer;
		background-color: #cacbff;
		box-shadow: 4px 4px 8px #0004;
		translate: -2px -2px;
	}
	#nice-job-popover {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #000e;
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
		z-index: 50;
		text-align: center;
	}
	#nice-job-text div:last-child {
		font-size: 30px;
	}
</style>
