import { GUI } from 'dat.gui';
import { Scene, Vector3 } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Entity } from './entity';
import { GuiParams } from './game';

export class TerrainSky extends Entity {
    private sky = new Sky();

    constructor(scene: Scene, gui: GUI, guiParams: GuiParams) {
        super();

        this.init(scene, gui, guiParams);
    }

    public update(_delta: number): void {
        // do nothing
    }

    private init(scene: Scene, gui: GUI, guiParams: GuiParams): void {
        this.sky.scale.setScalar(10000);
        scene.add(this.sky);

        guiParams.sky = {
            turbidity: 10.0,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
        };
        
        guiParams.sun = {
            inclination: 0.49,
            azimuth: 0.25,
            exposure: 0.5,
        };

        const onShaderChange = () => {
            for (let k in guiParams.sky) {
                this.sky.material.uniforms[k].value = (guiParams.sky as any)[k];
            }
            
            for (let k in guiParams.general) {
                this.sky.material.uniforms[k].value = (guiParams.general as any)[k];
            }
        };
      
        const onSunChange = () => {
            var theta = Math.PI * (guiParams.sun.inclination - 0.5);
            var phi = 2 * Math.PI * (guiParams.sun.azimuth - 0.5);
      
            const sunPosition = new Vector3();
            sunPosition.x = Math.cos(phi);
            sunPosition.y = Math.sin(phi) * Math.sin(theta);
            sunPosition.z = Math.sin(phi) * Math.cos(theta);
      
            this.sky.material.uniforms['sunPosition'].value.copy(sunPosition);
        };

        const skyRollup = gui.addFolder('Sky');
        skyRollup.add(guiParams.sky, 'turbidity', 0.1, 30.0).onChange(onShaderChange);
        skyRollup.add(guiParams.sky, 'rayleigh', 0.1, 4.0).onChange(onShaderChange);
        skyRollup.add(guiParams.sky, 'mieCoefficient', 0.0001, 0.1).onChange(onShaderChange);
        skyRollup.add(guiParams.sky, 'mieDirectionalG', 0.0, 1.0).onChange(onShaderChange);
        
        const sunRollup = gui.addFolder('Sun');
        sunRollup.add(guiParams.sun, 'inclination', 0.0, 1.0).onChange(onSunChange);
        sunRollup.add(guiParams.sun, 'azimuth', 0.0, 1.0).onChange(onSunChange);
        sunRollup.add(guiParams.sun, 'exposure', 0.0, 1.0).onChange(onSunChange);

        onShaderChange();
        onSunChange();
    }
}