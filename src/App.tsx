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
        </div>
      </div>
    );
  }

  private rotateFront = (event:React.MouseEvent) => {
    this.rubiksCube.rotateFront();
  }
  private rotateUp = (event:React.MouseEvent) => {
    this.rubiksCube.rotateUp();
  }
}

export default App;
