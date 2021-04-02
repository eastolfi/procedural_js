import { Entity } from './entity';
import { Graphics } from './graphics';

export abstract class Game {
    protected graphics = new Graphics();
    protected entities: { [name: string]: Entity } = {};

    private previousDelta: number = null;
    private minFrameTime = 1.0 / 10.0;

    constructor() {
        this.init();
    }

    protected abstract initialize(): void;
    protected abstract step(delta: number): void;

    private init(): void {
        if (!this.graphics.init()) {
            this.displayError('WebGL2 is not available.');
            return;
        }

        this.initialize();
        this.update();
    }

    private displayError(errorText: string): void {
        const error = document.getElementById('error');
        error.innerText = errorText;
    }

    private update(): void {
        requestAnimationFrame((time: number) => {
            if (this.previousDelta === null) {
                this.previousDelta = time;
            }

            this.render(time - this.previousDelta);
            this.previousDelta = time;
        });
    }

    private render(delta: number): void {
        const timeInSeconds = Math.min(delta * 0.001, this.minFrameTime);

        this.step(timeInSeconds);
        this.stepEntities(timeInSeconds);
        this.graphics.render(timeInSeconds);

        this.update();
    }

    private stepEntities(timeInSeconds: number): void {
        for (let k in this.entities) {
            this.entities[k].update(timeInSeconds);
        }
    }
}