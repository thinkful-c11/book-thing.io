import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "../redux";
import Library from './index.js';

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
    <Library/>
  </Provider>, div);
});

//displays books from databse
xit("displays the books", () => {
  const book = [
    {
      Title: "",
      Author: " "
    }
  ];

})
