export const TESTING = "TESTING";
export const testing = () => ({type: TESTING});

export const SET_LIBRARY = "SET_LIBRARY";
export const setLibrary = books => ({type: SET_LIBRARY, books});

export const SET_BOOK = "SET_BOOK";
export const setBook = book => ({type: SET_BOOK, book});

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

export const createBook = (book) => dispatch => {
  return fetch('/api/library'.{
    method: 'post',
    body: JSON.stringify(book),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(book = <{
    dispatch(setBook(book));
  }).catch(err => {
    console.error(err);
  });
};

// {
//   method: 'GET',
//   headers: new Headers({
//     'Access-Control-Allow-Origin': '*'
//   })
//   }
