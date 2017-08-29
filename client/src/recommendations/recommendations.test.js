import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import Recommendations from './index.js';

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <Recommendations/>
  </Provider>, div);
});

it("creates the new book you input", () => {});
