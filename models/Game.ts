import { gameSettings } from ".";
import { Enemy } from "./Enemy";
import { EnemyGroup } from "./EnemyGroup";
import { Input } from "./Input";
import { Particle } from "./Particle";
import { Player } from "./Player";
import { EnemyProjectile } from "./Projectiles/EnemyProjectile";

export class Game {
    input: Input
    player: Player
    isGameEnded: boolean
    particles: Particle[]
    enemyGroups: EnemyGroup[]
    enemyProjectiles: EnemyProjectile[]
    frames: number
    level: number

    constructor() {
        this.input = new Input()
        this.player = new Player()

        this.isGameEnded = false
        this.particles = []

        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle({
                position: {
                    x: Math.random() * gameSettings.canvas!.width,
                    y: Math.random() * gameSettings.canvas!.height || 0,
                },
                v: {
                    x: 0,
                    y: .3
                },
                color: "white",
                radius: Math.random() * 2,
                hasOpacity: false
            }))
        }
        this.enemyGroups = []
        this.enemyProjectiles = []

        this.frames = 0
        this.level = 1
    }

    update() {
        if (this.isGameEnded) {
            return;
        }


        this.player.update(this.input.keys)

        if (this.frames % (Math.floor(Math.random() * 500) + 800 - this.level * 20) === 0 || this.enemyGroups.length === 0) {
            this.enemyGroups.push(new EnemyGroup(this.player));
        }

        this.particles.forEach((p, index) => {
            if (p.position.y - p.radius >= gameSettings.canvas!.height) {
                p.position.x = Math.random() * gameSettings.canvas!.width;
                p.position.y = -p.radius;
            }

            if (p.opacity <= 0.1) this.particles.splice(index, 1)
            p.update();
        })

        this.enemyGroups.forEach(e => {
            e.update()
            if (e.shootFrame % Math.floor(Math.random() * 200 + 50) === 0 && e.enemies.length !== 0) {
                const randomEnemy = e.enemies[Math.floor(Math.random() * e.enemies.length)]
                this.enemyProjectiles.push(new EnemyProjectile({
                    position: {
                        x: randomEnemy.position.x + randomEnemy.width / 2,
                        y: randomEnemy.position.y + randomEnemy.height
                    },
                    width: 2,
                    height: 5,
                    v: {
                        x: 0,
                        y: 1
                    }
                }))
            }
        })

        this.enemyProjectiles.forEach(p => p.update())

        //
        // Проверка снарядов
        //
        this.player.projectiles.forEach(p => {
            const originP = {
                x: p.position.x + p.width / 2,
                y: p.position.y + p.height / 2
            }
            this.enemyGroups.forEach(eg => {
                eg.enemies.forEach(e => {
                    if (
                        // x coord
                        originP.x >= e.position.x && originP.x <= e.position.x + e.width
                        &&
                        // y coord 
                        originP.y >= e.position.y && originP.y <= e.position.y + e.height
                    ) {
                        e.markedForDeletion = true
                        p.markedForDeletion = true
                        for (let i = 0; i < 20; i++) {
                            this.particles.push(new Particle({
                                position: {
                                    x: originP.x,
                                    y: originP.y
                                },
                                color: "red",
                                radius: Math.random() * 2,
                                v: {
                                    x: (Math.random() - 0.5) * 2,
                                    y: (Math.random() - 0.5) * 2,
                                },
                                hasOpacity: true
                            }))
                        }
                    }
                })
            })
        })

        
        // enemy hits player
        this.enemyProjectiles.forEach(p => {
            const originP = {
                x: p.position.x + p.width / 2,
                y: p.position.y + p.height / 2
            }
            const player = this.player

            if (
                // x coord
                originP.x >= player.position.x && originP.x <= player.position.x + player.width
                &&
                //y coord
                originP.y >= player.position.y && originP.y <= player.position.y + player.height
            ) {
                for (let i = 0; i < 15; i++) {
                    this.particles.push(new Particle({
                        position: {
                            x: player.position.x + player.width / 2,
                            y: player.position.y + player.height / 2
                        },
                        color: "white",
                        radius: Math.random() * 2,
                        v: {
                            x: (Math.random() - 0.5) * 2,
                            y: (Math.random() - 0.5) * 2,
                        },
                        hasOpacity: true
                    }))
                }
                p.markedForDeletion = true
                this.player.takeDamage()
            }
        })

        // marked for deletion
        if (this.player.health === 0) this.player.markedForDeletion = true
        if (this.player.markedForDeletion) this.isGameEnded = true
        this.enemyProjectiles = this.enemyProjectiles.filter(p => !p.markedForDeletion)
        this.enemyGroups = this.enemyGroups.filter(eg => {
            if (eg.markedForDeletion) {
                gameSettings.score += 5 * this.level / 2
                this.level++;
            }
            else return eg
        })
        this.frames++
    }

    draw() {
        const canvas = gameSettings.canvas as HTMLCanvasElement
        const ctx = gameSettings.ctx as CanvasRenderingContext2D
        if (this.isGameEnded) {
            ctx.save()
            ctx.textAlign = "center"
            ctx.fillStyle = "white"
            ctx.font = "64px white"
            ctx.fillText(`You got: ${gameSettings.score} score`, canvas.width / 2, canvas.height / 2)
            ctx.fillText(`Enemies killed: ${gameSettings.enemiesKilled} score`, canvas.width / 2, canvas.height / 3.5)
            ctx.font = "40px white"
            ctx.fillText("PRESS R TO RESTART", canvas.width / 2, canvas.height / 1.5)
            ctx.restore()
            return;
        } else {
            ctx.save()
            ctx.fillStyle = "white"
            ctx.font = "20px white"
            ctx.fillText(`level: ${this.level}`, 10, 20)
            ctx.fillText(`Enemies Killed: ${gameSettings.enemiesKilled}`, 10, 50)

            ctx.textAlign = "right"
            ctx.fillText(`Health: ${this.player.health}`, canvas.width - 10, 20)
            ctx.fillText(`Score: ${gameSettings.score}`, canvas.width - 10, 50)


            ctx.restore()
        }

        this.player.draw()
        this.particles.forEach(p => p.draw())

        this.enemyGroups.forEach(e => e.draw())
        this.enemyProjectiles.forEach(p => p.draw())
    }
}