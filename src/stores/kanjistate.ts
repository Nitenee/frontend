import { defineStore } from 'pinia'
import { ref, reactive, Ref } from 'vue'
import { CharacterInfo, NDropEvent } from '@/utils/types'


export const useKanjiState = defineStore('kanji-state', () => {
	const modelData = reactive({ meanings: [] as string[], characters: [] as CharacterInfo[] })
	const hasSelectedSettings = ref(false)
	const showSettings = ref(true)
	const readyToGoToNextKanjiBatch = ref(false)
	const checkAnswers = ref<(() => void) | null>(null)
	const allCorrectWaveAnimation = ref<(() => void) | null>(null)
	const toggleSettingsEffectElements = ref<Ref<HTMLElement | null>[]>([])
	function setReadyToGoToNextKanjiBatch(inValue: boolean) {
		readyToGoToNextKanjiBatch.value = inValue
	}

	function setModelData(inMeanings: string[], inCharacters: CharacterInfo[], stagger: boolean) {
		if(stagger) {
			setTimeout(() => modelData.characters = inCharacters, 1000)
			setTimeout(() => modelData.meanings = inMeanings, 1500)
		} else {
			modelData.meanings = inMeanings
			modelData.characters = inCharacters
		}
	}
	function setModelDataMeanings(inMeanings: string[]) {
		modelData.meanings = inMeanings
	}
	function setModelDataCharacters(inCharacters: CharacterInfo[]) {
		modelData.characters = inCharacters
	}
	function setHasSelectedSettings(inHasSelectedSettings: boolean) {
		hasSelectedSettings.value = inHasSelectedSettings
	}
	function setShowSettings(inShowSettings: boolean) {
		showSettings.value = inShowSettings
		toggleSettingsEffectElements.value.forEach(elementRef => {
			
			if(!elementRef.value) return
			elementRef.value.style.transition = 'all 1s cubic-bezier(.75,0,.25,1)'
			setTimeout(() => {
				if(!elementRef.value) return
				elementRef.value.style.transition = ''
			}, 1000)
		})
	}
	function clearModelData() {
		modelData.meanings = [] as string[]
		modelData.characters = [] as CharacterInfo[]
	}
	function registerToggleSettingsEffectElement(inElement: Ref<HTMLElement | null>) {
		toggleSettingsEffectElements.value.push(inElement)
	}

	function processDrop(e: NDropEvent) {
		const { goingToCharacter, comingFromCharacter, oldMeaning, newMeaning  } = e
		if(goingToCharacter === "MEANINGZONE") {
			//Ignore drop if picked up and dropped in meaning zone
			if(modelData.meanings.find(m => m == newMeaning)) return

			const char = modelData.characters.find(c => c.kanji == comingFromCharacter)
			if(!char) {
				console.error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)
				return
			}

			char.attachedMeaning = ""
			modelData.meanings.push(newMeaning)
			return
		}

		if(comingFromCharacter && oldMeaning) {
			const char = modelData.characters.find(c => c.kanji == comingFromCharacter)
			if(!char) {
				console.error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)
				return
			}

			char.attachedMeaning = oldMeaning
		} else if(!comingFromCharacter && oldMeaning) {
			modelData.meanings.push(oldMeaning)
		} else if(comingFromCharacter && !oldMeaning) {
			const char = modelData.characters.find(c => c.kanji == comingFromCharacter)
			if(!char) {
				console.error(`Meaning coming from ${comingFromCharacter} but unable to find it in list.`)
				return
			}

			char.attachedMeaning = ""
		}

		modelData.meanings = modelData.meanings.filter(m => m != newMeaning)

		const char = modelData.characters.find(c => c.kanji == goingToCharacter)
		if(!char) throw new Error(`Unable to find ${goingToCharacter} in modelData.characters while trying to set attachedMeaning to newMeaning`)
		char.attachedMeaning = newMeaning

		if(!checkAnswers.value) throw new Error("checkAnswers function is null in kanji-state store")
		checkAnswers.value()
	}

	function setCheckAnswers(inFunction: () => void) {
		checkAnswers.value = inFunction
	}
	function setAllCorrectWaveAnimation(inFunction: () => void) {
		allCorrectWaveAnimation.value = inFunction
	}

	return {
		modelData,
		readyToGoToNextKanjiBatch,
		hasSelectedSettings,
		showSettings,
		toggleSettingsEffectElements,

		setModelData,
		setModelDataMeanings,
		setModelDataCharacters,
		setHasSelectedSettings,
		setShowSettings,
		registerToggleSettingsEffectElement,
		clearModelData,
		setReadyToGoToNextKanjiBatch,
		setCheckAnswers,
		setAllCorrectWaveAnimation,
		
		processDrop
	}
})
