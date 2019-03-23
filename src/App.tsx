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
        <footer className="CubeButtons">
          <button onClick={this.rotateFront}>F</button>
          <button onClick={this.rotateUp}>U</button>
          <button onClick={this.rotateLeft}>L</button>
          <button onClick={this.rotateRight}>R</button>
          <button onClick={this.rotateDown}>D</button>
          <button onClick={this.rotateBack}>B</button>
          <button onClick={this.rotateFront}>F'</button>
          <button onClick={this.rotateUp}>U'</button>
          <button onClick={this.rotateLeft}>L'</button>
          <button onClick={this.rotateRight}>R'</button>
          <button onClick={this.rotateDown}>D'</button>
          <button onClick={this.rotateBack}>B'</button>
          <button onClick={this.reset}>reset</button>
        </footer>

      </div>
    );
  }
  private reset = (event:React.MouseEvent) => {
    this.rubiksCube.reset();
  }
  private rotateFront = (event:React.MouseEvent) => {
    const textContent = (event.target as HTMLElement).textContent;
    this.rubiksCube.rotateFront(textContent === 'F');
  }
  private rotateUp = (event:React.MouseEvent) => {
    const textContent = (event.target as HTMLElement).textContent;
    this.rubiksCube.rotateUp(textContent === 'U');
  }
  private rotateLeft = (event:React.MouseEvent) => {
    const textContent = (event.target as HTMLElement).textContent;
    this.rubiksCube.rotateLeft(textContent === 'L');
  }
  private rotateRight = (event:React.MouseEvent) => {
    const textContent = (event.target as HTMLElement).textContent;
    this.rubiksCube.rotateRight(textContent === 'R');
  }
  private rotateDown = (event:React.MouseEvent) => {
    const textContent = (event.target as HTMLElement).textContent;
    this.rubiksCube.rotateDown(textContent === 'D');
  }
  private rotateBack = (event:React.MouseEvent) => {
    const textContent = (event.target as HTMLElement).textContent;
    this.rubiksCube.rotateBack(textContent === 'B');
  }
}

export default App;
