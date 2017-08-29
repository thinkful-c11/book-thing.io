export const TESTING = "TESTING";
export const testing = () => ({type: TESTING});

export const SET_LIBRARY = "SET_LIBRARY";
export const setLibrary = books => ({type: SET_LIBRARY, books});

export const fetchLibrary = () => dispatch => {
  return fetch("/api/library").then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(books => {
    console.log(books);
    dispatch(setLibrary(books));
  }).catch(err => {
    console.error(err);
  });
};

export const createBook = (books) => dispatch => {
  return fetch('/api/library', {
    method: 'post',
    body: JSON.stringify(books),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).catch(err => {
    console.error(err);
  });
};
