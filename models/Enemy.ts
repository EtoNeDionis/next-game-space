import { gameSettings, IPosition, IV } from ".";
import imgEnemy from "../public/enemy.png"
import { Player } from "./Player";

export class Enemy {
    position: IPosition;
    width: number;
    height: number;
    image: HTMLImageElement;

    player: Player;
    markedForDeletion: boolean;

    constructor(position: IPosition, player: Player) {
        this.position = { x: 0, y: 0 };

        this.image = new Image();
        this.image.src = imgEnemy.src;
        this.image.height = imgEnemy.height
        this.image.width = imgEnemy.width

        const aspectRatio = 1;
        this.width = this.image.width * aspectRatio;
        this.height = this.image.height * aspectRatio;
        this.position = position;

        this.player = player;

        this.markedForDeletion = false;
    }

    update({ v }: { v: IV }) {
        this.position.x += v.x;
        this.position.y += v.y;

        if (this.markedForDeletion) {
            const dieAudio = new Audio()
            dieAudio.src = "/sounds/enemyDie.wav"
            dieAudio.volume = .008
            dieAudio.play()
        }
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    shoot() {

    }
}