import * as BABYLON from 'babylonjs';
import {BehaviorSubject} from "rxjs";
import {filter} from "rxjs/operators";

const THRESHOLD = 0.2;
const PI_2 = Math.PI / 2;
// const PI_4 = Math.PI / 4;
// const SQRT_2 = Math.sqrt(2);

export class RubiksCubeViewer {

    scene: BABYLON.Scene;
    engine: BABYLON.Engine;
    camera: BABYLON.ArcRotateCamera;
    light1: BABYLON.HemisphericLight;
    light2: BABYLON.HemisphericLight;
    cubes: BABYLON.Mesh[] = [];


    // didFinish: boolean = false;

    private _multiMaterial?: BABYLON.MultiMaterial;

    private _didFinish = true;

    // private _operationQueueSubject = new BehaviorSubject<string>('');
    private _operationQueue: string[] = [];

    private _isRunning = false;


    private get multiMaterial() : BABYLON.MultiMaterial {
        if (!this._multiMaterial) {
            this._multiMaterial = new BABYLON.MultiMaterial('multi', this.scene);

            this._multiMaterial.subMaterials.push(
                // orange 0xF76102
                new BABYLON.StandardMaterial('orange', this.scene),
                // red 0x920702
                new BABYLON.StandardMaterial('red', this.scene),
                // yellow 0xFFFC05
                new BABYLON.StandardMaterial('yellow', this.scene),
                // white 0xFFFFFF
                new BABYLON.StandardMaterial('white', this.scene),
                // green 0x179505
                new BABYLON.StandardMaterial('green', this.scene),
                // blue 0x1A11FF
                new BABYLON.StandardMaterial('blue', this.scene),
            );
            const subMaterials = this._multiMaterial.subMaterials as BABYLON.StandardMaterial[];
            subMaterials[0]!.diffuseTexture = this.colorTexture(0x179505);
            subMaterials[1]!.diffuseTexture = this.colorTexture(0x1A11FF);
            subMaterials[2]!.diffuseTexture = this.colorTexture(0xF76102);
            subMaterials[3]!.diffuseTexture = this.colorTexture(0x920702);
            subMaterials[4]!.diffuseTexture = this.colorTexture(0xFFFC05);
            subMaterials[5]!.diffuseTexture = this.colorTexture(0xFFFFFF);
        }
        return this._multiMaterial;
    }

    private resizeFn = () => {
        this.engine.resize();
    }

