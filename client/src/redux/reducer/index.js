//actions
import * as actions from "../actions";

const initialState = {
  library: [],
  success: false,
  user: {
    loggedIn: false
  },
  list: [],
  rec: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LIBRARY:
      return Object.assign({}, state, {
        library: action.books,
        success: true
      });
    case actions.SET_LIKES:
      let index = state.list.findIndex((l, index) => {
        return l.listId === action.list_id;
      });
      return Object.assign({}, state, {
        list: Array.prototype.concat(state.list.slice(0, index), Object.assign({}, state.list.slice()[index], {likes: action.likes}), state.list.slice(index + 1, state.list.length))
      });
    case actions.SET_REC_LIKES:
      return Object.assign({}, state, {
        rec: [Object.assign({}, state.rec[0], {likes_counter: action.likes_counter})]
      })
    case actions.SET_LIST:
      return Object.assign({}, state, {list: action.list});
    case actions.SET_RECS:
      return Object.assign({}, state, {rec: action.recs});
    case actions.SET_USER:
      return Object.assign({}, state, {
        user: {
          ...action.user,
          token: action.token,
          loggedIn: true
        }
      });
    case actions.LOG_OUT_USER:
      return Object({}, state, {
        user: {
          loggedIn: false
        }
      });
    default:
      return state;
  }
};
