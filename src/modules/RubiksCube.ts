/* tslint:disable:no-unused-variable */
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';


const THRESHOLD = 0.5;
const PI_2 = Math.PI / 2;
// const PI_4 = Math.PI / 4;
// const SQRT_2 = Math.sqrt(2);

export class RubiksCube {
    public view: HTMLElement;

    public scene = new THREE.Scene();
  
    public _renderer: THREE.WebGLRenderer;
  
    public _camera: THREE.PerspectiveCamera;

    public _orbitControls: OrbitControls;
  
    
    public rubiksCube: THREE.Group; 
    
    private _materials: THREE.Material[];

    private _didFinish = true;

    private _operationQueue = ([] as string[]);

    private _isRunning = false;

    constructor(view: HTMLElement) {

        this.view = view;

        this.rubiksCube = new THREE.Group();
        this._generateRubiksCube();

        this.scene.add(this.rubiksCube);

        // 2 light to show all faces
        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, -1, -1);
        dirLight.position.multiplyScalar(30);
        this.scene.add(dirLight);
    
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
        dirLight1.color.setHSL(0.1, 1, 0.95);
        dirLight1.position.set(1, 1, 1);
        dirLight1.position.multiplyScalar(30);
        this.scene.add(dirLight1);
    
        this.view.appendChild(this.renderer.domElement);
    
        window.addEventListener('resize', (target) => {
            this.renderer.setSize(this.view.offsetWidth, this.view.offsetHeight);
            this.camera.aspect = this.view.offsetWidth / this.view.offsetHeight;
            this.camera.updateProjectionMatrix();
            this._render3D();
        });
        this.orbitControls.addEventListener('change', this._render3D.bind(this));

        this._render3D();
    }

    public reset() {
        // running state can't reset. 
        if (this._isRunning) {
            return;
        }
        this._generateRubiksCube();
        this._render3D();
    }


    public rotateFront(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value)=>{
            // get all front block
            return value.position.z > THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisZ(value, coefficient * ratio * PI_2);
        });
    }

    public rotateBack(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
            // get all back block
            return value.position.z < -THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisZ(value, coefficient * ratio * PI_2 * times);
        });
    }

    public rotateUp(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
            // get all up block
            return value.position.y > THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisY(value, coefficient * ratio * PI_2);
        });
    }

    public rotateDown(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value)=>{
            // get all down block
            return value.position.y < -THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisY(value, coefficient * ratio * PI_2);
        });
    }

    public rotateLeft(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
             // get all left block
            return value.position.x < -THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisX(value, coefficient * ratio * PI_2);
        });
    }

    public rotateRight(clockwize: boolean, times: number = 1) : void {
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value)=>{
             // get right down block
            return value.position.x > THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisX(value, coefficient * ratio * PI_2);
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

        const handler = setInterval(()=>{
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
        this.rubiksCube.remove(...this.rubiksCube.children);

        for (let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                for(let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) {
                        continue;
                    }
                    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
                    const cube = new THREE.Mesh( geometry, this.materials );
                    cube.position.set(x, y, z);
                    this.rubiksCube.add(cube);
                }
            }
        }
    }

    // rotation core function by using high level function
    private _rotate(filter:(value:THREE.Object3D)=>boolean, rotation:(value:THREE.Object3D, ratio:number)=>void) {
        // test if current animation do finish;
        if (!this._didFinish) {
            return;
        } 
        // start next animation.
        this._didFinish = false;

        const objects = this.rubiksCube.children.filter(filter);
        this._anmate(500, (ratio:number) => {
            for (const object of objects) {
                rotation(object, ratio);
            }
            this._render3D();
        });
    }

    // rotation around X axis 
    private _rotateAroundAxisX(object:THREE.Object3D, rad:number) {
        const y = object.position.y;
        const z = object.position.z;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
        object.quaternion.premultiply(quaternion);
        object.position.y = Math.cos(rad) * y - Math.sin(rad) * z;
        object.position.z = Math.cos(rad) * z + Math.sin(rad) * y;
    }

    // rotation around Y axis 
    private _rotateAroundAxisY(object:THREE.Object3D, rad:number) {
        const x = object.position.x;
        const z = object.position.z;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3( 0, -1, 0 ), rad);
        object.quaternion.premultiply(quaternion);
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * z;
        object.position.z = Math.cos(rad) * z + Math.sin(rad) * x;
    }

    // rotation around Z axis 
    private _rotateAroundAxisZ(object:THREE.Object3D, rad:number) {
        const x = object.position.x;
        const y = object.position.y;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);
        object.quaternion.premultiply(quaternion);
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * y;
        object.position.y = Math.cos(rad) * y + Math.sin(rad) * x;
    }


    // animate the rotate
    // during : ms 
    private _anmate(during: number | 500, animating: (ratio:number)=>void) {
        requestAnimationFrame((timestamp:number)=>{
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

    private _render3D() {
        this.renderer.render(this.scene, this.camera);
    }


    private _colorTexture(color:number) : THREE.Texture {
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
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }



    // getter & setter
    
    private get materials() : THREE.Material[] {
        if (this._materials == null) {
            this._materials = [
                // orange
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0xF76102), roughness: 0.8}),
                // red
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0x920702), roughness: 0.8}),
                // yellow
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0xFFFC05), roughness: 0.8}), 
                // white
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0xFFFFFF), roughness: 0.8}),
                // green
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0x179505), roughness: 0.8}),
                // blue
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0x1A11FF), roughness: 0.8})
            ];
        }
        return this._materials;
    }


    private get renderer() : THREE.WebGLRenderer {
        if (this._renderer == null) {
            this._renderer = new THREE.WebGLRenderer({ antialias: true });
            this._renderer.setClearColor(0x555555);
            this._renderer.setSize(this.view.offsetWidth, this.view.offsetHeight);
            this._renderer.shadowMap.enabled = true;
            this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this._renderer.setPixelRatio(window.devicePixelRatio);
        }
        return this._renderer;  
    }

    private get camera() : THREE.PerspectiveCamera {
        if (this._camera == null) {
            this._camera = new THREE.PerspectiveCamera(60, this.view.offsetWidth / this.view.offsetHeight, 0.01, 2000);
            this._camera.position.x = 5;
            this._camera.position.z = 10;
            this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        return this._camera;
    }

    private get orbitControls() : OrbitControls {
        if (this._orbitControls == null) {
          // tslint:disable-next-line:no-console
          this._orbitControls = new OrbitControls(this.camera, this.view);
          this._orbitControls.rotateSpeed = 0.7;
          this._orbitControls.dampingFactor = 0.07;
          this._orbitControls.minDistance = 0.3;
          this._orbitControls.maxDistance = Infinity;
          this._orbitControls.enablePan = true; 
          this._orbitControls.enableZoom = true;
          this._orbitControls.enabled = true;
        }
        return this._orbitControls;
    }
}
