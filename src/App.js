import React, { Component } from 'react';
import logo from './logo.svg';
import Runner from './running.jpg';
import './App.css';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.weeklyGoal = 30;
        this.currentProgress = 27;
    }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={Runner} className="App-logo" alt="logo" />
          <h1 className="App-title">Running Log Home</h1>
        </header>
          <p className="App-intro">
              Weekly Mileage Completion: {this.currentProgress} of {this.weeklyGoal} miles completed.
          </p>
          <Progress type="circle" percent={this.currentProgress / this.weeklyGoal * 100} />
          <p>
              Today's run:
          </p>
      </div>
    );
  }
}

export default App;
