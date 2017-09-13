import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "./redux/actions";
import {reducer} from "./redux/reducer/index";
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
    // console.log("actions", store.getActions());
    expect(store.getActions()[0]).toEqual(expectedActions);
  });
});
test("should increase list likes by 1", function() {
  const state = {
    list: [
      {
        likes: 0,
        listId: 1744
      }
    ]
  };
  let result = reducer(state, actions.setLikes(1, 1744));
  expect(result.list[0].likes).toEqual(1);
});

test('should increase rec likes by 1', function() {
  const state = {
    rec: [
      {
        id: 1745,
        likes_counter: 0
      }
    ]
  };
  const result = (reducer(state, actions.setRecLikes(1, 1745)));
  expect(result.rec[0].likes_counter).toEqual(1);
});
