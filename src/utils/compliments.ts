import { ComplimentQueue } from '@/utils/types'

const complimentQueueMaxLength = 5
const complimentQueue = new ComplimentQueue(complimentQueueMaxLength)
const complimentPool = [
	"ナイス！",
	"グッドジョブ！",
	"いいね！",
	"レッツゴー！",
	"ファイティング！",
	"オッケーオッケー！",
	"よっしゃー！",
]

//Shouldn't happen, but just in case
if(complimentQueueMaxLength >= complimentPool.length){
	throw new Error("complimentQueueMaxLength cannot be greater than or equal to complimentPool's length")
}

export function getCompliment(): string {
	const randomIndex = Math.floor(Math.random() * complimentPool.length)
	const randomCompliment = complimentPool.splice(randomIndex, 1)[0]
	console.log('randomIndex:', randomIndex, 'complimentPool', complimentPool, 'randomCompliment', randomCompliment)
	
	const poppedCompliment = complimentQueue.push(randomCompliment)
	if(poppedCompliment) {
		complimentPool.push(poppedCompliment)
	}


	console.log(`Current head: `, complimentQueue.head)
	return randomCompliment
}

