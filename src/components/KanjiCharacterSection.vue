<template>
	<section class="kanji-characters-container">
		<div class="background-layer"></div>
		<div class="background-layer-shadow"></div>
		<RoundedCorners :hideBottomLeft="true" :hideTopRight="true" :hideBottomRight="true" />
			<TransitionGroup 
				tag="div"
				class="kanji-characters"
				name="meaning" 
				@enter="onEnter"
				@leave="onLeave"
			>
				<KanjiContainer 
					v-for="(kanji, index) in modelData.characters" 
					:key="kanji.kanji" 
					:data-index="index"
					:kanji="kanji.kanji" 
					:attachedMeaning="kanji.attachedMeaning"
					:incorrect="kanji.incorrect"
				/>
			</TransitionGroup>
	</section>
</template>

<script setup lang='ts'>
	import { onMounted } from 'vue'
	import gsap from 'gsap'
	import KanjiContainer from '@/components/KanjiContainer.vue'
	import RoundedCorners from '@/components/RoundedCorners.vue'
	import { useKanjiState } from '@/stores/kanjistate'

	const { modelData } = useKanjiState()

	function onEnter(el: Element, done: () => void) {
		gsap.fromTo(el, {
			opacity: 0,
			transform: 'translateY(-50px)',
		}, 
		{
			opacity: 1,
			transform: 'translateY(0px)',
			ease: "power4.out",
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			delay: Number(el.dataset.index!) * 0.1,
			onComplete: done
		})
	}
	function onLeave(el: Element, done: () => void) {
		gsap.to(el, {
				opacity: 0,
				transform: 'translateY(100px)',
				ease: "power4.in",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				onComplete: done
			}
		)
	}
</script>

<style scoped>
	.kanji-characters-container {
		position: relative;
		height: calc(100vh - 64px);
		width: calc(100vw - 500px);
		min-width: 200px;
		flex-grow: 1;
		background-color: #303446;
		overflow: hidden;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}
	.background-layer {
		position: absolute;
		width: 200%;
		height: 200%;
		background-image: url('@/assets/images/hexbgtransparent.webp');
		animation: backgroundpanner 10s linear infinite;
		transform: translate(-50% -50%);
	}
	.background-layer-shadow {
		position: absolute;
		width: 100%;
		height: 100%;
		box-shadow: inset 0px 0px 2px 2px #0007;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}
	@keyframes backgroundpanner {
		0% { translate: -50% -50%; }
		100% { translate: calc(-50% + 60px) calc(-50% + 52px); }
	}
	.kanji-characters {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		/* Fallback for Safari which doesn't support 'safe' */
		align-content: flex-start;
		align-content: safe center;
		padding: 20px;
		gap: 25px;
		justify-content: space-evenly;
		height: calc(100dvh - 64px);
		overflow-y: auto;
		scrollbar-gutter: stable both-edges;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
	}
</style>
