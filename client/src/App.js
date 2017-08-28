import React, { Component } from "react";
import logo from "./logo.svg";
import store from "./redux";
import "./App.css";
import { Route } from "react-router-dom";

//actions
import { fetchLibrary } from "./redux/actions";

//components
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
      </section>
    );
  }
}

export default App;
