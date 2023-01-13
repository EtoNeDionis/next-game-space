import { gameSettings, IPosition, IV } from ".";
import { Enemy } from "./Enemy";
import { Particle } from "./Particle";
import { Player } from "./Player";
import imgEnemy from "../public/enemy.png"

export class EnemyGroup {
    enemies: Enemy[];
    position: IPosition;
    v: IV;
    markedForDeletion: boolean;
    particles: Particle[];
    shootFrame: number;

    constructor(player: Player) {
        this.position = { x: 0, y: 0 };
        this.v = { x: 1, y: 0 };
        this.enemies = [];

        const scope = innerWidth * .0008


        const columns = Math.floor(Math.random() * 2 + 4);
        const rows = Math.floor(Math.random() * 5 + 3);
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.enemies.push(new Enemy({ x: i * imgEnemy.width * scope, y: j * imgEnemy.height * scope }, player));
            }
        }

        this.markedForDeletion = false;

        this.particles = [];
        this.shootFrame = 0;
    }

    update() {
        const canvas = gameSettings.canvas as HTMLCanvasElement
        this.particles = this.particles.filter((p) => {
            if (p.opacity > 0) p.update();
            return p.opacity >= 0;
        });

        if (this.enemies.length === 0) return (this.markedForDeletion = true);
        this.v.y = 0;
        if (
            this.enemies.at(-1)!.position.x + this.enemies[0].width >=
            canvas.width ||
            this.enemies.at(0)!.position.x < 0
        ) {
            this.v.x *= -1;
            this.v.y += 30;
        }

        this.enemies.forEach((e) => {
            e.update({v: this.v});
        });

        this.position = this.enemies[0].position;

        /*
            Deletion
        */
        //  if off screen
        if (this.position.y > canvas.height) this.markedForDeletion = true;

        this.enemies = this.enemies.filter((e) => {
            if (e.markedForDeletion) {
                gameSettings.enemiesKilled++
                gameSettings.score++
            }
            return !e.markedForDeletion;
        });

        this.shootFrame++;
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        this.enemies.forEach((e) => {
            e.draw();
        });
    }
}