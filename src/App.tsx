import * as React from 'react';
import * as THREE from 'three';

import './App.css';

class App extends React.Component {

  public view: HTMLElement;

  // tslint:disable-next-line:variable-name
  public scene: THREE.Scene;
  // tslint:disable-next-line:variable-name
  public camera: THREE.Camera;
  // tslint:disable-next-line:variable-name
  public renderer: THREE.WebGLRenderer;


  public componentDidMount() {
    this.view = document.getElementById('cube-container') as HTMLElement;
    this.camera = new THREE.PerspectiveCamera(60, this.view.offsetWidth / this.view.offsetHeight, 0.01, 20);
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize(this.view.offsetWidth, this.view.offsetHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.view.appendChild(this.renderer.domElement);

    this.render3D();
  }

  public render() {
    return (
      <div className="App">
        <div id="cube-container" className="CubeContainer"/>
      </div>
    );
  }

  private render3D() {
    this.renderer.render(this.scene, this.camera);
  }
}

export default App;
