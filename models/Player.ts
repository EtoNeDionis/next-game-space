import { StaticImageData } from "next/image";
import { gameSettings, IPosition, IV } from ".";
import imgPlayer from "../public/player.png"
import { Input } from "./Input";
import { Particle } from "./Particle";
import { PlayerProjectile } from "./Projectiles/PlayerProjectile";

export class Player {
    position: IPosition
    v: IV
    width: number
    height: number
    image: HTMLImageElement

    rotateDeg: number

    shootsPerSecond: number
    isShootingAvailable: boolean
    reloadTimer: number

    projectiles: PlayerProjectile[]
    shootSound: HTMLAudioElement

    particles: Particle[]
    health: number
    markedForDeletion: boolean

    constructor() {
        this.position = { x: 0, y: 0 }
        this.v = { x: 0, y: 0 }


        const image = new Image()
        const scope = window.innerWidth * .0001

        image.src = imgPlayer.src
        image.height = imgPlayer.height * scope
        image.width = imgPlayer.width * scope

        this.image = image
        this.width = this.image.width
        this.height = this.image.height

        const shootAudio = new Audio()
        shootAudio.src = "/sounds/playerShoot.wav"
        this.shootSound = shootAudio

        this.position = {
            x: (gameSettings.canvas!.width - this.width) / 2,
            y: gameSettings.canvas!.height - this.height,
        }

        this.rotateDeg = 0

        this.particles = []
        this.projectiles = []

        this.shootsPerSecond = 6;
        this.isShootingAvailable = true;
        this.reloadTimer = 0
        this.health = 3
        this.markedForDeletion = false
    }

    update(keys: string[]) {
        this.particles = this.particles.filter((p) => {
            if (p.opacity > 0) p.update();
            return p.opacity >= 0;
        });

        this.position.x += this.v.x;
        this.position.y += this.v.y;

        this.v = { x: 0, y: 0 };

        keys.forEach((key) => {
            if ((key === "KeyD" || key === "ArrowRight") && this.position.x + this.width <= gameSettings.canvas!.width) {
                this.v.x = 1;
                this.rotateDeg = (30 * Math.PI) / 180;
            } else if ((key === "KeyA" || key === "ArrowLeft") && this.position.x >= 0) {
                this.v.x = -1;
                this.rotateDeg = (-30 * Math.PI) / 180;
            } else if ((key === "KeyW" || key === "ArrowUp") && this.position.y >= 0) {
                this.v.y = -0.5;
            } else if (
                (key === "KeyS" || key === "ArrowDown") &&
                this.position.y + this.height <= gameSettings.canvas!.height
            ) {
                this.v.y = 0.5;
            } else if (key === "Space") {
                 this.reloadTimer++

                if (this.isShootingAvailable) {

                    this.shoot();
                    this.isShootingAvailable = false;

                    setTimeout(() => {
                        this.isShootingAvailable = true;
                    }, (1 / this.shootsPerSecond) * 1000);
                }
            }
        });
        if (keys.indexOf("KeyA") === -1 && keys.indexOf("KeyD") === -1 &&
            keys.indexOf("ArrowLeft") === -1 && keys.indexOf("ArrowRight") === -1) {
            this.rotateDeg = 0;
        }

        this.projectiles.forEach((proj, index) => {
            proj.update();
        });

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion)
    }

    draw() {
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        ctx.save();

        ctx.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );

        ctx.rotate(this.rotateDeg);
        ctx.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        );

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.restore();

        this.projectiles.forEach((proj, index) => {
            if (proj.markedForDeletion) this.projectiles.splice(index, 1);
            proj.draw();
        });

        this.particles.forEach((p) => p.draw());
    }

    shoot() {
        const newSound = new Audio()
        newSound.src = this.shootSound.src
        newSound.volume = .01
        newSound.play()
        this.projectiles.push(
            new PlayerProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y
                }, v: {
                    x: 0,
                    y: -3
                }
            }
            )
        );
    }

    takeDamage() {
        this.health--
        if (this.health === 0) {
            const deathAudio = new Audio()
            deathAudio.src = "/sounds/playerDie.wav"
            deathAudio.volume = .1
            deathAudio.play()
        }
    }
}