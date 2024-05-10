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

interface ComplimentNode {
	compliment: string;
	next: ComplimentNode | null;
	prev: ComplimentNode | null;
}

export class ComplimentQueue {
	head: ComplimentNode | null = null
	tail: ComplimentNode | null = null
	length = 0
	maxLength: number;

	constructor(maxLength: number) {
		this.maxLength = maxLength
	}
	
	push(inCompliment: string): string | null {
		const newTail = {
			compliment: inCompliment,
			next: this.tail || null,
			prev: null
		}
		if(!this.head) {
			this.head = newTail
		}
		if(this.tail) {
			this.tail.prev = newTail
		}
		this.tail = newTail

		//If we've reached maxLength, pop off head and return its value
		if(this.length < this.maxLength) {
			this.length++
			return null
		} else {
			const oldHead = this.head
			this.head = this.head!.prev
			this.head!.next = null

			return oldHead!.compliment
		}
	}
}
