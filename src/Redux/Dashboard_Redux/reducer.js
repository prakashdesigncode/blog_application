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
  successCallBack,
} from "./utils";

import {
  authLogin,
  authRegister,
  fetchPhotos,
  getSingedUrl,
  fetchAlbums,
  uploadPhoto,
  deleteSinglePhoto,
  createAlbums,
  getAlbumPhotos,
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

    builder.addCase(uploadPhoto.pending, pendingCallBack);
    builder.addCase(uploadPhoto.fulfilled, successCallBack);
    builder.addCase(uploadPhoto.rejected, errorCallBack);
    /*---Upload Photo End-----*/

    /*---Delete Photo Start---*/
    builder.addCase(deleteSinglePhoto.pending, pendingCallBack);
    builder.addCase(deleteSinglePhoto.fulfilled, successCallBack);
    builder.addCase(deleteSinglePhoto.rejected, errorCallBack);
    /*---Delete Photo End-----*/

    /*---Create Album Start---*/
    builder.addCase(createAlbums.pending, pendingCallBack);
    builder.addCase(createAlbums.fulfilled, successCallBack);
    builder.addCase(createAlbums.rejected, errorCallBack);
    /*---Create Album End-----*/

    /*---Get Album Photos Start---*/
    builder.addCase(getAlbumPhotos.pending, pendingCallBack);
    builder.addCase(getAlbumPhotos.fulfilled, successCallBack);
    builder.addCase(getAlbumPhotos.rejected, errorCallBack);
    /*---Get Album Photos End-----*/
  },
});
export const { setData } = dashboardReducer.actions;
export default dashboardReducer.reducer;
