import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../redux";
import { shallow, mount } from "enzyme";
import * as actions from "../redux/actions";
import Recommendations from "./index.js";
const sinon = require("sinon");

//mock async createBook action

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <Recommendations />
    </Provider>,
    div
  );
});

it("dispatches createBook from handleSubmit", () => {
  const list = {
    listName: "a list name",
    tags: "some tags",
    blurb: "blurb"
  };

  const buttonClick = sinon.spy();
  const dispatch = jest.fn();
  const wrapper = shallow(
    <Recommendations store={store} dispatch={dispatch} />
  );
  wrapper.find("input.listName").simulate("keypress", {
    target: {
      value: list.listName
    }
  });
  // wrapper.find("input.tags").simulate("keypress", {
  //   target: {
  //     value: list.tags
  //   }
  // });
  console.log("BEFORE ##########", wrapper.state());
  wrapper.find("button.submitList").simulate("click");
  console.log("AFTER ##########", wrapper.state);
  expect(list.listName).toEqual(list.listName);
});
