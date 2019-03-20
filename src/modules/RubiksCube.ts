import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

export class RubiksCube {
    public view: HTMLElement;

    public scene = new THREE.Scene();
  
    public _renderer: THREE.WebGLRenderer;
  
    public _camera: THREE.PerspectiveCamera;

    public _orbitControls: OrbitControls;
  
    public _cube: THREE.Mesh;
  
    public _rubiksCube: THREE.Group; 
    
    public _materials: THREE.Material[];

    constructor(view: HTMLElement) {

        this.view = view;
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
    
    public get rubiksCube() : THREE.Group {
        if (this._rubiksCube == null) {
            this._rubiksCube = new THREE.Group();

            for (let x = -1; x <= 1; x++) {
                for(let y = -1; y <= 1; y++) {
                    for(let z = -1; z <= 1; z++) {
                        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
                        const cube = new THREE.Mesh( geometry, this.materials );
                        cube.position.set(x, y, z);
                        this._rubiksCube.add(cube);
                    }
                }
            }
        }
        return this._rubiksCube;
    }

    public get renderer() : THREE.WebGLRenderer {
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

    public get camera() : THREE.PerspectiveCamera {
        if (this._camera == null) {
            this._camera = new THREE.PerspectiveCamera(60, this.view.offsetWidth / this.view.offsetHeight, 0.01, 20);
            this._camera.position.z = 10;
            this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        return this._camera;
    }

    public get orbitControls() : OrbitControls {
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
