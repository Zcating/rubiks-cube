import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import './App.css';

class App extends React.Component {

  public view: HTMLElement;

  public _scene: THREE.Scene;

  public _camera: THREE.PerspectiveCamera;

  public _renderer: THREE.WebGLRenderer;

  public _orbitControls: OrbitControls;

  public _cube: THREE.Mesh;

  public _rubiksCube: THREE.Group; 
  
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
  
  
  public get cube() : THREE.Mesh {
    if (this._cube == null) {
      const geometry = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
      const material = new THREE.MeshPhysicalMaterial( {color: 0xffffff} );
      this._cube = new THREE.Mesh( geometry, material );
    }
    return this._cube;
  }
  

  public get rubiksCube() : THREE.Group {
    if (this._rubiksCube == null) {
      this._rubiksCube = new THREE.Group();

      // 1
      this._rubiksCube.add(this.createCube(1, 0, 0));

      // 2
      this._rubiksCube.add(this.createCube(0, 1, 0));
      
      // 3
      this._rubiksCube.add(this.createCube(0, 0, 1));
      
      // 4
      this._rubiksCube.add(this.createCube(1, 0, 1));
      
      // 5
      this._rubiksCube.add(this.createCube(1, 1, 0));
      
      // 6
      this._rubiksCube.add(this.createCube(0, 1, 1));

      // 7
      this._rubiksCube.add(this.createCube(1, 1, 1));

      
      // 8
      this._rubiksCube.add(this.createCube(-1, 0, 0));
      
      // 9
      this._rubiksCube.add(this.createCube(0, -1, 0));
      
      // 10
      this._rubiksCube.add(this.createCube(0, 0, -1));
      
      // 11
      this._rubiksCube.add(this.createCube(-1, -1, 0));
      
      // 12
      this._rubiksCube.add(this.createCube(0, -1, -1));

      // 13
      this._rubiksCube.add(this.createCube(-1, 0, -1));

      // 14
      this._rubiksCube.add(this.createCube(-1, -1, -1));
      

      // 15
      this._rubiksCube.add(this.createCube(0, 1, -1));

      // 16
      this._rubiksCube.add(this.createCube(0, -1, 1));

      // 17
      this._rubiksCube.add(this.createCube(1, 0, -1));

      // 18
      this._rubiksCube.add(this.createCube(1, -1, 0));
      
      // 19
      this._rubiksCube.add(this.createCube(-1, 0, 1));

      // 20
      this._rubiksCube.add(this.createCube(-1, 1, 0));

      // 21
      this._rubiksCube.add(this.createCube(1, 1, -1));

      // 22
      this._rubiksCube.add(this.createCube(1, -1, 1));

      // 23
      this._rubiksCube.add(this.createCube(-1, 1, 1));

      // 24
      this._rubiksCube.add(this.createCube(-1, -1, 1));
      
      // 25
      this._rubiksCube.add(this.createCube(-1, 1, -1));

      // 26
      this._rubiksCube.add(this.createCube(1, -1, -1));

    }
    return this._rubiksCube;
  }


  public get camera() : THREE.PerspectiveCamera {
    if (this._camera == null) {
      this._camera = new THREE.PerspectiveCamera(60, this.view.offsetWidth / this.view.offsetHeight, 0.01, 20);
      this._camera.position.z = 10;
      this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    return this._camera;
  }
  
  
  public get scene() : THREE.Scene {
    if(this._scene == null) {
      this._scene = new THREE.Scene();
    }
    return this._scene;
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

  public componentDidMount() {
    this.view = document.getElementById('cube-container') as HTMLElement;
    this.scene.add(this.rubiksCube);

    let dirLight = new THREE.DirectionalLight(0xffffff, 0.67);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(0, 0.5, -1);
    dirLight.position.multiplyScalar(30);
    this.scene.add(dirLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 0.67);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, -1, -1);
    dirLight.position.multiplyScalar(30);
    this.scene.add(dirLight);

    this.view.appendChild(this.renderer.domElement);
    this._render3D();

    window.addEventListener('resize', (target) => {
      this.renderer.setSize(this.view.offsetWidth, this.view.offsetHeight);
      this.camera.aspect = this.view.offsetWidth / this.view.offsetHeight;
      this.camera.updateProjectionMatrix();
      this._render3D();
    });
    this.orbitControls.addEventListener('change', this._render3D.bind(this));

    // this.animate();
  }

  public render() {
    return (
      <div className="App">
        <div id="cube-container" className="CubeContainer"/>
      </div>
    );
  }

  private _render3D() {
    this.renderer.render(this.scene, this.camera);
  }

  private createCube(x:number, y:number, z:number) : THREE.Mesh {
    const geometry = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
    const materials = [
      new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xffffff)}), 
      new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xff00ff)})
    ];
    geometry.faces[0].materialIndex = 0;

    for (let index = 1; index < geometry.faces.length; index++) {
      const face = geometry.faces[index];
      face.materialIndex = 1;
    }

    const cube = new THREE.Mesh( geometry, materials );
    cube.position.set(x, y, z);

    return cube;
  }
}

export default App;
