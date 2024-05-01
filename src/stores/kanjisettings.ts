import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKanjiSettings = defineStore('kanji-settings', () => {
	const batchSize = ref(3)
	const groupKanji = ref(true)
	const autoCheck = ref(true)
	const autoContinue = ref(true)
	const useWanikaniLevel = ref(false)
	const wanikaniAPIKey = ref("")
	const levelLimitUpper = ref(60)
	const levelLimitLower = ref(1)

	function setBatchSize       (inValue: number) { batchSize.value = inValue }
	function setGroupKanji      (inValue: boolean){ groupKanji.value = inValue }
	function setAutoCheck       (inValue: boolean){ autoCheck.value = inValue }
	function setAutoContinue    (inValue: boolean){ autoContinue.value = inValue }
	function setUseWanikaniLevel(inValue: boolean){ useWanikaniLevel.value = inValue }
	function setWanikaniAPIKey  (inValue: string) { wanikaniAPIKey.value = inValue }
	function setLevelLimitUpper (inValue: number) { levelLimitUpper.value = inValue }
	function setLevelLimitLower (inValue: number) { levelLimitLower.value = inValue }

	return {
		batchSize, groupKanji, autoCheck,
		autoContinue, useWanikaniLevel,
		wanikaniAPIKey, levelLimitUpper,
		levelLimitLower,

		setBatchSize, setGroupKanji, setAutoCheck,
		setAutoContinue, setUseWanikaniLevel,
		setWanikaniAPIKey, setLevelLimitUpper,
		setLevelLimitLower
	}
})
