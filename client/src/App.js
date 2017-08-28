import React, { Component } from "react";
import logo from "./logo.svg";
import { fetchLibrary } from "./redux/actions";
import store from "./redux";
import "./App.css";

class App extends Component {
  // componentDidMount() {
  //   console.log("hello");
  //   store.dispatch(fetchLibrary());
  // }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React bros</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
