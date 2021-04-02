import { Color, FrontSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, Vector3 } from 'three';
import { HeightGenerator } from './height.generator';

interface ChunkParams {
    group: Group;
    offset: Vector3;
    scale: number;
    width: number;
    heightGenerators?: HeightGenerator[];
}

export class TerrainChunk {
    private _plane: Mesh;

    private group: Group;
    private offset: Vector3;
    private scale: number;
    private width: number;
    private _heightGenerators: HeightGenerator[];

    constructor(params: ChunkParams) {
        this.group = params.group;
        this.offset = params.offset;
        this.scale = params.scale;
        this.width = params.width;
        this._heightGenerators = params.heightGenerators || [];

        this.init();
    }

    public get plane(): Mesh {
        return this._plane;
    }

    public get heightGenerators(): HeightGenerator[] {
        return this._heightGenerators;
    }

    public rebuild(): void {
        // const offset = this.offset;

        const position = this._plane.geometry.getAttribute('position');
        // console.log(position);

        for (let i = 0; i < position.count; i++) {
            const vertice = new Vector3(position.getX(i), position.getY(i), position.getZ(i));
            this.normalizeVertice(vertice);
            position.setXYZ(i, vertice.x, vertice.y, vertice.z);
        }

        // // Demo
        // if (this._heightGenerators.length > 1 && offset.x === 0 && offset.y === 0) {
        //     const generator = this._heightGenerators[0];
        //     const maxHeight = 16.0;
        //     const green = new Color(0x46b00c);

        //     const faces = this._plane.geometry.getAttribute('faces');
        //     console.log(faces);
        //     // for (let face of this._plane.geometry.)
        // }
    }

    private normalizeVertice(vertice: Vector3): void {
        const heightPairs: number[][] = [];
        let normalization = 0;

        vertice.z = 0;

        for (let generator of this._heightGenerators) {
            heightPairs.push(generator.get(vertice.x + this.offset.x, vertice.y + this.offset.y) as number[]);
            normalization += heightPairs[heightPairs.length - 1][1];
        }

        if (normalization > 0) {
            for (let heightPair of heightPairs) {
                vertice.z += heightPair[0] * heightPair[1] / normalization;
            }
        }
    }

    private init(): void {
        const size = new Vector3(this.width * this.scale, 0, this.width * this.scale);
    
        this._plane = new Mesh(
            new PlaneGeometry(size.x, size.z, 128, 128),
            new MeshStandardMaterial({
                wireframe: false,
                color: new Color(204, 102, 0),
                side: FrontSide,
                vertexColors: true,
            })
        );

        this._plane.position.add(this.offset);
        this._plane.castShadow = false;
        this._plane.receiveShadow = true;
        this.group.add(this._plane);
    
        this.rebuild();
    }
}