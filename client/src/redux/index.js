import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {reducer} from "./reducer";

export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));