    constructor(element: HTMLElement) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        element.appendChild(canvas);
        this.engine = new BABYLON.Engine(canvas, true, {}, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.useRightHandedSystem = true;
        this.camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), this.scene);
        this.camera.position = new BABYLON.Vector3(4, 4, 4);
        this.camera.lowerRadiusLimit = 4;
        this.camera.upperRadiusLimit = 20;
        this.camera.useBouncingBehavior = false;
        this.camera.attachControl(canvas);
        this.camera.minZ = 0.001;
        this.camera.wheelDeltaPercentage = 0.01;
        this.camera.pinchDeltaPercentage = 0.01;
        this.camera.wheelPrecision = 500;
        this.camera.pinchPrecision = 500;

        this._generateRubiksCube();

        this.light1 = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 0, 1), this.scene);
        this.light2 = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 0, -1), this.scene);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', this.resizeFn);

        // this._operationQueueSubject.pipe(
        //     filter(value => !!value),
        // ).subscribe(value => {
        //
        // })
    }

    destroy() {
        window.removeEventListener('resize', this.resizeFn);
        this.engine.dispose();
        this.scene.dispose();
    }

    public reset() {
        // running state can't reset.
        if (this._isRunning) {
            return;
        }
        this.cubes.forEach(value => {
            value.dispose();
        });
        this.cubes = [];
        this._generateRubiksCube();
    }


    public rotateFront(clockwise: boolean, times: number = 1) : void {
        const coefficient = clockwise ? -1 : 1;
        this._rotate((value) => {
            // get all front block
            return value.position.z > THRESHOLD;
        }, (value, ratio) => {
            RubiksCubeViewer._rotateAroundAxisZ(value, coefficient * ratio * PI_2);
        });
    }

    public rotateBack(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
            // get all back block
            return value.position.z < -THRESHOLD;
        }, (value, ratio)=>{
            RubiksCubeViewer._rotateAroundAxisZ(value, coefficient * ratio * PI_2 * times);
        });
    }

    public rotateUp(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value) => {
            // get all up block
            return value.position.y > THRESHOLD;
        }, (value, ratio) => {
            RubiksCubeViewer._rotateAroundAxisY(value, coefficient * ratio * PI_2);
        });
    }

    public rotateDown(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value) => {
            // get all down block
            return value.position.y < -THRESHOLD;
        }, (value, ratio)=>{
            RubiksCubeViewer._rotateAroundAxisY(value, coefficient * ratio * PI_2);
        });
    }

    public rotateLeft(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
             // get all left block
            return value.position.x < -THRESHOLD;
        }, (value, ratio)=>{
            RubiksCubeViewer._rotateAroundAxisX(value, coefficient * ratio * PI_2);
        });
    }

    public rotateRight(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value) => {
            // get right down block
            return value.position.x > THRESHOLD;
        }, (value, ratio) => {
            RubiksCubeViewer._rotateAroundAxisX(value, coefficient * ratio * PI_2);
        });
    }


    /**
     * operate
     */
    /**
     * startOperationQueue
     */
    public startAOperationQueue(operationQueue:string[]) {
        if (this._isRunning) {
            return;
        }
        this._operationQueue = operationQueue;
        this.doingOperation();
    }

    public operate(operationChar: string) {
        if (operationChar === null) {
            return;
        }
        // this._operationQueueSubject.next(operationChar);
        this._operationQueue.push(operationChar);
        this.doingOperation();
    }

    /**
     * doingOperation
     */
    public doingOperation() {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;

        const handler = setInterval(() => {
            const operationChar = this._operationQueue[0];
            if(operationChar === undefined) {
                clearInterval(handler);
                this._isRunning = false;
                return;
            }
            switch (operationChar) {
                case 'R':
                    this.rotateRight(true);
                    break;
                case 'R2':
                    this.rotateRight(true, 2);
                    break;
                case 'R\'':
                    this.rotateRight(false);
                    break;
                case 'R\'2':
                    this.rotateRight(false, 2);
                    break;
                case 'L':
                    this.rotateLeft(true);
                    break;
                case 'L2':
                    this.rotateLeft(true, 2);
                    break;
                case 'L\'':
                    this.rotateLeft(false);
                    break;
                case 'L\'2':
                    this.rotateLeft(false, 2);
                    break;
                case 'U':
                    this.rotateUp(true);
                    break;
                case 'U2':
                    this.rotateUp(true);
                    break;
                case 'U\'':
                    this.rotateUp(false);
                    break;
                case 'U\'2':
                    this.rotateUp(false, 2);
                    break;
                case 'F':
                    this.rotateFront(true);
                    break;
                case 'F2':
                    this.rotateFront(true, 2);
                    break;
                case 'F\'':
                    this.rotateFront(false);
                    break;
                case 'F\'2':
                    this.rotateFront(false, 2);
                    break;
                case 'D':
                    this.rotateDown(true);
                    break;
                case 'D2':
                    this.rotateDown(true, 2);
                    break;
                case 'D\'':
                    this.rotateDown(false);
                    break;
                case 'D\'2':
                    this.rotateDown(false, 2);
                    break;
                case 'B':
                    this.rotateBack(true);
                    break;
                case 'B2':
                    this.rotateBack(true, 2);
                    break;
                case 'B\'':
                    this.rotateBack(false);
                    break;
                case 'B\'2':
                    this.rotateBack(false, 2);
                    break;
                default:
                    break;
            }
            this._operationQueue.splice(0, 1);
        }, 800);
    }

    // private
    private _generateRubiksCube() {
        for (let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                for(let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) {
                        continue;
                    }
                    const count = x + 3 + y + 3 + z + 3;
                    const box = BABYLON.Mesh.CreateBox(`cube${count}`, 1, this.scene);
                    box.material = this.multiMaterial;
                    box.subMeshes = [];
                    const verticesCount = box.getTotalVertices();
                    box.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, box));
                    box.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, box));
                    box.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, box));
                    box.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, box));
                    box.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, box));
                    box.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, box));
                    box.position.set(x, y, z);
                    this.cubes.push(box);
                }
            }
        }
    }


    private colorTexture(color:number) : BABYLON.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (context != null) {
            // first use black draw into the background
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 256, 256);
            context.rect(20, 20, 216, 216);
            context.lineJoin = 'round';
            context.lineWidth = 10;

            // then use the color draw into the background
            const colorString = '#' + color.toString(16);
            context.fillStyle = colorString;
            context.strokeStyle = colorString;
            context.stroke();
            context.fill();
        }
        return new BABYLON.Texture(canvas.toDataURL(), this.scene);
    }

    // rotation core function by using high level function
    private _rotate(filter:(value: BABYLON.Mesh) => boolean, rotation:(value: BABYLON.Mesh, ratio:number)=>void) {
        // test if current animation do finish;
        if (!this._didFinish) {
            return;
        }
        // start next animation.
        this._didFinish = false;

        const objects = this.cubes.filter(filter);
        this._animate(500, (ratio:number) => {
            for (const object of objects) {
                rotation(object, ratio);
            }
        });
    }


    // animate the rotate
    // during : ms
    private _animate(during: number = 500, animating: (ratio:number)=>void) {
        requestAnimationFrame((timestamp:number) => {
            this._animationCore(during, timestamp, timestamp, timestamp, animating);
        });
    }

    // the animate core function
    private _animationCore(during:number, startTimestamp:number, previousTimestamp:number,currentTimestamp:number, animating: (ratio:number)=>void) {
        // check if diff bigger than during, and correct the timestamp
        const correction = currentTimestamp - startTimestamp >= during ?(startTimestamp + during) : currentTimestamp;

        // get the diff of contiguous frames
        const diff = correction - previousTimestamp;

        // run the animating clouse
        animating(diff / during);

        // run animation frame
        const handler = requestAnimationFrame((timestamp:number) => {
            this._animationCore(during, startTimestamp, currentTimestamp, timestamp, animating);
        });

        // diff is current timestamp - start timestamp
        // check if diff bigger than during
        if (currentTimestamp - startTimestamp >= during) {
            cancelAnimationFrame(handler);
            this._didFinish = true;
        }
    }

    // rotation around X axis
    private static _rotateAroundAxisX(object: BABYLON.Mesh, rad:number) {
        const y = object.position.y;
        const z = object.position.z;
        object.rotate(BABYLON.Axis.X, rad, BABYLON.Space.WORLD);
        object.position.y = Math.cos(rad) * y - Math.sin(rad) * z;
        object.position.z = Math.cos(rad) * z + Math.sin(rad) * y;
    }

    // rotation around Y axis
    private static _rotateAroundAxisY(object: BABYLON.Mesh, rad:number) {
        const x = object.position.x;
        const z = object.position.z;
        object.rotate(BABYLON.Axis.Y, -rad, BABYLON.Space.WORLD);
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * z;
        object.position.z = Math.cos(rad) * z + Math.sin(rad) * x;
    }

    // rotation around Z axis
    private static _rotateAroundAxisZ(object: BABYLON.Mesh, rad:number) {
        const x = object.position.x;
        const y = object.position.y;
        object.rotate(BABYLON.Axis.Z, rad, BABYLON.Space.WORLD);
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * y;
        object.position.y = Math.cos(rad) * y + Math.sin(rad) * x;
    }
}
