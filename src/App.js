import React, { View, Component } from 'react';
import logo from './logo.svg';
import Runner from './running.jpg';
import './App.css';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.weeklyGoal = 30;
        this.currentProgress = 27;
        this.state = {routes: [], bounds: [], city: '', routeDetails: null}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSegments = this.getSegments.bind(this);
        this.getSegment = this.getSegment.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        fetch('https://a.tiles.mapbox.com/v4/geocode/mapbox.places/'
            + this.state.city + '.json?access_token=pk.eyJ1Ijoic3RyYXZhIiwiYSI6IlpoeXU2U0UifQ.c7yhlZevNRFCqHYm6G6Cyg')
            .then((response) => response.json())
            .then((response) => this.setState({bounds: response.features[0].bbox}))
            .then(() => console.log(this.state.bounds))
            .then(() => this.getSegments());
    }

    handleChange(event) {
        this.setState({city: event.target.value});
        console.log(this.state);
    }

    getSegments() {
        this.state.bounds[0] += 2;
        this.state.bounds[0] -= 2;
        this.state.bounds[0] -= 2;
        this.state.bounds[2] += 2;

        fetch('https://www.strava.com/api/v3/segments/explore?bounds=[' +
            this.state.bounds[1] + "," + // SW latitude
            this.state.bounds[0] + "," + // SW longitude
            this.state.bounds[3] + "," + // NE latutude
            this.state.bounds[2] + // NE longitude
            "]", {
            headers: new Headers({
                'Authorization': 'Bearer 6c2fdb6f73ae7a0ad8c2dcfa1a2badec5670a42c'
            }),
        })
            .then((response) => response.json())
            .then((response) => this.setState({routes: response.segments}))
            .then(() => console.log(this.state.routes));
    }

    getSegment(routeId) {
        console.log("Segment clicked");
        console.log(routeId);
        fetch('https://www.strava.com/api/v3/segments/' + routeId, {
            headers: new Headers({
                'Authorization': 'Bearer 6c2fdb6f73ae7a0ad8c2dcfa1a2badec5670a42c'
            }),
        })
            .then((response) => response.json())
            .then((response) => this.setState({routeDetails: response}))
            .then(() => console.log(this.state.routeDetails))
            .then(() => this.forceUpdate());

    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={Runner} className="App-logo" alt="logo" />
          <h1 className="App-title">Running Log Home</h1>
        </header>
          <p>
              Today's run:
          </p>
          <Run info={this.state.routeDetails}/>
          <hr/>
          <p className="App-intro">
              Weekly Mileage Completion:
          </p>
          <Progress type="circle" percent={this.currentProgress / this.weeklyGoal * 100} />
          <p>
              {this.currentProgress} of {this.weeklyGoal} miles completed.
          </p>
          <form onSubmit={this.handleSubmit}>
              <label>
                  Name:
                  <input type="text" name="name" value={this.state.city} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
          </form>

          <ul className="list-group">
              {this.state.routes.map((route) => (
                  <li
                  className="list-group-item"
                  onClick={() => this.getSegment(route.id)}
                  >
                  {route.name}
                  </li>
                  ))
              }
          </ul>
      </div>
    );
  }
}

const Run = ({info}) => {
    if (!info) {
        return <div>
            Please enter a city in the search bar below, and click on a run to see information.
        </div>
    } else {
        return (
            <div>
                <p>
                    Route Name: {info.name}
                </p>
                <p>
                    Distance : {info.distance / 1609.3} miles
                </p>
                <p>
                    Elevation Gain: {info.total_elevation_gain}
                </p>
            </div>
        )
    }
}
export default App;
