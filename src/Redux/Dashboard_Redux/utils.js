import { fromJS } from "immutable";

const pendingCallBack = (state) => {
  state = state.set("isLoading", true);
  return state;
};

const errorCallBack = (state, action) => {
  state = state.set("isLoading", false).set("error", action.error);
  return state;
};

const successCallBackPosts = (state, action) => {
  state = state.set("posts", fromJS(action.payload)).set("isLoading", false);
  return state;
};

const successCallBackPhotos = (state, action) => {
  state = state.set("photos", fromJS(action.payload)).set("isLoading", false);
  return state;
};

export {
  pendingCallBack,
  errorCallBack,
  successCallBackPhotos,
  successCallBackPosts,
};
