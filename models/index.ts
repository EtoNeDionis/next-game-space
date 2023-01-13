interface IGameSettings {
	canvas?: HTMLCanvasElement
	ctx?: CanvasRenderingContext2D | null
	score: number
	enemiesKilled: number
}

export const gameSettings: IGameSettings = {
	score: 0,
	enemiesKilled: 0
}

export interface IPosition {
	x: number;
	y: number;
}

export interface IV {
	x: number;
	y: number;
}