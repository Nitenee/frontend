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

// Function to calculate the slope between two points
function calculateSlope(line: LinePoints): number {
	const { y2, y1, x2, x1 } = line
    return (y2 - y1) / (x2 - x1);
}

// Function to find the equation of a line using point-slope form
function equationOfLine(x1: number, y1: number, slope: number): { slope: number, intercept: number } {
    // Using point-slope form: y - y1 = m * (x - x1)
    // Convert it to slope-intercept form: y = mx + (y1 - m*x1)
    const intercept = y1 - slope * x1;
    return { slope: slope, intercept: intercept };
}

interface LinePoints {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

// Function to find the intersection point of two lines
export function findIntersection(lineA: LinePoints, lineB: LinePoints): { x: number, y: number } {
		const lineASlope = calculateSlope(lineA)
		const lineBSlope = calculateSlope(lineB)
		const lineAEquation = equationOfLine(lineA.x1, lineA.y1, lineASlope)
		const lineBEquation = equationOfLine(lineB.x1, lineB.y1, lineBSlope)
    // Calculate x-coordinate of intersection
    const x = (lineBEquation.intercept - lineAEquation.intercept) / (lineAEquation.slope - lineBEquation.slope);
    // Calculate y-coordinate using the equation of lineB (since it's horizontal)
    const y = lineBEquation.slope * x + lineBEquation.intercept;
    return { x: x, y: y };
}

// Function to calculate the angle between two points
export function calculateAngleBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
	// Calculate vector AB
	const ABx = x2 - x1;
	const ABy = y2 - y1;

	// Calculate angle in radians using arctangent (atan2)
	return Math.atan2(ABy, ABx);
}

export function pointNormal(x: number, y: number) {
    const length = Math.sqrt(x * x + y * y);

    // Check for zero length to prevent division by zero
    if (length === 0) {
        return {x: 0, y: 0} // or you could throw an error, depending on your use case
    }

    return {x: x / length, y: y / length}
}
