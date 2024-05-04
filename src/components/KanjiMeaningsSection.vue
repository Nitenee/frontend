<template>
	<section class="kanji-meanings">
		<div class="curve">
			<div class="button-container">
				<div>
					<button class="submit-button" :class="continueStyle" @click.prevent="emit('onSubmit')">
						{{ submitButtonText }}
					</button>
				</div>
			</div>
		</div>
		<div class="kanji-meaning-items-container">
			<div>
				<RoundedCorners :hideBottomRight=true :hideTopRight="true" />
				<KanjiMeaning 
					v-for="meaning in state.modelData.meanings" 
					:key="meaning" 
					:meaning="meaning" 
					:attachedCharacter="''"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang='ts'>
	import { computed } from 'vue'
	import RoundedCorners from '@/components/RoundedCorners.vue'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import { useKanjiState } from '@/stores/kanjistate'

	const state = useKanjiState()
	const submitButtonText = computed(() => {
		return state.readyToGoToNextKanjiBatch ? "Continue" : "Check" 
	})
	const continueStyle = computed(() => {
		return state.readyToGoToNextKanjiBatch ? "continue" : ""
	})

	const emit = defineEmits(['onSubmit'])
</script>

<style scoped>
	.kanji-meanings {
		height: calc(100dvh - 64px);
		min-width: 200px;
		background-color: #414559;
	}
	.kanji-meaning-items-container {
		height: calc(100% - 110px);
		background-color: #414559;
		box-shadow: inset 2px -2px 2px #0007;
	}
	.kanji-meaning-items-container > div {
		position: relative;
		direction: rtl;
		height: 100%;
		padding-top: 20px;
		overflow-y: auto;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
	}
	.button-container {
		position: relative;
		padding-top: 10px;
		padding-bottom: 20px;
		background-color: #51576d;
		border-bottom-right-radius: 15px;
		box-shadow: 0px 3px 3px 0px #0007;
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
		transition: translate 0.3s, box-shadow 0.3s, background-color 0.3s;
	}
	.submit-button:hover {
		cursor: pointer;
		background-color: #cacbff;
		box-shadow: 4px 4px 8px #0004;
		translate: -2px -2px;
	}
	.continue {
		background-color: #a6d189;
	}
	.submit-button.continue:hover {
		background-color: #c6f1a9;
	}
</style>
