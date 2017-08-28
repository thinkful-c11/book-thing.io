import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";

//components
import Recommendations from "./recommendations";
import Library from "./library";
import Home from "./home";

class App extends Component {
  // componentDidMount() {
  //   console.log("hello");
  //   store.dispatch(fetchLibrary());
  // }

  render() {
    return (
      <section>
        <Route exact path="/" component={Home} />
        <Route path="/library" component={Library} />
        <Route path="/recommendations" component={Recommendations} />
      </section>
    );
  }
}

export default App;
