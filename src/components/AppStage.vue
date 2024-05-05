<template>
	<div id="stage"
		:class="toggleSettingsStyle"
		@pointermove="onPointerMove"
		@pointerup="unsetDragging"
	>
		<PopOver 
			:popoverText="popoverText"
			:popoverSubtext="popoverSubtext"
			ref="popover" 
		/>
		<DragIllusion />
		<NavBar @togglesettings="toggleSettings" />
		<div ref="puzzleStage" id="puzzle-stage">
			<KanjiMeaningSection @on-submit="onSubmit" />
			<KanjiCharacterSection />
			<SettingsPanel @settingsUpdated="updateSettings"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	/*
		FIX:
		Meanings not breaking mid word correctly
	*/
	import { ref, computed } from 'vue'
	import { useKanjiSettings } from '@/stores/kanjisettings'
	import { useDragAndDrop } from '@/stores/draganddrop'
	import { useKanjiState } from '@/stores/kanjistate'
	import { shuffleArray, apiRequest, wanikaniRequest } from '@/utils/utils'
	import { ServerKanji, KanjiBatchRequest } from '@/utils/types'

	import NavBar from '@/components/NavBar.vue'
	import PopOver from '@/components/PopOver.vue'
	import DragIllusion from '@/components/DragIllusion.vue'
	import KanjiMeaningSection from '@/components/KanjiMeaningsSection.vue'
	import KanjiCharacterSection from '@/components/KanjiCharacterSection.vue'
	import SettingsPanel from '@/components/SettingsPanel.vue'

	const settings = useKanjiSettings()
	const dragAndDrop = useDragAndDrop()
	const state = useKanjiState()
	const puzzleStage = ref<HTMLElement | null>(null)

	state.setCheckAnswers(autoCheckAnswers)

	let wanikaniLevel = ref<number | null>(null)
	let wanikaniUsername = ref("")
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

	function unsetDragging() {
		dragAndDrop.clearDragging()
	}

	function onPointerMove(e: PointerEvent) {
		dragAndDrop.setPointerPosition({ x: e.x, y: e.y })
		dragAndDrop.checkCursor()
	}

	function onSubmit() {
		if (state.readyToGoToNextKanjiBatch) {
			getNextKanjiBatch("ナイス！", "Retrieving next kanji set...", true)
		} else {
			checkAnswers()
		}
	}

	function autoCheckAnswers() {
		if(state.modelData.meanings.length <= 0 && settings.autoCheck) {
			checkAnswers()
		}
	}

	function checkAnswers() {
		let allAnswersCorrect = true
		state.modelData.characters.forEach(character => {
			let correct = character.correctMeaning == character.attachedMeaning
			if(!correct) {
				allAnswersCorrect = false
			}
			character.incorrect = !correct
		})

		if(allAnswersCorrect && settings.autoContinue) {
			setTimeout(() => {
				getNextKanjiBatch("ナイス！", "Retrieving next kanji set...", true)
			}, 250)
		} else if(allAnswersCorrect) {
			popoverShow("グッドジョブ！", "Looking good!", true)
			setTimeout(() => {
				state.setReadyToGoToNextKanjiBatch(true)
				setTimeout(() => {
					popoverHide()
				}, 1000)
			}, 1000)
		}
	}

	function popoverShow(popupText: string, popupSubtext: string, animate: boolean) {
		if(!popupText || !popupSubtext) throw new Error("You must enter popup text")
		if(!popover.value || !popover.value.popover) throw new Error ("popover ref is null")
		popoverText.value = popupText
		popoverSubtext.value = popupSubtext
		// TypeScript weirding out about this syntax
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		popover.value.popover.style.pointerEvents = 'initial'
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		popover.value.popover.classList.add('show')
		if(animate) {
			popover.value.popover.classList.add('animate')
		}
	}

	function popoverHide() {
		if(!popover.value || !popover.value.popover) throw new Error ("popover ref is null")
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		popover.value.popover.style.pointerEvents = 'none'
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		popover.value.popover.classList.remove('show')
		popover.value.popover.classList.remove('animate')
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
		if(!wanikaniLevel.value && settings.wanikaniAPIKey) {
			popoverShow("ちょい待ちこ", "Fetching Wanikani info...", false)
			wanikaniRequest(settings.wanikaniAPIKey).then(userData => {
				wanikaniLevel.value = userData.data.level
				wanikaniUsername.value = userData.data.username
				toggleSettings()
				getNextKanjiBatch("設定をセーブしたよん！", "Retrieving kanji list...", false)
			})

		} else {
			toggleSettings()
			getNextKanjiBatch("設定をセーブしたよん！", "Retrieving kanji list...", false)
		}
	}

	function getNextKanjiBatch(popoverText: string, popoverSubtext: string, animate: boolean) {
		popoverShow(popoverText, popoverSubtext, animate)
		state.clearModelData()
		setTimeout(() => {
			state.setReadyToGoToNextKanjiBatch(false)
			let maxLevelRequest = settings.levelLimitUpper
			if(settings.useWanikaniLevel && wanikaniLevel.value && wanikaniUsername) {
				maxLevelRequest = wanikaniLevel.value
			}
			let message: KanjiBatchRequest = {
				type: "KanjiBatchRequest",
				data: {
					user_id: wanikaniUsername.value,
					group_count: settings.batchSize,
					max_level: maxLevelRequest,
					min_level: settings.levelLimitLower,
					min_group_size: 2,
				}
			}
			let request = apiRequest(message)
			request.then((newKanji: ServerKanji) => {
				updateKanji(newKanji)
				setTimeout(popoverHide, 1000)
			})
		}, 1000)
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
		state.setModelData(shuffleArray(meanings), shuffleArray(characters))
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
	.dragging-cursor {
		cursor: grabbing !important; /* Don't allow override while dragging!!! */
	}
</style>
