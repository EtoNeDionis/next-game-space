import { IPosition, IV } from "..";

export class Projectile {
    position: IPosition;
    v: IV;
    radius?: number;
    height: number;
    width: number;
    markedForDeletion: boolean;

    constructor(
        { position, v, width, height }
            :
        { position: IPosition, v: IV, width: number, height: number })
    {
        this.position = position;
        this.v = v;
        this.radius = 1;
        this.markedForDeletion = false;
        this.height = height;
        this.width = width;
    }

    update() { }

    draw() { }
}