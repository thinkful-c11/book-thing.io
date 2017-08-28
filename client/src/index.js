import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from "./redux";
import './index.css';
import Library from './Library';

ReactDOM.render(
<Provider store={store}>
  <Library />
</Provider>, document.getElementById('root'));
