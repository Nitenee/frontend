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
	[key: string]: {
		character: string;
		level: number;
		document_url: string;
		meaning: string;
		readings: string;
		visually_similar_subject_ids: number[];
	}
}

export interface Settings {
	batchSize: number;
	groupKanji: boolean;
	autoCheck: boolean;
	autoContinue: boolean;
	useWanikaniLevel: boolean;
	wanikaniAPIKey: string;
	levelLimit: {
			upper: number;
			lower: number;
		}
}

export interface NDropEvent {
	goingToCharacter: string;
	comingFromCharacter: string;
	oldMeaning: string;
	newMeaning: string;
}
