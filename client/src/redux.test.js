import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "./redux/actions";
global.fetch = require("jest-fetch-mock");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  testing: false,
  success: false,
  library: []
});

// test("the testing action should toggle 'testing' in the state", function() {
//   store.dispatch(actions.testing());
//   expect(store.getState().testing).toBe(true);
// });

test("async action should fetch for the library and set it to state", function() {
  fetch.mockResponse(
    JSON.stringify([{ title: "book1", summary: "the description of book1" }])
  );
  const expectedActions = [
    {
      type: "SET_LIBRARY",
      books: [{ title: "book1", summary: "the description of book1" }]
    }
  ];
  expect(store.getState().library).toHaveLength(0);
  return store.dispatch(actions.fetchLibrary()).then(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });
});
