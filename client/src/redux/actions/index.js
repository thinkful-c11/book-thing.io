export const SET_LIBRARY = "SET_LIBRARY";
export const setLibrary = books => ({type: SET_LIBRARY, books});

export const SET_USER = "SET_USER";
export const setUser = (user, token) => ({type: SET_USER, user, token});

export const SET_RECS = "SET_RECS";
export const setRecs = recs => ({type: SET_RECS, recs});

export const SET_REC_LIKES = "SET_REC_LIKES";
export const setRecLikes = (likes_counter, id) => ({type: SET_REC_LIKES, likes_counter, id});

export const LOG_OUT_USER = "LOG_OUT_USER";
export const logOutUser = () => ({type: LOG_OUT_USER});

export const SET_LIST = "SET_LIST";
export const setList = list => ({type: SET_LIST, list});

export const SET_LIKES = "SET_LIKES";
export const setLikes = (likes, list_id) => ({type: SET_LIKES, likes, list_id});

export const fetchUser = accessToken => dispatch => {
  return fetch("/api/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(user => {
    dispatch(setUser(user, accessToken));
  }).catch(err => {
    console.error(err);
  });
};

export const fetchLibrary = token => dispatch => {
  return fetch("/api/library", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(books => {
    dispatch(setLibrary(books));
  }).catch(err => {
    console.error(err);
  });
};

export const fetchList = (token, user_id) => dispatch => {
  return fetch(`/api/usersLists/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(list => {
    dispatch(setList(list));
  }).catch(err => {
    console.error(err);
  });
};

export const fetchRecomendations = (token, listid) => dispatch => {
  return fetch(`/api/recommendation/${listid}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(recs => {
    dispatch(setRecs([recs]));
    dispatch(setRecLikes(recs.likes_counter, recs.id));
  }).catch(err => {
    console.error(err);
  });
};

export const createBook = (books, token) => dispatch => {
  return fetch("/api/library", {
    method: "post",
    body: JSON.stringify(books),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }).catch(err => {
    console.error(err);
  });
};

export const createList = (list, token, user_id) => dispatch => {
  return fetch("/api/list", {
    method: "post",
    body: JSON.stringify(list),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json()).then(res => {
    dispatch(fetchList(token, user_id));
  }).catch(err => {
    console.error(err);
  });
};

export const updateLikes = (list_id, token) => dispatch => {
  return fetch(`/api/lists/likes/${list_id}`, {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json()).then(res => {
    dispatch(setLikes(res[0], list_id));
    dispatch(fetchRecomendations(token, list_id));
  }).catch(err => {
    console.error(err);
  });
};
