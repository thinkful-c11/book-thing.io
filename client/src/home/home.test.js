import React from "react";
import ReactDOM from "react-dom";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "../redux";
import Home from "./index.js";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <MemoryRouter>
      <Home/>
    </MemoryRouter>
  </Provider>, div);
});
