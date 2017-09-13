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

it.only("allows us to play with mocks", () => {
  function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  }
  const mockCallback = jest.fn();
  forEach([
    0, 1, 5
  ], mockCallback);

  expect(mockCallback.mock.calls.length).toBe(3);
  expect(mockCallback.mock.calls[0][0]).toBe(0);
  expect(mockCallback.mock.calls[1][0]).toBe(1);
  expect(mockCallback.mock.calls[2][0]).toBe(5);
});

xit("dispatches createBook from handleListCreation", () => {
  const list = {
    listName: ''
  }
  const buttonClick = sinon.spy();
  const dispatch = jest.fn();
  const wrapper = shallow(<Recommendations store={store} list={list}/>);
  expect(wrapper.node.props.list.listName).toEqual('');
  wrapper.find("button.submitList").simulate('click');
  wrapper.find("input.listName").simulate("keypress", {
    target: {
      value: list.listName
    }
  });
  expect(wrapper.node.props.list.listName).toEqual('listName');
});
