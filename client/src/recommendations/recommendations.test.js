import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import {shallow, mount} from "enzyme";
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

  const buttonClick = sinon.spy();
  const dispatch = jest.fn();
  const wrapper = mount(
    <Provider store={store}>
      <Recommendations book={book} dispatch={dispatch}/>
    </Provider>
  );
  wrapper.find("input.title").simulate('keypress', {
    target: {
      value: book.title
    }
  });
  wrapper.find("input.author").simulate('keypress', {
    target: {
      value: book.author
    }
  });
  wrapper.find("textarea.summary").simulate('keypress', {
    target: {
      value: book.summary
    }
  });
  wrapper.find("button.submitBook").simulate('click');
  //add an assert to check book in created in state
});
