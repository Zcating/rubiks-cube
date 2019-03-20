import * as React from 'react';
import { RubiksCube } from "./modules/RubiksCube";
import './App.css';

class App extends React.Component {

  public rubiksCube: RubiksCube;

  public componentDidMount() {
    this.rubiksCube = new RubiksCube(document.getElementById('cube-container') as HTMLElement);
  }

  public render() {
    return (
      <div className="App">
        <div id="cube-container" className="CubeContainer"/>
      </div>
    );
  }
}

export default App;
