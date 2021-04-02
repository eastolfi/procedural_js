  
import { WebGLRenderer, PerspectiveCamera, Scene, Color, DirectionalLight } from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL';
import Stats from 'three/examples/jsm/libs/stats.module';

import { Game } from './game.base';

interface Pixel {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export class GraphicsUtils {
    public static getImageData(image: HTMLImageElement): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        return context.getImageData(0, 0, image.width, image.height);
    }

    public getPixel(imageData: ImageData, x: number, y: number): Pixel {
        const position = (x + imageData.width * y) * 4;
        const data = imageData.data;

        return {
            r: data[position],
            g: data[position + 1],
            b: data[position + 2],
            a: data[position + 3]
        };
    }
}

export class Graphics {
    private _threejs: WebGLRenderer;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private stats = Stats();

    constructor() { }

    get threejs(): WebGLRenderer {
        return this._threejs;
    }

    get scene(): Scene {
        return this._scene;
    }

    get camera(): PerspectiveCamera {
        return this._camera;
    }

    public init(): boolean {
        if (!WEBGL.isWebGL2Available()) {
            return false;
        }

        this._threejs = new WebGLRenderer({
            antialias: true
        });
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById('three_container');
        container.appendChild(this._threejs.domElement);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 0.1;
        const far = 10000.0;
        this._camera = new PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(75, 20, 0);

        this._scene = new Scene();
        this._scene.background = new Color(0xaaaaaa);

        this.createLights();

        window.addEventListener('resize', () => {
            this.onWindowResize();
        }, false);

        return true;
    }

    public render(_delta: number): void {
        this._threejs.render(this._scene, this._camera);
        this.stats.update();
    }

    private createLights(): void {
        let light = new DirectionalLight(0x808080, 1/*, 100*/);

        light.position.set(-100, 100, -100);
        light.target.position.set(0, 0, 0);
        light.castShadow = false;

        this._scene.add(light);
  
        light = new DirectionalLight(0x404040, 1/*, 100*/);

        light.position.set(100, 100, -100);
        light.target.position.set(0, 0, 0);
        light.castShadow = false;

        this._scene.add(light);
    }

    private onWindowResize(): void {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }
}