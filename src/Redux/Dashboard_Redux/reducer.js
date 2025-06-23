import { createSlice } from "@reduxjs/toolkit";
import { fromJS } from "immutable";
import {
  pendingCallBack,
  errorCallBack,
  successCallBackLogin,
  successCallBackRegister,
  successGetUserPhotos,
  successGetSingedUrl,
  successFetchAlbums,
} from "./utils";

import {
  authLogin,
  authRegister,
  fetchPhotos,
  getSingedUrl,
  fetchAlbums,
} from "./thunk";

/*----------------------Static Utils------------------------*/
export const initialState = fromJS({ isAuthenticate: false });
/*----------------------Static Utils------------------------*/

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setData(state, action) {
      state = state.merge(action.payload);
      return state;
    },
  },
  extraReducers: (builder) => {
    /*---Auth Login Start---*/
    builder.addCase(authLogin.pending, pendingCallBack);
    builder.addCase(authLogin.fulfilled, successCallBackLogin);
    builder.addCase(authLogin.rejected, errorCallBack);
    /*---Auth Login End----*/

    /*---Auth Register Start---*/
    builder.addCase(authRegister.pending, pendingCallBack);
    builder.addCase(authRegister.fulfilled, successCallBackRegister);
    builder.addCase(authRegister.rejected, errorCallBack);
    /*---Auth Register End-----*/

    /*---Auth Register Start---*/
    builder.addCase(fetchPhotos.pending, pendingCallBack);
    builder.addCase(fetchPhotos.fulfilled, successGetUserPhotos);
    builder.addCase(fetchPhotos.rejected, errorCallBack);
    /*---Auth Register End-----*/

    /*---SignedUrl Start---*/
    builder.addCase(getSingedUrl.pending, pendingCallBack);
    builder.addCase(getSingedUrl.fulfilled, successGetSingedUrl);
    builder.addCase(getSingedUrl.rejected, errorCallBack);
    /*---SignedUrl End-----*/

    /*---Albums Start---*/
    builder.addCase(fetchAlbums.pending, pendingCallBack);
    builder.addCase(fetchAlbums.fulfilled, successFetchAlbums);
    builder.addCase(fetchAlbums.rejected, errorCallBack);
    /*---Albums End-----*/
  },
});
export const { setData } = dashboardReducer.actions;
export default dashboardReducer.reducer;
