export class Input {
    keys: string[];

    constructor() {
        this.keys = [];
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.repeat) return;
            console.log(e.code)
            if (
                (
                    e.code === "KeyR" ||
                    e.code === "KeyW" ||
                    e.code === "KeyS" ||
                    e.code === "KeyA" ||
                    e.code === "KeyD" ||
                    e.code === "Space" ||
                    e.code === "ArrowUp" ||
                    e.code === "ArrowLeft" ||
                    e.code === "ArrowRight" ||
                    e.code === "ArrowDown" 
                    ) &&
                this.keys.indexOf(e.code) === -1
            ) {
                this.keys.push(e.code);
            }
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if (this.keys.includes(e.code)) {
                this.keys.splice(this.keys.indexOf(e.code), 1);
            }
        });
    }
}