import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import {shallow} from "enzyme";
import * as actions from "../redux/actions"
import Recommendations from './index.js';

//mock async createBook action
const mockCreateBookAction = (book) => {
  type : 'CREATE_BOOK',
  book
};

jest.mock('../redux/actions', () => Object.assign({}, require.requireActual('../redux/actions'), {createBook: jest.fn().mockImplementation(() => {
    return mockCreateBookAction;
  })}));

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
  shallow(
    <Provider store={store}>
      <Recommendations book={book} dispatch={dispatch}/>
    </Provider>
  );
  expect(dispatch).toHaveBeenCalledWith(mockCreateBookAction(book));
});
