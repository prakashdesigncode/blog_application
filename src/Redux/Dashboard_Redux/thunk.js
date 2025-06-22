import { createAsyncThunk } from "@reduxjs/toolkit";
import { Base_Url } from "../../config";
import axios from "axios";

const token = localStorage.getItem("token");

const authLogin = createAsyncThunk("auth/login", async (payload) => {
  const response = await axios.post(Base_Url + "auth/login", payload);
  return response?.data;
});

const authRegister = createAsyncThunk("auth/register", async (payload) => {
  const response = await axios.post(Base_Url + "auth/register", payload);
  return response?.data;
});

const fetchPhotos = createAsyncThunk("photos/fetchPhotos", async (userId) => {
  const response = await axios.get(Base_Url + "photos", {
    params: { userId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
});

const uploadPhoto = createAsyncThunk("photos/uploadPhoto", async (payload) => {
  const { callBack, formData } = payload;
  const response = await axios.post(Base_Url + "photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  callBack(response?.data);
  return response?.data;
});

const createAlbums = createAsyncThunk(
  "albums/createAlbums",
  async (payload) => {
    const response = await axios.post(Base_Url + "albums", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  }
);

const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async () => {
  const response = await axios.get(Base_Url + "albums");
  return response?.data;
});

const getSingedUrl = createAsyncThunk(
  "photos/getSingedUrl",
  async (payload) => {
    const { key, callBack } = payload;
    const response = await axios.get(Base_Url + "s3", {
      params: { url: key },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    callBack(response?.data?.url);
    return response?.data;
  }
);

const deleteSinglePhoto = createAsyncThunk(
  "photos/deleteSinglePhoto",
  async (payload) => {
    const { _id, userId, callBack } = payload;
    const response = await axios.delete(Base_Url + "photos", {
      params: { id: _id, userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    callBack();
    return response?.data;
  }
);

export {
  authLogin,
  authRegister,
  fetchPhotos,
  uploadPhoto,
  fetchAlbums,
  getSingedUrl,
  deleteSinglePhoto,
};
