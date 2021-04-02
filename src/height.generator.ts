import { Vector2, Vector3 } from 'three';
import { MathUtils } from './math.utils';

export abstract class HeightGenerator {
    public abstract get(x: number, y: number): number | number[];
}

export class BasicHeightGenerator extends HeightGenerator {
    private generator: HeightGenerator;
    private position: Vector2;
    private radius: number[];

    constructor(generator: HeightGenerator, position: Vector2, minRadius: number, maxRadius: number) {
        super();

        this.generator = generator;
        this.position = position;
        this.radius = [minRadius, maxRadius];
    }

    public get(x: number, y: number): number[] {
        const distance: number = this.position.distanceTo(new Vector2(x, y));
        
        let normalization: number = 1.0 - MathUtils.sat((distance - this.radius[0]) / (this.radius[1] - this.radius[0]));
        normalization = normalization * normalization * (3 - 2 * normalization);

        // watch out
        return [this.generator.get(x, y) as number, normalization];
    }
}

export class FlaredCornerHeightGenerator extends HeightGenerator {
    public get(x: number, y: number): number[] {
        if (x == -250 && y == 250) {
            return [128, 1];
            // return new Vector2(128, 1);
        }

        return [0, 1];
    }
}

export class BumpHeightGenerator extends HeightGenerator {
    public get(x: number, y: number): number[] {
        const dist = new Vector2(x, y).distanceTo(new Vector2(0, 0));

        let h = 1.0 - MathUtils.sat(dist / 250.0);
        h = h * h * h * (h * (h * 6 - 15) + 10);

        return [h * 128, 1];
    }
}