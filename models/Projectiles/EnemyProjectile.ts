import { gameSettings, IPosition, IV } from "..";
import { Projectile } from "./Projectile";

export class EnemyProjectile extends Projectile {
    constructor({ position, v, width, height }: { position: IPosition, v: IV, width: number, height: number }) {
        super({ position: position, v: v, width: width, height: height });
    }

    update() {
        const canvas = gameSettings.canvas as HTMLCanvasElement
        this.position.x += this.v.x;
        this.position.y += this.v.y;

        if (this.position.y + this.height > canvas.height) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}