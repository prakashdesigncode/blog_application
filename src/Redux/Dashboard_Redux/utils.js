import { fromJS } from "immutable";

const pendingCallBack = (state) => {
  state = state.set("isLoading", true);
  return state;
};

const errorCallBack = (state, action) => {
  state = state.set("isLoading", false).set("error", action.error);
  return state;
};

const successCallBackLogin = (state, action) => {
  localStorage.setItem("token", action.payload.access_token);
  state = state
    .set("userCredentials", fromJS(action.payload.user))
    .set("isLoading", false);
  return state;
};

const successCallBackRegister = (state, action) => {
  state = state.set("message", fromJS(action.payload)).set("isLoading", false);
  return state;
};

const successGetUserPhotos = (state, action) => {
  state = state
    .set("userPhotos", fromJS(action.payload))
    .set("isLoading", false);
  return state;
};

const successGetSingedUrl = (state, action) => {
  state = state.set("isLoading", false);
  return state;
};

const successFetchAlbums = (state, action) => {
  state = state.set("albums", fromJS(action.payload)).set("isLoading", false);
  return state;
};

export {
  pendingCallBack,
  errorCallBack,
  successCallBackLogin,
  successCallBackRegister,
  successGetUserPhotos,
  successGetSingedUrl,
  successFetchAlbums,
};
