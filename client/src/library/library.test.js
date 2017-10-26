import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import Library from './index.js';
const nock = require('nock');
console.log(store.getState());
const user = {
  user_id: 41234,
  first_name: 'Arthur',
  last_name: 'Dent',
  access_token: 'idontthinkireallyneedthis'
};

xit("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <Library/>
  </Provider>, div);
});

it("sandboxes", () => {
  const server = nock('/').get('http://localhost:8080/api/library').reply(200, [
    {
      id: 13920,
      title: 'Test title 0',
      author: 'test author 0',
      blurb: 'test description 0'
    }, {
      id: 13921,
      title: 'Test title 1',
      author: 'test author 1',
      blurb: 'test description 1'
    }
  ]);
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <Library/>
  </Provider>, div);
  // store.dispatch(fetchLibrary(user.access_token));
});

//displays books from databse
