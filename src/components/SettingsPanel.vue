<template>
	<section>
		<div class="settings-panel-container">
			<div class="settings-panel">
				<div class="panel-title">
					設定
				</div>
				<div class="option-container">
					<div class="option-title">
						Answer Checking
					</div>
					<div class="option-content">
						<div class="group-kanji">
							<div class="flex-grow">Auto-Check</div>
							<input type="checkbox" v-model="store.autoCheck" />
						</div>
						<div class="group-kanji">
							<div class="flex-grow">Auto-Continue</div>
							<input type="checkbox" v-model="store.autoContinue" />
						</div>
					</div>
				</div>
				<div class="option-container">
					<div class="option-title">
						Grouping
					</div>
					<div class="option-content">
						<div class="batch-size">
							<div class="flex-grow">Number of Groups</div>
							<input type="number" @blur="checkLimits('batch')" v-model="store.batchSize"/>
						</div>
						<div class="group-kanji">
							<div class="flex-grow">Keep Groups Together</div>
							<input type="checkbox" v-model="store.groupKanji" />
						</div>
					</div>
				</div>
				<div class="option-container">
					<div class="option-title">Level Limits</div>
					<div class="option-content">
						<div class="level-limit">
							<div class="flex-grow" :class="upperLimitDisabled">Upper Limit</div>
							<input type="number" @blur="checkLimits('upper')" v-model="store.levelLimitUpper" :disabled="store.useWanikaniLevel" />
						</div>
						<div class="level-limit">
							<div class="flex-grow">Lower Limit</div>
							<input type="number" @blur="checkLimits('lower')" v-model="store.levelLimitLower" />
						</div>
						<div class="level-limit">
							<div class="flex-grow">Use WaniKani Level</div>
							<input type="checkbox" v-model="store.useWanikaniLevel" />
						</div>
					</div>
				</div>
				<div class="option-container">
					<div class="option-title">
						WaniKani
					</div>
					<div class="option-content">
						<div class="wanikani">
							<div>API Key</div>
							<input type="password" v-model="store.wanikaniAPIKey" placeholder="API Key Goes Here" />
						</div>
					</div>
				</div>
				<div class="save-button-container">
					<button class="save-button" @click="updateValues">
						Save
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang='ts'>
	import { computed, onMounted } from 'vue'
	import { useKanjiSettings } from '@/stores/kanjisettings'

	const emit = defineEmits(['settingsUpdated']);
	const store = useKanjiSettings()

	const upperLimitDisabled = computed(() => store.useWanikaniLevel ? "disabled" : "")


	function checkLimits(inLimit: string) {
		if(inLimit == "upper") {
			if(store.levelLimitUpper > 60) store.levelLimitUpper = 60
			else if(store.levelLimitUpper < 1) store.levelLimitUpper = 1
		} else if(inLimit == "lower") {
			if(store.levelLimitLower  > 60) store.levelLimitLower = 60 
			else if(store.levelLimitLower  < 1) store.levelLimitLower = 1
		} else if(inLimit == "batch") {
			if(store.batchSize > 20) store.batchSize = 20
			else if(store.batchSize < 1) store.batchSize = 1
		} else {
			throw new Error(`Running checkLimits('${inLimit}'), but no case for ${inLimit}`)
		}
	}

	function updateValues() {
		//Save settings to localstorage
		localStorage.setItem('settingsExist', true.toString())
		localStorage.setItem('batchSize', store.batchSize.toString())
		localStorage.setItem('groupKanji', store.groupKanji.toString())
		localStorage.setItem('autoCheck', store.autoCheck.toString())
		localStorage.setItem('autoContinue', store.autoContinue.toString())
		localStorage.setItem('useWanikaniLevel', store.useWanikaniLevel.toString())
		localStorage.setItem('wanikaniAPIKey', store.wanikaniAPIKey)
		localStorage.setItem('levelLimitUpper', store.levelLimitUpper.toString())
		localStorage.setItem('levelLimitLower', store.levelLimitLower.toString())
		emit('settingsUpdated')
	}

	onMounted(() => {
		//Load from localStorage if settings exist
		if(localStorage.getItem("settingsExist")){
			let batchSize = localStorage.getItem('batchSize')
			let groupKanji = localStorage.getItem('groupKanji')
			let autoCheck = localStorage.getItem('autoCheck')
			let autoContinue = localStorage.getItem('autoContinue')
			let useWanikaniLevel = localStorage.getItem('useWanikaniLevel')
			let wanikaniAPIKey = localStorage.getItem('wanikaniAPIKey')
			let levelLimitUpper = localStorage.getItem('levelLimitUpper')
			let levelLimitLower = localStorage.getItem('levelLimitLower')

			if(!batchSize) throw new Error("Tried to recover batchSize from localStorage but it was undefined")
			if(!groupKanji) throw new Error("Tried to recover groupKanji from localStorage but it was undefined")
			if(!autoCheck) throw new Error("Tried to recover autoCheck from localStorage but it was undefined")
			if(!autoContinue) throw new Error("Tried to recover autoContinue from localStorage but it was undefined")
			if(!useWanikaniLevel) throw new Error("Tried to recover useWanikaniLevel from localStorage but it was undefined")
			if(wanikaniAPIKey == null) throw new Error("Tried to recover wanikaniAPIKey from localStorage but it was null")
			if(!levelLimitUpper) throw new Error("Tried to recover levelLimitUpper from localStorage but it was undefined")
			if(!levelLimitLower) throw new Error("Tried to recover levelLimitLower from localStorage but it was undefined")

			store.setBatchSize(Number(batchSize))
			store.setGroupKanji((groupKanji === "true"))
			store.setAutoCheck((autoCheck === "true"))
			store.setAutoContinue((autoContinue === "true"))
			store.setUseWanikaniLevel((useWanikaniLevel === "true"))
			store.setWanikaniAPIKey(wanikaniAPIKey)
			store.setLevelLimitUpper(Number(levelLimitUpper))
			store.setLevelLimitLower(Number(levelLimitLower))
		}
	})
