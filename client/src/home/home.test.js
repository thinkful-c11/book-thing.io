import React from "react";
import ReactDOM from "react-dom";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {shallow, mount} from "enzyme";
import * as Cookies from "js-cookie";
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

it("logs out and clears cookies", () => {
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <Home user={{
          loggedIn: true
        }}/>
      </MemoryRouter>
    </Provider>
  );
  Cookies.set('accessToken', '12345');
  wrapper.find('.logout').simulate('click');
  expect(Cookies.get('accessToken')).toEqual('undefined');
  wrapper.setProps({
    user: {
      loggedIn: false
    }
  });
  console.log("props", wrapper.props().user);
  // expect(wrapper.props().).toEqual('false');
});
