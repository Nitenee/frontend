<template>
	<section>
		<div class="click-save-overlay" :class="hasSelectedSettings ? 'hide-overlay' : ''"></div>
		<div class="click-save-canvas-wrapper">
			<canvas ref="canvasEl" class="click-save-canvas"></canvas>
		</div>
		<div class="settings-panel-container">
			<div class="scrollbar-rounder">
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
						<button 
							id="settings-save-button"
							class="save-button"
							ref="saveButtonEl"
							@click="updateValues">
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang='ts'>
	import { ref, computed, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useKanjiSettings } from '@/stores/kanjisettings'
	import { useKanjiState } from '@/stores/kanjistate'
	import { useDragAndDrop } from '@/stores/draganddrop'
	import { findIntersection, calculateAngleBetweenPoints, pointNormal } from '@/utils/utils'

	const emit = defineEmits(['settingsUpdated']);
	const store = useKanjiSettings()
	const dragAndDrop = useDragAndDrop()
	const { hasSelectedSettings } = storeToRefs(useKanjiState())

	const upperLimitDisabled = computed(() => store.useWanikaniLevel ? "disabled" : "")
	const saveButtonEl = ref<HTMLElement | null>(null)
	const canvasEl = ref<HTMLCanvasElement | null>(null)

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

		window.requestAnimationFrame(animateClickSaveArrow)
	})

	let animationSpeed = 1;
	let animationDistancex = 15;

	function animateClickSaveArrow() {
		if(canvasEl.value) {
			canvasEl.value.width = window.innerWidth
			canvasEl.value.height = window.innerHeight
			const ctx = canvasEl.value.getContext("2d")
			if(!ctx || !saveButtonEl.value) return
			const saveButtonRect = saveButtonEl.value.getBoundingClientRect()
			let currTime = new Date().getSeconds()
			let animationOffset = Math.sin(window.performance.now() * Math.PI * 0.001 * animationSpeed);

			let y = (saveButtonRect.top + saveButtonRect.bottom) / 2
			const curve = {
				startx: window.innerWidth - 500 + (animationOffset * animationDistancex) / -8,
				starty: window.innerHeight / 2 + (animationOffset * animationDistancex) / -8,
				stopx: saveButtonRect.left - 100 + animationOffset * animationDistancex,
				stopy: y,
				buttonx: saveButtonRect.left,
				buttony: y,
			}
			//Make sure arrow doesn't go out of window
			if(curve.stopy > window.innerHeight - 50) {
				const intersectingPoint = findIntersection({
					x1: curve.startx, y1: curve.starty,
					x2: curve.stopx, y2: curve.stopy
				}, {
					x1: 0, y1: window.innerHeight - 50,
					x2: 10, y2: window.innerHeight - 50,
				})

				curve.stopx = intersectingPoint.x + animationOffset
				curve.stopy = intersectingPoint.y
			}
			let normal = pointNormal(curve.stopx - curve.buttonx, curve.stopy - curve.buttony);
			let endTangentLength = 100
			const bezier = {
				point1x: (curve.stopx - curve.startx) * 0.25 + curve.startx,
				point1y: (curve.starty + curve.stopy) / 2,
				point2x: curve.stopx + normal.x * endTangentLength,
				point2y: curve.stopy + normal.y * endTangentLength,
			}


			ctx.strokeStyle = "#c6d0f5"
			ctx.fillStyle = "#c6d0f5"
			ctx.lineWidth = 10
			ctx.lineCap = "round"
			ctx.beginPath()
			ctx.moveTo(curve.startx, curve.starty)
			ctx.bezierCurveTo(bezier.point1x, bezier.point1y, bezier.point2x, bezier.point2y, curve.stopx, curve.stopy)
			ctx.stroke()

			//Rotate canvas to draw arrow at correct angle
			const angleToButton = calculateAngleBetweenPoints(curve.stopx, curve.stopy, curve.buttonx, curve.buttony)
			ctx.save()
			ctx.translate(curve.stopx, curve.stopy)
			ctx.rotate(angleToButton)
			ctx.translate(curve.stopx * -1, curve.stopy * -1)
			ctx.beginPath()
			ctx.moveTo(curve.stopx, curve.stopy)
			ctx.lineTo(curve.stopx - 20, curve.stopy - 20)
			ctx.stroke()
			ctx.moveTo(curve.stopx, curve.stopy)
			ctx.lineTo(curve.stopx - 20, curve.stopy + 20)
			ctx.stroke()
			ctx.fill()
			ctx.restore()

			window.requestAnimationFrame(animateClickSaveArrow)
		}
	}
</script>

<style scoped>
	section {
		position: initial;
		height: calc(100dvh - 64px);
		width: 300px;
		padding: 0px 10px;
	}
	.settings-panel-container {
		position: relative;
		height: 100%;
		width: 300px;
		padding: 10px;
		background-color: var(--color-surface0);
		border-radius: 20px;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.settings-panel-container:hover {
		translate: -1px -1px;
		box-shadow: 4px 4px 8px #0007;
	}
	.scrollbar-rounder {
		overflow: hidden;
		height: 100%;
		border-radius: 10px;
	}
	.settings-panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		background-color: var(--color-overlay0);
		box-shadow: 2px 2px 2px #0004;
		padding: 10px;
		scrollbar-color: var(--color-overlay1) var(--color-surface2);
		scrollbar-width: thin;
		overflow-y: auto;
		overflow-x: visible;
	}
	.panel-title {
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		font-family: 'MikanNoki';
		font-size: 30px;
		font-weight: bold;
		color: var(--color-text);
		-webkit-text-stroke: 1pt var(--color-base);
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
		color: var(--color-text); 
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
		background-color: var(--color-base);
	}
	.option-content {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 10px;
		border-radius: 0px 0px 5px 5px;
		background-color: var(--color-surface1);
	}
	input {
		all: unset;
		text-align: center;
		width: 30px;
		background-color: var(--color-surface0);
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
		appearance: textfield;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}
	input[type="checkbox"] {
		background-color: var(--color-maroon);
		transition: background-color 0.3s;
	}
	input[disabled] {
		color: var(--color-surface1);
	}
	input[type="checkbox"]:checked {
		background-color: var(--color-green);
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
		color: var(--color-surface2);
	}
	.save-button-container {
		position: relative;
		align-self: flex-end;
		display: flex;
		align-items: center;
		padding: 10px 20px;
		background-color: var(--color-surface0);
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
		background-color: var(--color-lavender);
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s;
	}
	.save-button:hover {
		cursor: pointer;
		background-color: #cacbff;
		translate: -2px -2px;
	}
	.click-save-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: #000a;
		transition: 0.5s background-color ease;
	}
	.hide-overlay {
		background-color: #0000;
		pointer-events: none;
	}
	.click-save-canvas-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		user-select: none;
		z-index: 5;
		filter: drop-shadow(2px 2px 2px #0007);
	}
</style>
