export const TESTING = "TESTING";
export const testing = () => ({
  type: TESTING
});

export const SET_LIBRARY = "SET_LIBRARY";
export const setLibrary = books => ({
  type: SET_LIBRARY,
  books
});

export const fetchLibrary = () => dispatch => {
  return fetch("/api/library")
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log("Are we here");
      return response.json();
    })
    .then(books => {
      console.log(books);
      dispatch(setLibrary(books));
    })
    .catch(err => {
      console.error(err);
    });
};
