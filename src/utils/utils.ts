import { ApiRequest } from "./types"

export async function apiRequest(requestData: ApiRequest) {
	const fetchOptions: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestData)
	}
	const request = await fetch('/api', fetchOptions)
	const json = await request.json()
	return json
}

export function shuffleArray(array: Array<any>) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

	return array
}

export async function wanikaniRequest(wanikaniAPIKey: string) {
	const request = await fetch("https://api.wanikani.com/v2/user", {
		headers: {
			"Wanikani-Revision": "20170710",
			"Authorization": `Bearer ${wanikaniAPIKey}`
		}
	})
	const json = await request.json()
	return json
}
