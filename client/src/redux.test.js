import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "./redux/actions";
global.fetch = require("jest-fetch-mock");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({testing: false, success: false, library: []});

test("async action should fetch for the library and set it to state", function() {
  fetch.mockResponse(JSON.stringify([
    {
      title: "book1",
      blurb: "the description of book1"
    }
  ]));
  const expectedActions = {
    type: "SET_LIBRARY",
    books: [
      {
        title: "book1",
        blurb: "the description of book1"
      }
    ]
  };
  expect(store.getState().library).toHaveLength(0);
  return store.dispatch(actions.fetchLibrary()).then(() => {
    console.log("actions", store.getActions());
    expect(store.getActions()[0]).toEqual(expectedActions);
  });
});
