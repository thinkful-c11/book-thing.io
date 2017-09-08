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
    console.log("actions", store.getActions());
    expect(store.getActions()[0]).toEqual(expectedActions);
  });
});
test("should increase list likes by 1", function() {
  const state = {
    library: [],
    success: false,
    user: {
      id: 1096,
      user_id: '101908905086908038211',
      first_name: 'Patrice',
      last_name: 'White',
      token: 'ya29.GlzABP1UXZdQLnSga9ViGZQX74ihzoMiY5RXqW2nLn0A3ZSv51CpKg8ecy5HOiaEi_nst_JP6Pou9FVYBqujgJy7iD9B8bycLm8_7posWkfSmbH7ECT52LhhLBy5bg',
      loggedIn: true
    },
    list: [
      {
        liked_flag: false,
        likes: 0,
        userId: 1096,
        listId: 1744,
        created_flag: true,
        listTitle: 'Java',
        tags: '#java',
        books: [
          {
            bookTitle: 'Head First Java',
            bookAuthor: 'some author',
            blurb: 'Learn Java easily. '
          }
        ]
      }
    ],
    rec: []
  };
  let result = reducer(state, actions.setLikes(1, 1744));
  expect(result.list[0].likes).toEqual(1);
});

test('', function() {
  const state = {
    library: [],
    success: false,
    user: {
      id: 1096,
      user_id: '101908905086908038211',
      first_name: 'Patrice',
      last_name: 'White',
      token: 'ya29.GlzABMXuTQ5fZb6mbp_f7jwCv9ZKXrgKP1BdNUwPYu_kVmFvTOWjYFDNXeNA49ikEsTLNEGm33qWdujpMn1oMWgGWv4hY1HrzAoHwEkluhJKxJcbKOTxRThmJX-EBw',
      loggedIn: true
    },
    list: [
      {
        liked_flag: false,
        likes: 0,
        userId: 1096,
        listId: 1744,
        created_flag: true,
        listTitle: 'Java',
        tags: '#java',
        books: [
          {
            bookTitle: 'Head First Java',
            bookAuthor: 'some author',
            blurb: 'Learn Java easily. '
          }
        ]
      }, {
        liked_flag: false,
        likes: 0,
        userId: 1096,
        listId: 1745,
        created_flag: true,
        listTitle: 'JavaScript',
        tags: '#JavaScript',
        books: [
          {
            bookTitle: 'JavaScript Ninja',
            bookAuthor: 'Bear Bibeault and John Resig',
            blurb: 'Learn JS'
          }
        ]
      }
    ],
    rec: [
      {
        id: 1745,
        list_name: 'JavaScript',
        tags: '#JavaScript',
        likes_counter: 0,
        books: [
          {
            id: 11332,
            title: 'JavaScript Ninja',
            author: 'Bear Bibeault and John Resig',
            blurb: 'Learn JS'
          }
        ],
        weight: 1,
        creator_id: 1096,
        creator_name: 'Patrice'
      }
    ]
  };
  const result = (reducer(state, actions.setRecLikes(1, 1745)));
  console.log(result);
  expect(result.rec[0].likes_counter).toEqual(1);
});