</script>

<style scoped>
	section {
		height: calc(100dvh - 64px);
		width: 300px;
		padding: 0px 10px;
	}
	.settings-panel-container {
		height: 100%;
		width: 300px;
		padding: 10px;
		background-color: #414559;
		border-radius: 20px;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.settings-panel-container:hover {
		translate: -1px -1px;
		box-shadow: 4px 4px 8px #0007;
	}
	.settings-panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		background-color: #737994;
		border-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		padding: 10px;
	}
	.panel-title {
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		font-family: 'MikanNoki';
		font-size: 30px;
		font-weight: bold;
		color: #c6d0f5;
		-webkit-text-stroke: 1pt #303446;
		text-shadow: 2px 2px 2px #0007;
		letter-spacing: -3px;
		transition: translate 0.3s, text-shadow 0.3s;
	}
	.panel-title:hover {
		translate: -1px -1px;
		text-shadow: 4px 4px 8px #0007;
	}
	.option-container {
		display: flex;
		flex-direction: column;
		color: #c6d0f5; 
		border-radius: 5px;
		box-shadow: 2px 2px 2px #0007;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.option-container:hover {
		translate: -1px -1px;
		box-shadow: 4px 4px 8px #0007;
	}
	.option-title {
		padding: 5px 10px;
		border-radius: 5px 5px 0px 0px;
		background-color: #303446;
	}
	.option-content {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 10px;
		border-radius: 0px 0px 5px 5px;
		background-color: #51576d;
	}
	input {
		all: unset;
		text-align: center;
		width: 30px;
		background-color: #414559;
		border-radius: 5px;
		box-shadow: inset 0px 0px 2px #0004;
		transition: color 0.3s;
	}
	input[type="text"]:not(:disabled):hover,
	input[type="password"]:not(:disabled):hover,
	input[type="number"]:not(:disabled):hover {
		cursor: text;
	}
	input[type=number] {
			-moz-appearance:textfield;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}
	input[type="checkbox"] {
		background-color: #ea999c;
		transition: background-color 0.3s;
	}
	input[disabled] {
		color: #51576d;
	}
	input[type="checkbox"]:checked {
		background-color: #a6d189;
	}
	input[type="checkbox"]:hover {
		cursor: pointer;
	}
	.batch-size,
	.group-kanji,
	.level-limit {
		display: flex;
	}
	.flex-grow {
		text-align: center;
		flex-grow: 1;
	}
	.wanikani {
		text-align: center;
	}
	.wanikani input {
		width: 100%;
	}
	.wanikani input::placeholder {
		color: #626880;
	}
	.save-button-container {
		align-self: flex-end;
		display: flex;
		align-items: center;
		padding: 10px 20px;
		background-color: #414559;
		border-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.save-button-container:has(> .save-button:hover) {
		translate: 1px 1px;
		box-shadow: 1px 1px 1px #0007;
	}
	.save-button {
		all: unset;
		display: block;
		margin: auto;
		width: 100px;
		height: 40px;
		text-align: center;
		border-radius: 5px;
		background-color: #babbf1;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s;
	}
	.save-button:hover {
		cursor: pointer;
		background-color: #cacbff;
		translate: -2px -2px;
	}
</style>
