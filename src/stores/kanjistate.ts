import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { CharacterInfo, NDropEvent } from '@/utils/types'


export const useKanjiState = defineStore('kanji-state', () => {
	const modelData = reactive({ meanings: [] as string[], characters: [] as CharacterInfo[] })
	const readyToGoToNextKanjiBatch = ref(false)
	const checkAnswers = ref<(() => void) | null>(null)

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
	function clearModelData() {
		modelData.meanings = [] as string[]
		modelData.characters = [] as CharacterInfo[]
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

	return {
		modelData,
		readyToGoToNextKanjiBatch,

		setModelData,
		setModelDataMeanings,
		setModelDataCharacters,
		clearModelData,
		setReadyToGoToNextKanjiBatch,
		setCheckAnswers,
		
		processDrop
	}
})
