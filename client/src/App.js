import React, { Component } from "react";
import "./App.css";
import { Route, BrowserRouter } from "react-router-dom";

//components
import Recommendations from "./recommendations";
import Library from "./library";
import Home from "./home";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/library" component={Library} />
        <Route path="/recommendations" component={Recommendations} />
      </BrowserRouter>
    );
  }
}

export default App;
