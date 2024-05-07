export type ApiRequest = KanjiBatchRequest;

export interface KanjiBatchRequest {
	type: "KanjiBatchRequest";
	data: {
		user_id: string;
		group_count: number;
		max_level: number;
		min_level: number;
		min_group_size: number;
	}
}

export interface ServerKanji {
	[key: string]: Kanji
}

export interface Kanji {
	character: string;
	level: number;
	document_url: string;
	meaning: string;
	readings: string;
	visually_similar_subject_ids: number[];
}

export interface NDropEvent {
	goingToCharacter: string;
	comingFromCharacter: string;
	oldMeaning: string;
	newMeaning: string;
}

export interface CharacterInfo {
	kanji: string;
	correctMeaning: string; 
	attachedMeaning: string;
	incorrect: boolean | null;
}
