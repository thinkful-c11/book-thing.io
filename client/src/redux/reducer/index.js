
//actions
import * as actions from "../actions";

const initialState = {
  testing: false,
  library: [],
  success: false
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TESTING:
      return Object.assign({}, state, { testing: !state.testing });
    case actions.SET_LIBRARY:
      return Object.assign({}, state, {
        library: action.books,
        success: true
      });
    default:
      return state;
  }
};
