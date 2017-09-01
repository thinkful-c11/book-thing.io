import React from "react";
import ReactDOM from "react-dom";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {shallow, mount} from "enzyme";
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

it("changes loggedIn prop from false to true", () => {
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <Home loggedIn='false'/>
      </MemoryRouter>
    </Provider>
  );
  wrapper.find('.signIn').simulate('click');
  wrapper.setProps({loggedIn: 'true'});
  console.log("props", wrapper.props().loggedIn);
  expect(wrapper.props().loggedIn).toEqual('true');
});

xit("logs out and clears cookies", () => {
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <Home loggedIn='true'/>
      </MemoryRouter>
    </Provider>
  );
  wrapper.find('.logout').simulate('click');
  wrapper.setProps({loggedIn: 'false'});
  console.log("props", wrapper.props().loggedIn);
  expect(wrapper.props().loggedIn).toEqual('false');
});
