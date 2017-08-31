import React from "react";
import ReactDOM from "react-dom";
<<<<<<< HEAD:client/src/home.test.js
import Home from "./home/";
=======
import {MemoryRouter} from 'react-router-dom';
import Home from "./index.js";
>>>>>>> d6f7b75c92eaae936301cf10b96e01c1e6711de3:client/src/home/home.test.js

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter>
    <Home/>
  </MemoryRouter>, div);
});
