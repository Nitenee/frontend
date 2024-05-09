<template>
	<section class="kanji-meanings">
		<div class="curve">
			<div class="button-container">
				<div>
					<button class="submit-button" :class="continueStyle" @click.prevent="emit('onSubmit')">
						<Transition name="check-button" mode="out-in">
							<span v-if="state.readyToGoToNextKanjiBatch">Continue</span>
							<span v-else>Check</span>
						</Transition>
					</button>
				</div>
			</div>
		</div>
		<div class="kanji-meaning-items-container">
			<div>
				<RoundedCorners :hideBottomRight=true :hideTopRight="true" />
				<TransitionGroup 
					tag="div" 
					class="meanings"
					name="meaning" 
					@enter="onEnter"
				>
					<KanjiMeaning 
						v-for="(meaning, index) in state.modelData.meanings" 
						:key="meaning" 
						:data-index="index"
						:meaning="meaning" 
						:attachedCharacter="''"
					/>
				</TransitionGroup>
			</div>
		</div>
	</section>
</template>

<script setup lang='ts'>
	import { computed } from 'vue'
	import gsap from 'gsap'
	import RoundedCorners from '@/components/RoundedCorners.vue'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import { useKanjiState } from '@/stores/kanjistate'

	const state = useKanjiState()
	const continueStyle = computed(() => {
		return state.readyToGoToNextKanjiBatch ? "continue" : ""
	})

	function onEnter(el: Element, done: () => void) {
		gsap.fromTo(el, {
			opacity: 0,
			transform: 'translateX(-50px) scale(0.5)',
		}, 
		{
			opacity: 1,
			transform: 'translateX(0) scale(1)',
			ease: "elastic.out",
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			delay: Number(el.dataset.index!) * 0.1,
				onComplete: () => { el.setAttribute('style', ''); done() }
		})
	}

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
	}
	.meanings {
		height: 100%;
		padding-top: 20px;
		overflow-y: auto;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
		scrollbar-gutter: stable both-edges;
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
		user-select: none;
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
	.check-button-enter-from {
		opacity: 0;
		transform: translateY(-30px);
	}
	.check-button-leave-to {
		opacity: 0;
		transform: translateY(30px);
	}
	.check-button-enter-active,
	.check-button-leave-active {
		transition: all 0.5s ease;
	}
	.meaning-move	{
		transition: all 0.5s ease;
	}
	.meaning-leave-active {
		transition: opacity 0.5s ease, scale 0.5s ease;
	}
	.meaning-leave-active {
		position: absolute;
		translate: -50px 0px;
	}
	.meaning-leave-to {
		opacity: 0;
		scale: 0;
	}
</style>
