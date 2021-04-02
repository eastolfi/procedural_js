import { Texture, TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Game } from './game.base';
import { TerrainSky } from './terrain.sky';
import { TerrainChunkManager } from './terrain.chunk.manager';
import { GUI } from 'dat.gui';

export interface GUINoiseParams {
    octaves: number;
    persistence: number;
    lacunarity: number;
    exponentiation: number;
    height: number;
    scale: number;
    noiseType: string;
    seed: number;
}

export interface GUIHeightmapParams {
    height: number;
}

export interface GuiParams {
    general: {}

    terrain?: {
        wireframe: boolean
    }

    sky?: {
        turbidity: number,
        rayleigh: number,
        mieCoefficient: number,
        mieDirectionalG: number,
    }
    
    sun?: {
        inclination: number,
        azimuth: number,
        exposure: number,
    }

    noise?: GUINoiseParams;

    heightmap?: GUIHeightmapParams;
}

export class ProceduralTerrain_Demo extends Game {
    private gui: GUI;
    private controls: OrbitControls;
    private guiParams: GuiParams;

    constructor() {
        super();
    }

    // WATCH OUT - gets called before constructor ends
    initialize() {
        this.guiParams = { general: {} };
        this.gui = new GUI();

        this.createControls();
        this.createGUI();

        this.entities['terrain'] = new TerrainChunkManager(
            this.graphics.scene,
            this.gui,
            this.guiParams
        );

        this.entities['sky'] = new TerrainSky(
            this.graphics.scene,
            this.gui,
            this.guiParams,
        );

        this.loadBackground();
    }
    
    public step(_timeInSeconds: number): void {
        //
    }

    private createGUI(): void {
        
    
        // this.gui.addFolder('General');
        this.gui.close();
      }
    
    private createControls(): void {
        const controls = new OrbitControls(this.graphics.camera, this.graphics.threejs.domElement);

        controls.target.set(0, 50, 0);
        controls.object.position.set(475, 345, 900);
        controls.update();

        this.controls = controls;
    }
    
    private loadBackground(): void {
        const loader = new TextureLoader();
    
        loader.load('./resources/heightmap-simondev.jpg', (result: Texture) => {
            (this.entities['terrain'] as TerrainChunkManager).setHeightmap(result.image as HTMLImageElement);
        });
    }
}