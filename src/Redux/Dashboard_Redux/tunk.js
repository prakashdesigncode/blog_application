import { createAsyncThunk } from "@reduxjs/toolkit";
import { Base_Url } from "../../config";
import axios from "axios";

const fetchPostData = createAsyncThunk("dashboard/posts", async () => {
  const response = await axios.get(Base_Url + "/posts");
  return response?.data;
});

const fetchPhotosData = createAsyncThunk("dashboard/photos", async () => {
  const response = await axios.get(Base_Url + "/photos");
  return response?.data;
});

export { fetchPostData, fetchPhotosData };
