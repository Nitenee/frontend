<template>
	<section class="kanji-characters-container">
		<RoundedCorners :hideBottomLeft="true" />
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
		box-shadow: inset 0px 0px 2px 2px #0007;
		background-color: #303446;
		background-image: url('@/assets/images/hexbgtransparent.webp');
		animation: backgroundpanner 10s linear infinite;
	}
	@keyframes backgroundpanner {
		0% { background-position: 0px 0px; }
		100% { background-position: 60px 52px; }
	}
	.kanji-characters {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		justify-content: space-evenly;
		gap: 20px;
		padding: 20px;
		height: 100dvh;
		overflow-y: auto;
		scrollbar-gutter: stable both-edges;
		scrollbar-color: #838ba7 #626880;
		scrollbar-width: thin;
	}
</style>
