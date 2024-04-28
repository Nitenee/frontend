export async function apiRequest(requestData: any) {
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
