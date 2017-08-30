import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import {shallow} from "enzyme";
import * as actions from "../redux/actions"
import Recommendations from './index.js';
const sinon = require('sinon');

//mock async createBook action

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <Recommendations/>
  </Provider>, div);
});

it("dispatches createBook from handleSubmit", () => {
  const book = {
    title: "title",
    author: "author",
    summary: "summary"
  };

  const dispatch = jest.fn();
  const buttonClick = sinon.spy();
  const wrapper = shallow(
    <Provider store={store}>
      <Recommendations book={book} dispatch={dispatch}/>
    </Provider>
  );
  wrapper.find('#title').simulate('keypress', {
    target: {
      value: "title"
    }
  });
  wrapper.find('#author').simulate('keypress', {
    target: {
      value: "author"
    }
  });
  wrapper.find('#summary').simulate('keypress', {
    target: {
      value: "summary"
    }
  });
  wrapper.find('#button').simulate('click');
  expect(buttonClick.calledOnce).to.equal(true);
});

//store.getState()
