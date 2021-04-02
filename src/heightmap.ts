import { Vector2 } from 'three';
import { GUIHeightmapParams } from './game';
import { GraphicsUtils } from './graphics';
import { HeightGenerator } from './height.generator';
import { MathUtils } from './math.utils';

export class Heightmap extends HeightGenerator {
    private params: GUIHeightmapParams;
    private data: ImageData;

    constructor(params: GUIHeightmapParams, image: HTMLImageElement) {
        super();

        this.params = params;
        this.data = GraphicsUtils.getImageData(image);
    }

    public get(x: number, y: number): number {
        const getPixelAsFloat = (x: number, y: number) => {
            const position = (x + this.data.width * y) * 4;
            const data = this.data.data;
            
            return data[position] / 255.0;
        }
      
        // Bilinear filter
        const offset = new Vector2(-250, -250);
        const dimensions = new Vector2(500, 500);
    
        const xf = 1.0 - MathUtils.sat((x - offset.x) / dimensions.x);
        const yf = MathUtils.sat((y - offset.y) / dimensions.y);
        const w = this.data.width - 1;
        const h = this.data.height - 1;
    
        const x1 = Math.floor(xf * w);
        const y1 = Math.floor(yf * h);
        const x2 = MathUtils.clamp(x1 + 1, 0, w);
        const y2 = MathUtils.clamp(y1 + 1, 0, h);
    
        const xp = xf * w - x1;
        const yp = yf * h - y1;
    
        const p11 = getPixelAsFloat(x1, y1);
        const p21 = getPixelAsFloat(x2, y1);
        const p12 = getPixelAsFloat(x1, y2);
        const p22 = getPixelAsFloat(x2, y2);
    
        const px1 = MathUtils.lerp(xp, p11, p21);
        const px2 = MathUtils.lerp(xp, p12, p22);
    
        return MathUtils.lerp(yp, px1, px2) * this.params.height;
    }
}