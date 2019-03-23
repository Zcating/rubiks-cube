import * as React from 'react';
import { RubiksCube } from "./modules/RubiksCube";
import './App.css';

class App extends React.Component {

  public rubiksCube: RubiksCube;

  public componentDidMount() {
    this.rubiksCube = new RubiksCube(document.getElementById('cube-container') as HTMLElement);
    // tslint:disable-next-line:no-console
    console.log(this);

  }



  public render() {
    return (
      <div className="App">
        <div id="cube-container" className="CubeContainer"/>
        <div className="CubeButtons">
          <button onClick={this.rotateFront}>F</button>
          <button onClick={this.rotateUp}>U</button>
          <button onClick={this.rotateLeft}>L</button>
          <button onClick={this.rotateRight}>R</button>
          <button onClick={this.rotateDown}>D</button>
          <button onClick={this.rotateBack}>B</button>
          <button onClick={this.reset}>reset</button>
        </div>
      </div>
    );
  }
  private reset = (event:React.MouseEvent) => {
    this.rubiksCube.reset();
  }
  private rotateFront = (event:React.MouseEvent) => {
    this.rubiksCube.rotateFront(true);
  }
  private rotateUp = (event:React.MouseEvent) => {
    this.rubiksCube.rotateUp(true);
  }
  private rotateLeft = (event:React.MouseEvent) => {
    this.rubiksCube.rotateLeft(true);
  }
  private rotateRight = (event:React.MouseEvent) => {
    this.rubiksCube.rotateRight(true);
  }
  private rotateDown = (event:React.MouseEvent) => {
    this.rubiksCube.rotateDown(true);
  }
  private rotateBack = (event:React.MouseEvent) => {
    this.rubiksCube.rotateBack(true);
  }
}

export default App;
