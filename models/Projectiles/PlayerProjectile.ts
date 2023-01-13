import { IPVersion } from "net";
import { gameSettings, IPosition, IV } from "..";
import { Projectile } from "./Projectile";

export class PlayerProjectile extends Projectile {
    position!: IPosition
    v!: IV
    radius!: number
    markedForDeletion!: boolean

    constructor(
        { position, v }
            :
        { position: IPosition, v: IV })
    {
        super({ position: position, v: v, height: 5, width: 5 });
    }

    update() {
        this.position.x += this.v.x
        this.position.y += this.v.y
        if (this.position.y + this.radius < 0) this.markedForDeletion = true
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.strokeStyle = "violet"
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.closePath()
    }
}