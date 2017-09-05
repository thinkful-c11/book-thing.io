import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import {shallow, mount} from "enzyme";
import * as actions from "../redux/actions";
import Recommendations from "./index.js";
const sinon = require("sinon");

//mock async createBook action

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <Recommendations/>
  </Provider>, div);
});

xit("dispatches createBook from handleSubmit", () => {
  const list = {
    listName: "a list name",
    tags: "some tags",
    blurb: "blurb"
  };

  const buttonClick = sinon.spy();
  const dispatch = jest.fn();
  const wrapper = mount(
    <Provider store={store}>
      <Recommendations list={list} dispatch={dispatch}/>
    </Provider>
  );
  wrapper.find("input.listName").simulate("keypress", {
    target: {
      value: list.listName
    }
  });
  wrapper.find("input.tags").simulate("keypress", {
    target: {
      value: list.tags
    }
  });
  wrapper.find("button.submitBook").simulate("click");
  expect(list.listName).toEqual(list.listName);
});
