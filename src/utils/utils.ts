interface KanjiList {
	[key: string]: Kanji
}

export interface Kanji {
	character: string;
	level: number;
	document_url: string;
	meaning: string;
	readings: {
		type: string;
		primary: boolean;
		reading: string;
		accepted_answer: boolean;
	};
	visually_similar_subject_ids: number[];
	similar_kanji?: Kanji[]
}

export function buildLimitedKanjiSet(kanjiList: KanjiList, levelLimit = 60): Kanji[] {
	kanjiList = structuredClone(kanjiList)
	//Filter kanji by level, including similar subject id's, then add the similar kanji to a new field on the object
	for(const k of Object.values(kanjiList)) {
		if(k.level > levelLimit){
			continue
		}
		k.visually_similar_subject_ids = k.visually_similar_subject_ids.filter((vssi: number) => {
			const simkan = kanjiList[vssi]
			if(simkan && simkan.level <= levelLimit) {
				return true
			} else {
				return false
			}
		})
		if(k.visually_similar_subject_ids.length <= 0) {
			continue
		}
		k.similar_kanji = k.visually_similar_subject_ids.map((vssi: number) => structuredClone(kanjiList[vssi]))
	}

	//Remove any kanji that have no similar kanji that met the previous level criteria
	let filteredKanji = Array.from(Object.values(kanjiList)).filter(k => k.similar_kanji)
	//If a kanji is already seen as a similar kanji to a previous kanji, remove it from the list as to not do it twice
	const seen = new Set()
	filteredKanji = filteredKanji.filter(k => {
		if(seen.has(k.character)) {
			return false
		} else {
			seen.add(k.character)
			if(!k.similar_kanji) return false;
			k.similar_kanji.forEach(kan => { seen.add(kan.character)})
			return true
		}
	})

	return filteredKanji
}

//Get random kanji set and remove it from the original array
export function getRandomKanjiSet(kanjiArray: Kanji[], batchSize: number) {
	if(batchSize < 1) throw new Error("Batch size cannot be less than 1.")
	const list = []
	for(let i = 0; i < batchSize; i++) {
		list.push(kanjiArray.splice(Math.floor(Math.random() * kanjiArray.length), 1))
	}
	return list
}

