import React from "react";
import ReactDOM from "react-dom";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {shallow, mount} from "enzyme";
import store from "../redux";
import Nav from "./index";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <MemoryRouter>
      <Nav/>
    </MemoryRouter>
  </Provider>, div);
});
