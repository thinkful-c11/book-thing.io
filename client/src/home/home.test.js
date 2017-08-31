import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import Home from "./index.js";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
    div
  );
});
