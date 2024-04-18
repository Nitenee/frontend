<template>
	<div>
		
	</div>
</template>

<script setup lang='ts'>
	import { inject } from 'vue'
	import { buildLimitedKanjiSet, getRandomKanjiSet } from '@/utils/utils'

	const kanji = inject('kanji')
	const limitedKanji = buildLimitedKanjiSet(kanji, 14)
	const selectedKanji = getRandomKanjiSet(limitedKanji)

	console.log(selectedKanji)

</script>

<style scoped>
	
</style>
