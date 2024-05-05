<template>
	<section class="kanji-characters-container">
		<RoundedCorners :hideBottomLeft="true" />
		<div class="kanji-characters" v-if="modelData.characters.length > 0">
			<KanjiContainer 
				v-for="kanji in modelData.characters" 
				:key="kanji.kanji" 
				:kanji="kanji.kanji" 
				:attachedMeaning="kanji.attachedMeaning"
				:incorrect="kanji.incorrect"
			/>
		</div>
	</section>
</template>

<script setup lang='ts'>
	import KanjiContainer from '@/components/KanjiContainer.vue'
	import RoundedCorners from '@/components/RoundedCorners.vue'
	import { useKanjiState } from '@/stores/kanjistate'

	const { modelData } = useKanjiState()
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
	}
	.kanji-characters {
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
