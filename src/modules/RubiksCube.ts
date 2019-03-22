/* tslint:disable:no-unused-variable */
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';


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

    // private _xCube : THREE.Mesh;
    // private _nagxCube : THREE.Mesh;
    
    // private _yCube : THREE.Mesh;
    // private _nagyCube : THREE.Mesh;

    // private _zCube : THREE.Mesh;
    // private _nagzCube : THREE.Mesh;
    
    // private radPerFrame = Math.PI / 120;

    constructor(view: HTMLElement) {

        this.view = view;

        this.rubiksCube = new THREE.Group();


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

                    if (x === 1 && y === 0  && z === 0) {
                        // this._xCube = cube;
                    } else if (x === -1 && y === 0  && z === 0) {
                        // this._nagxCube = cube;
                    } else if (x === 0 && y === 1  && z === 0) {
                        // this._yCube = cube;
                    } else if (x === 0 && y === -1  && z === 0) {
                        // this._nagyCube = cube;
                    } else if (x === 0 && y === 0  && z === 1) {
                        // this._zCube = cube;
                    } else if (x === 1 && y === 0  && z === -1) {
                        // this._nagzCube = cube;
                    } 
                }
            }
        }
        // tslint:disable-next-line:no-console
        console.log(this.rubiksCube.children.length);

        this.scene.add(this.rubiksCube);
        
        this.scene.add(new THREE.AxesHelper( 5 ));

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

    // tslint:disable-next-line:no-empty
    public rotateFront() : void {
        const objects: THREE.Mesh[] = [];
        this.rubiksCube.traverse((object:THREE.Object3D)=>{
            const mesh = (object as THREE.Mesh);
            if (mesh.position.z > 0) {
                objects.push(mesh);
            }
        });
        this._anmate(500, (ratio:number) => {
            for (const object of objects) {
                this.rotateZ(object, ratio * PI_2);
            }
            this._render3D();
        });
    }

    // tslint:disable-next-line:no-empty
    public rotateUp() : void {
        const objects: THREE.Mesh[] = [];
        this.rubiksCube.traverse((object:THREE.Object3D)=>{
            const mesh = (object as THREE.Mesh);
            if (mesh.position.y > 0) {
                objects.push(mesh);
            }
        });
        this._anmate(500, (ratio:number) => {
            for (const object of objects) {
                this.rotateY(object, ratio * PI_2);
            }
            this._render3D();
        });
        // this._animateRotate(objects, 0, this._rotateY);
    }

    // tslint:disable-next-line:no-empty
    public rotateLeft() : void {
        const objects: THREE.Mesh[] = [];
        this.rubiksCube.traverse((object:THREE.Object3D)=>{
            const mesh = (object as THREE.Mesh);
            if (mesh.position.x < 0) {
                objects.push(mesh);
            }
        });
        this._anmate(500, (ratio:number) => {
            for (const object of objects) {
                this.rotateX(object, -ratio * PI_2);
            }
            this._render3D();
        });
    }

    // tslint:disable-next-line:no-empty
    public rotateRight() : void {
        const objects: THREE.Mesh[] = [];
        this.rubiksCube.traverse((object:THREE.Object3D)=>{
            const mesh = (object as THREE.Mesh);
            if (mesh.position.x > 0) {
                objects.push(mesh);
            }
        });
        this._anmate(1000, (ratio:number) => {
            for (const object of objects) {
                this.rotateX(object, ratio * PI_2);
            }
            this._render3D();
        });
    }

    private rotateX(object:THREE.Mesh, rad:number) {
        const y = object.position.y;
        const z = object.position.z;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad );
        object.quaternion.premultiply( quaternion );
        object.position.y = Math.cos(rad)*y-Math.sin(rad)*z;
        object.position.z = Math.cos(rad)*z+Math.sin(rad)*y;
    }

    private rotateY(object:THREE.Mesh, rad:number) {
        const x = object.position.x;
        const z = object.position.z;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rad);
        object.quaternion.premultiply( quaternion );
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * z;
        object.position.z = Math.cos(rad) * z + Math.sin(rad) * x;
    }

    private rotateZ(object:THREE.Mesh, rad:number) {
        const x = object.position.x;
        const y = object.position.y;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad );
        object.quaternion.premultiply( quaternion );
        object.position.x = Math.cos(rad) * x - Math.sin(rad) * y;
        object.position.y = Math.cos(rad) * y + Math.sin(rad) * x;
    }

    // PI / 2
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
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0xF76102)}),
                // red
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0x920702)}),
                // yellow
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0xFFFC05)}), 
                // white
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0xFFFFFF)}),
                // green
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0x179505)}),
                // blue
                new THREE.MeshPhysicalMaterial({map: this._colorTexture(0x1A11FF)})
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
