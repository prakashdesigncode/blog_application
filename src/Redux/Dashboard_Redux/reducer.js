import { createSlice } from "@reduxjs/toolkit";
import { fromJS, Map } from "immutable";
import {
  pendingCallBack,
  errorCallBack,
  successCallBackPhotos,
  successCallBackPosts,
} from "./utils";

import { fetchPhotosData, fetchPostData } from "./tunk";

/*----------------------Static Utils------------------------*/
const initialState = fromJS({ isAuthenticate: false });
/*----------------------Static Utils------------------------*/

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /*---Posts Start---*/
    builder.addCase(fetchPhotosData.pending, pendingCallBack);
    builder.addCase(fetchPhotosData.fulfilled, successCallBackPhotos);
    builder.addCase(fetchPhotosData.rejected, errorCallBack);
    /*---Posts End----*/

    /*---Photos Start---*/
    builder.addCase(fetchPostData.pending, pendingCallBack);
    builder.addCase(fetchPostData.fulfilled, successCallBackPosts);
    builder.addCase(fetchPostData.rejected, errorCallBack);
    /*---Photos End-----*/
  },
});

export default dashboardReducer.reducer;
