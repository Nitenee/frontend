<template>
	<div id="stage" :class="toggleSettingsStyle">
		<PopOver 
			:popoverText="popoverText"
			:popoverSubtext="popoverSubtext"
			ref="popover" 
		/>
		<NavBar @togglesettings="toggleSettings" />
		<div ref="puzzleStage" id="puzzle-stage">
			<KanjiMeaningSection
				:meanings="modelData.meanings"
				:ready-to-go-to-next-kanji-batch="readyToGoToNextKanjiBatch"
				@on-submit="onSubmit"
			/>
			<KanjiCharacterSection
				:characters="modelData.characters"
			/>
			<SettingsPanel @settingsUpdated="updateSettings"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	/*
		FIX:
		Meanings not breaking mid word correctly
	*/
	import { ref, reactive, computed } from 'vue'
	import { useKanjiSettings } from '@/stores/kanjisettings'
	import { shuffleArray, apiRequest, wanikaniRequest } from '@/utils/utils'
	import { ServerKanji, KanjiBatchRequest, NDropEvent } from '@/utils/types'

	import NavBar from '@/components/NavBar.vue'
	import PopOver from '@/components/PopOver.vue'
	import KanjiMeaningSection from '@/components/KanjiMeaningsSection.vue'
	import KanjiCharacterSection from '@/components/KanjiCharacterSection.vue'
	import SettingsPanel from '@/components/SettingsPanel.vue'

	const store = useKanjiSettings()
	const puzzleStage = ref<HTMLElement | null>(null)

	let wanikaniLevel = ref<number | null>(null)
	let wanikaniUsername = ref("")
	let readyToGoToNextKanjiBatch = ref(false)
	const popover = ref<HTMLElement | null>(null)
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
		meanings: [] as string[],
		characters: [] as {kanji: string; correctMeaning: string; attachedMeaning: string; incorrect: boolean | null;}[]
	})

	function meaningSectionDropHandler(e: DragEvent) {
		if(!e.dataTransfer) throw new Error("Trying to drop but no dataTransfer object exists on event")
		const { meaning, attachedCharacter} = JSON.parse(e.dataTransfer.getData("text"))
		processDrop({
			goingToCharacter: "MEANINGZONE",
			comingFromCharacter: attachedCharacter,
			oldMeaning: "MEANINGZONE",
			newMeaning: meaning
		})
	}

	function onSubmit() {
		if (readyToGoToNextKanjiBatch.value) {
			getNextKanjiBatch("ナイス！", "Retrieving next kanji set...")
		} else {
			checkAnswers()
		}
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

		if(allAnswersCorrect && store.autoContinue) {
			getNextKanjiBatch("ナイス！", "Retrieving next kanji set...")
		} else if(allAnswersCorrect) {
			popoverShow("グッドジョブ！", "Looking good!")
			setTimeout(() => {
				readyToGoToNextKanjiBatch.value = true
				setTimeout(() => {
					popoverHide()
				}, 500)
			}, 500)
		}
	}

	function popoverShow(popupText: string, popupSubtext: string) {
		if(!popupText || !popupSubtext) throw new Error("You must enter popup text")
		if(!popover.value) throw new Error ("popover ref is null")
		popoverText.value = popupText
		popoverSubtext.value = popupSubtext
		popover.value.popover.style.pointerEvents = 'initial'
		popover.value.popover.style.opacity = '1'
	}

	function popoverHide() {
		if(!popover.value) throw new Error ("popover ref is null")
		popover.value.popover.style.pointerEvents = 'none'
		popover.value.popover.style.opacity = '0'
	}

	function processDrop(e: NDropEvent) {
		const { goingToCharacter, comingFromCharacter, oldMeaning, newMeaning  } = e
		// if(goingToCharacter === "MEANINGZONE") {
		// 	//Ignore drop if picked up and dropped in meaning zone
		// 	if(modelData.meanings.find(m => m == newMeaning)) return
		//
		// 	let char = modelData.characters.find(c => c.kanji == comingFromCharacter)
		// 	if(!char) throw new Error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)
		//
		// 	char.attachedMeaning = ""
		// 	modelData.meanings.push(newMeaning)
		// 	return
		// }
		//
		// if(comingFromCharacter && oldMeaning) {
		// 	let char = modelData.characters.find(c => c.kanji == comingFromCharacter)
		// 	if(!char) throw new Error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)
		//
		// 	char.attachedMeaning = oldMeaning
		// } else if(!comingFromCharacter && oldMeaning) {
		// 	modelData.meanings.push(oldMeaning)
		// } else if(comingFromCharacter && !oldMeaning) {
		// 	let char = modelData.characters.find(c => c.kanji == comingFromCharacter)
		// 	if(!char) throw new Error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)
		//
		// 	char.attachedMeaning = ""
		// }
		//
		// modelData.meanings = modelData.meanings.filter(m => m != newMeaning)
		//
		// let char = modelData.characters.find(c => c.kanji == goingToCharacter)
		// if(!char) throw new Error(`Unable to find ${goingToCharacter} in modelData.characters while trying to set attachedMeaning to newMeaning`)
		// char.attachedMeaning = newMeaning

		if(modelData.meanings.length <= 0 && store.autoCheck) {
			checkAnswers()
		}
	}

	function toggleSettings() {
		//Programmatically add and remove transition so there's no strange animations on window resize
		if(!puzzleStage.value) throw new Error("Tried to access puzzleStage ref but it's null")
		puzzleStage.value.style.transition = 'width 1s cubic-bezier(.75,0,.25,1)'
		setTimeout(() => {
			if(!puzzleStage.value) throw new Error("Tried to access puzzleStage ref but it's null")
			puzzleStage.value.style.transition = ''
		}, 1000)
		showSettings.value = !showSettings.value
	}

	function updateSettings() {
		if(!wanikaniLevel.value && store.wanikaniAPIKey) {
			popoverShow("ちょい待ちこ", "Fetching Wanikani info...")
			wanikaniRequest(store.wanikaniAPIKey).then(userData => {
				wanikaniLevel.value = userData.data.level
				wanikaniUsername.value = userData.data.username
				toggleSettings()
				getNextKanjiBatch("設定をセーブしたよん！", "Retrieving kanji list...")
			})

		} else {
			toggleSettings()
			getNextKanjiBatch("設定をセーブしたよん！", "Retrieving kanji list...")
		}
	}

	function getNextKanjiBatch(popoverText: string, popoverSubtext: string) {
		popoverShow(popoverText, popoverSubtext)
		setTimeout(() => {
			readyToGoToNextKanjiBatch.value = false
			let maxLevelRequest = store.levelLimitUpper
			if(store.useWanikaniLevel && wanikaniLevel.value && wanikaniUsername) {
				maxLevelRequest = wanikaniLevel.value
			}
			let message: KanjiBatchRequest = {
				type: "KanjiBatchRequest",
				data: {
					user_id: wanikaniUsername.value,
					group_count: store.batchSize,
					max_level: maxLevelRequest,
					min_level: store.levelLimitLower,
					min_group_size: 2,
				}
			}
			let request = apiRequest(message)
			request.then((newKanji: ServerKanji) => {
				updateKanji(newKanji)
				setTimeout(popoverHide, 500)
			})
		}, 500)
	}

	function updateKanji(newKanji: ServerKanji) {
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
		display: flex;
		flex-direction: column;
		height: calc(100dvh - 4px);
		overflow: hidden;
	}
	#puzzle-stage {
		display: flex;
		width: calc(100vw + 295px);
	}
	#stage.showSettings #puzzle-stage {
		width: calc(100vw - 20px);
	}
</style>
