import React from 'react';
import ReactDOM from 'react-dom';
import {StaticRouter} from 'react-router-dom';
import {Provider} from "react-redux";
import store from "./redux";
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
    <StaticRouter>
      <App/>
    </StaticRouter>
  </Provider>, div);
});
