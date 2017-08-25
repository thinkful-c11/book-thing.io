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
<<<<<<< HEAD
  return fetch("/api/library")
||||||| merged common ancestors
  return fetch("http://localhost:4000/api/library")
=======
  return fetch("http://localhost:8080/api/library" ) 
>>>>>>> 768bc70f36b9ba6119994973ba438181c74bb1af
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


// {
//   method: 'GET',
//   headers: new Headers({
//     'Access-Control-Allow-Origin': '*'
//   })
//   }