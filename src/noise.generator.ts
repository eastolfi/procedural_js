// @ts-ignore
import { noise as perlin } from '@chriscourses/perlin-noise';
import { makeNoise2D } from 'open-simplex-noise';

import { GUINoiseParams } from './game';
import { HeightGenerator } from './height.generator';


interface NoiseWrapper {
    noise2D(x: number, y: number): number;
}


class PerlinWrapper implements NoiseWrapper {
    constructor() { }

    public noise2D(x: number, y: number): number {
        return perlin(x, y) * 2.0 - 1.0;
    }
}

class OpenSimplexWrapper implements NoiseWrapper {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    public noise2D(x: number, y: number): number {
        return makeNoise2D(this.seed)(x, y);
    }
}

export class NoiseGenerator extends HeightGenerator {
    private params: GUINoiseParams;
    private noise: { simplex: OpenSimplexWrapper, perlin: PerlinWrapper };

    constructor(params: GUINoiseParams) {
        super();

        this.params = params;

        this.init();
    }

    private getNoiseByType(type: string): NoiseWrapper {
        if (type === 'simplex') {
            return this.noise.simplex;
        } else if (type === 'perlin') {
            return this.noise.perlin;
        }
    }

    public get(x: number, y: number): number {
        const xs = x / this.params.scale;
        const ys = y / this.params.scale;
        const noiseFunc = this.getNoiseByType(this.params.noiseType);
        
        let amplitude = 1.0;
        let frequency = 1.0;
        let normalization = 0;
        let total = 0;
        
        for (let o = 0; o < this.params.octaves; o++) {
            const noiseValue = noiseFunc.noise2D(
                xs * frequency, ys * frequency) * 0.5 + 0.5;
            total += noiseValue * amplitude;
            normalization += amplitude;
            amplitude *= this.params.persistence;
            frequency *= this.params.lacunarity;
        }

        total /= normalization;

        return Math.pow(total, this.params.exponentiation) * this.params.height;
    }

    private init(): void {
        this.noise = {
            simplex: new OpenSimplexWrapper(this.params.seed),
            perlin: new PerlinWrapper()
        }
    }
}