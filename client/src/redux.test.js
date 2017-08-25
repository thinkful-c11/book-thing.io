import store from "./redux";
import * as actions from "./redux/actions";
import "whatwg-fetch";

test("the testing action should toggle 'testing' in the state", function() {
  store.dispatch(actions.testing());
  expect(store.getState().testing).toBe(true);
});

test("async action should fetch for the library and set it to state", function() {
  expect(store.getState().library).toHaveLength(0);
  store.dispatch(actions.fetchLibrary());
  expect(store.getState().success).toBe(true);
});
