import { GUI } from 'dat.gui';
import { Group, MeshStandardMaterial, Scene, Vector2, Vector3 } from 'three';

import { Entity } from './entity';
import { GuiParams } from './game';
import { BasicHeightGenerator, BumpHeightGenerator } from './height.generator';
import { Heightmap } from './heightmap';
import { NoiseGenerator } from './noise.generator';

import { TerrainChunk } from './terrain.chunk';

export class Chunk {
    chunk: TerrainChunk;
    edges: string[];
}

export class TerrainChunkManager extends Entity {
    private noise: NoiseGenerator;
    private guiParams: GuiParams;

    private chunkSize = 500;
    private group = new Group();
    private chunks: { [key: string]: Chunk } = {};

    constructor(scene: Scene, gui: GUI, guiParams: GuiParams) {
        super();

        this.guiParams = guiParams;

        this.init(scene, gui);
    }

    public update(delta: number) {
        // do nothing
    }

    public setHeightmap(image: HTMLImageElement): void {
        const heightmap = new BasicHeightGenerator(
            new Heightmap(this.guiParams.heightmap, image),
            new Vector2(0, 0),
            250, 300
        )
        for (let k in this.chunks) {
            this.chunks[k].chunk.heightGenerators.unshift(heightmap);
            this.chunks[k].chunk.rebuild();
        }
    }

    private init(scene: Scene, gui: GUI): void {
        this.initNoise(gui);
        this.initTerrain(scene, gui);
    }

    private initNoise(gui: GUI): void {
        this.guiParams.noise = {
            octaves: 10,
            persistence: 0.5,
            lacunarity: 2.0,
            exponentiation: 3.9,
            height: 64,
            scale: 256.0,
            noiseType: 'simplex',
            seed: 1
        };

        const onNoiseChanged = () => {
            for (let k in this.chunks) {
                this.chunks[k].chunk.rebuild();
            }
        };

        const noiseRollup = gui.addFolder('Terrain.Noise');
        noiseRollup.add(this.guiParams.noise, 'noiseType', ['simplex', 'perlin']).onChange(onNoiseChanged);
        noiseRollup.add(this.guiParams.noise, 'scale', 64.0, 1024.0).onChange(onNoiseChanged);
        noiseRollup.add(this.guiParams.noise, 'octaves', 1, 20, 1).onChange(onNoiseChanged);
        noiseRollup.add(this.guiParams.noise, 'persistence', 0.01, 1.0).onChange(onNoiseChanged);
        noiseRollup.add(this.guiParams.noise, 'lacunarity', 0.01, 4.0).onChange(onNoiseChanged);
        noiseRollup.add(this.guiParams.noise, 'exponentiation', 0.1, 10.0).onChange(onNoiseChanged);
        noiseRollup.add(this.guiParams.noise, 'height', 0, 256).onChange(onNoiseChanged);

        this.noise = new NoiseGenerator(this.guiParams.noise);

        this.guiParams.heightmap = {
            height: 16,
        };

        const heightmapRollup = gui.addFolder('Terrain.Heightmap');
        heightmapRollup.add(this.guiParams.heightmap, 'height', 0, 128).onChange(onNoiseChanged);
    }

    private initTerrain(scene: Scene, gui: GUI): void {
        this.guiParams.terrain = {
            wireframe: false
        };

        this.group.rotation.x = -Math.PI / 2;
        scene.add(this.group);

        const terrainRollup = gui.addFolder('Terrain');
        terrainRollup.add(this.guiParams.terrain, 'wireframe').onChange(() => {
            for (let k in this.chunks) {
                (this.chunks[k].chunk.plane.material as MeshStandardMaterial).wireframe = this.guiParams.terrain.wireframe;
            }
        });

        // DEMO
        this.addChunk(0, 0);
        // for (let x = -1; x <= 1; x++) {
        //     for (let z = -1; z <= 1; z++) {
        //         this.addChunk(x, z);
        //     }
        // }
    }

    private addChunk(x: number, z: number): void {
        const offset = new Vector2(x * this.chunkSize, z * this.chunkSize);
        const chunk = new TerrainChunk({
            group: this.group,
            offset: new Vector3(offset.x, offset.y, 0),
            scale: 1,
            width: this.chunkSize,
            heightGenerators: [new BasicHeightGenerator(this.noise, offset, 100000, 100000 + 1)],
            // heightGenerators: [new BumpHeightGenerator()],
        });
    
        const k = this.key(x, z);
        const edges = [];
        for (let xi = -1; xi <= 1; xi++) {
            for (let zi = -1; zi <= 1; zi++) {
                if (xi == 0 || zi == 0) {
                    continue;
                }
                edges.push(this.key(x + xi, z + zi));
            }
        }
    
        this.chunks[k] = {
            chunk: chunk,
            edges: edges
        };
    }

    private key(x: number, z: number): string {
        return `${x}.${z}`;
    }
}