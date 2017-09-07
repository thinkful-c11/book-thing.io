//actions
import * as actions from "../actions";

const initialState = {
  library: [],
  success: false,
  user: {
    loggedIn: false
  },
  list: [],
  rec: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LIBRARY:
      return Object.assign({}, state, {
        library: action.books,
        success: true
      });
    case actions.SET_LIST:
      return Object.assign({}, state, {list: action.list});
    case actions.SET_RECS:
      console.log(action.recs);
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
