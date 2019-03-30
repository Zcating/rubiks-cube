import * as React from 'react';
import { RubiksCube } from "./modules/RubiksCube";
import './App.css';


class App extends React.Component<any, any> {

    public rubiksCube: RubiksCube;

    public allOperations = [
        'L', 'L\'', 'L2', 'L\'2',
        'R', 'R\'', 'R2', 'R\'2',
        'U', 'U\'', 'U2', 'U\'2',
        'D', 'D\'', 'D2', 'D\'2',
        'F', 'F\'', 'F2', 'F\'2',
        'B', 'B\'', 'B2', 'B\'2'
    ];

    constructor (props: any) {

        super(props);
        this.state = {
            steps: ''
        };
    }
    
    public componentDidMount() {
        this.rubiksCube = new RubiksCube(document.getElementById('cube-container') as HTMLElement);
    }

    public render() {
        return (
        <div className="App">
            <div id="cube-container" className="CubeContainer"/>
            <div id="steps-content">{this.state.steps}</div> 
            <footer className="CubeButtons">
            <button onClick={this.disrupt}>25 STEP DISRUPT</button>
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

    // this algorithm is wrong...
    // I am trying to think another one..
    private disrupt = () => {
        let steps = '';
        const operationQueue = [];
        for (let index = 0; index < 25; index++) {
            const number = (Math.floor(100 * Math.random())) % 24;
            const operation = this.allOperations[number];
            operationQueue.push(this.allOperations[number]);
            steps += operation + ' ';
        }
        this.setState({steps});
        this.rubiksCube.startAOperationQueue(operationQueue);
    }

    private reset = (event:React.MouseEvent) => {
        this.rubiksCube.reset();
    }
    private rotateFront = (event:React.MouseEvent) => {
        const textContent = (event.target as HTMLElement).textContent;
        this.rubiksCube.operate(textContent as string);
    }
    private rotateUp = (event:React.MouseEvent) => {
        const textContent = (event.target as HTMLElement).textContent;
        this.rubiksCube.operate(textContent as string);
    }
    private rotateLeft = (event:React.MouseEvent) => {
        const textContent = (event.target as HTMLElement).textContent;
        this.rubiksCube.operate(textContent as string);
    }
    private rotateRight = (event:React.MouseEvent) => {
        const textContent = (event.target as HTMLElement).textContent;
        this.rubiksCube.operate(textContent as string);
    }
    private rotateDown = (event:React.MouseEvent) => {
        const textContent = (event.target as HTMLElement).textContent;
        this.rubiksCube.operate(textContent as string);
    }
    private rotateBack = (event:React.MouseEvent) => {
        const textContent = (event.target as HTMLElement).textContent;
        this.rubiksCube.operate(textContent as string);
    }
}

export default App;
