import { gameSettings, IPosition, IV } from ".";

export class Particle {
    position: IPosition
    v: IV
    radius: number
    color: string
    opacity: number
    hasOpacity?: boolean

    constructor(
        { position, v, radius, color, hasOpacity }
            :
        { position: IPosition, v: IV, radius: number, color: string, hasOpacity?: boolean }
    ) {
        this.position   = position
        this.v          = v
        this.radius     = radius
        this.color      = color
        this.opacity    = 1
        this.hasOpacity = hasOpacity || false
    }

    update() {
        this.position.x += this.v.x;
        this.position.y += this.v.y;

        if (this.hasOpacity && this.opacity > 0) {
            this.opacity -= 0.01;
        }
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.save()
        if (this.hasOpacity && this.opacity >= 0) {
            ctx.globalAlpha = this.opacity;
        }
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore()
    }
}