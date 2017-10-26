import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {reducer} from "./reducer";
const createNodeLogger = require('redux-node-logger');
// import * as createNodeLogger from "redux-node-logger";

export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk), applyMiddleware(createNodeLogger({
  downArrow: '▼',
  rightArrow: '▶',
  messageColor: 'bright-yellow',
  prevColor: 'grey',
  actionColor: 'bright-blue',
  nextColor: 'green',
  predicate: ''
})));
