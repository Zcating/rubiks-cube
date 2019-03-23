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
    
    public _materials: THREE.Material[];

    public _didFinish = true;

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
        this._generateRubiksCube();
        this._render3D();
    }

    public rotateFront(clockwize: boolean) : void {
        if (this._didFinish) {
            this._didFinish = false;
        } else {
            return;
        }
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value)=>{
            // get all front block
            return value.position.z > THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisZ(value, coefficient * ratio * PI_2);
        });
    }

    public rotateBack(clockwize: boolean) : void {
        if (this._didFinish) {
            this._didFinish = false;
        } else {
            return;
        }
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
            // get all back block
            return value.position.z < -THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisZ(value, coefficient * ratio * PI_2);
        });
    }

    public rotateUp(clockwize: boolean) : void {
        if (this._didFinish) {
            this._didFinish = false;
        } else {
            return;
        }
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
            // get all up block
            return value.position.y > THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisY(value, coefficient * ratio * PI_2);
        });
    }

    public rotateDown(clockwize: boolean) : void {
        if (this._didFinish) {
            this._didFinish = false;
        } else {
            return;
        }
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value)=>{
            // get all down block
            return value.position.y < -THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisY(value, coefficient * ratio * PI_2);
        });
    }

    public rotateLeft(clockwize: boolean) : void {
        if (this._didFinish) {
            this._didFinish = false;
        } else {
            return;
        }
        const coefficient = clockwize ? 1 : -1;
        this._rotate((value)=>{
             // get all left block
            return value.position.x < -THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisX(value, coefficient * ratio * PI_2);
        });
    }

    public rotateRight(clockwize: boolean) : void {
        if (this._didFinish) {
            this._didFinish = false;
        } else {
            return;
        }
        const coefficient = clockwize ? -1 : 1;
        this._rotate((value)=>{
             // get right down block
            return value.position.x > THRESHOLD;
        }, (value, ratio)=>{
            this._rotateAroundAxisX(value, coefficient * ratio * PI_2);
        });
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

    private _polling() {
        const clouse = () => {
            if (!this._didFinish) {
                setTimeout(clouse, 100);
            }
        }
        setTimeout(clouse, 100);
    }

    // rotation core function by using high level function
    private _rotate(filter:(value:THREE.Object3D)=>boolean, rotation:(value:THREE.Object3D, ratio:number)=>void) {
        if (this._didFinish === false) {
            this._polling();
        }
        // start a new thread
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
        quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad );
        object.quaternion.premultiply( quaternion );
        object.position.y = Math.cos(rad)*y-Math.sin(rad)*z;
        object.position.z = Math.cos(rad)*z+Math.sin(rad)*y;
    }

    private _rotateAroundAxisY(object:THREE.Object3D, rad:number) {
        const x = object.position.x;
        const z = object.position.z;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, -1, 0 ), rad);
        object.quaternion.premultiply( quaternion );
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * z;
        object.position.z = Math.cos(rad) * z + Math.sin(rad) * x;
    }

    private _rotateAroundAxisZ(object:THREE.Object3D, rad:number) {
        const x = object.position.x;
        const y = object.position.y;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad );
        object.quaternion.premultiply( quaternion );
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
        // check if diff bigger than during
        const correction = currentTimestamp - startTimestamp >= during ?(startTimestamp + during) : currentTimestamp;

        const diff = correction - previousTimestamp;

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
            const colorString = '#' + color.toString(16);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 256, 256);
            context.rect(20, 20, 216, 216);
            context.lineJoin = 'round';
            context.lineWidth = 10;
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
    
    public get materials() : THREE.Material[] {
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
