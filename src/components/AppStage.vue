<template>
	<div id="stage">
		<section class="kanji-meanings">
			<KanjiMeaning v-for="kanji in shuffledKanjiList" :key="kanji.meaning" :meaning="kanji.meaning" />
		</section>
		<section class="kanji-characters">
			<KanjiContainer v-for="kanji in shuffledKanjiList" :key="kanji.character" :kanji="kanji" />
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, inject, computed } from 'vue'
	import { buildLimitedKanjiSet, getRandomKanjiSet } from '@/utils/utils'
	import KanjiMeaning from '@/components/KanjiMeaning.vue'
	import KanjiContainer from '@/components/KanjiContainer.vue'

	const allKanji = inject('kanji')
	let levelLimit = 14
	const kanjiList = reactive(buildLimitedKanjiSet(allKanji, levelLimit))
	const selectedKanji = reactive(getRandomKanjiSet(kanjiList))
	const shuffledKanjiList = computed(() => {
		let list = []
		selectedKanji.similar_kanji.forEach(sk => list.push(sk))
		list.push(selectedKanji)
		shuffle(list)
		return list
	})

	function shuffle(array) {
		let currentIndex = array.length;

		// While there remain elements to shuffle...
		while (currentIndex != 0) {

			// Pick a remaining element...
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}
	}
	function resetKanjiList() {
		selectedKanji.value = buildLimitedKanjiSet(allKanji, levelLimit)
	}
	function getNextKanjiSet() {
		selectedKanji.value = getRandomKanjiSet(kanjiList)
	}
</script>

<style scoped>
	#stage {
		display: grid;
		grid-template-columns: 200px 1fr;
		height: 100dvh;
	}
	.kanji-characters {
		display: flex;
		gap: 20px;
		padding: 20px;
	}
	.kanji-meanings {
		padding-top: 20px;
		background-color: #51576d;
		box-shadow: 3px 0px 5px #0004;
	}
</style>
