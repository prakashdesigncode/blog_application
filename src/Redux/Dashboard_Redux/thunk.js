import { createAsyncThunk } from "@reduxjs/toolkit";
import { Base_Url } from "../../config";
import axios from "axios";

const authLogin = createAsyncThunk("auth/login", async (payload) => {
  const { value, callBack } = payload;
  const response = await axios.post(Base_Url + "auth/login", value);
  response.status === 201 &&
    localStorage.setItem("token", response?.data.access_token);
  response.status === 201 && callBack();
  return response?.data;
});

const authRegister = createAsyncThunk("auth/register", async (payload) => {
  const { value, callBack } = payload;
  const response = await axios.post(Base_Url + "auth/register", value);
  response.status === 201 && callBack();
  return response?.data;
});

const fetchPhotos = createAsyncThunk("photos/fetchPhotos", async (payload) => {
  const token = localStorage.getItem("token");
  const { userId, searchText = "" } = payload;
  const response = await axios.get(Base_Url + "photos", {
    params: { userId, ...(searchText && { searchText }) },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
});

const uploadPhoto = createAsyncThunk("photos/uploadPhoto", async (payload) => {
  const token = localStorage.getItem("token");
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

const createAlbums = createAsyncThunk("albums/createAlbums", async (data) => {
  const token = localStorage.getItem("token");
  const { callBack, payload } = data;
  const response = await axios.post(Base_Url + "albums", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  callBack(response?.data);
  return response?.data;
});

const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async (userId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(Base_Url + "albums", {
    params: { userId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
});

const getSingedUrl = createAsyncThunk(
  "photos/getSingedUrl",
  async (payload) => {
    const token = localStorage.getItem("token");
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
    const token = localStorage.getItem("token");
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

const getAlbumPhotos = createAsyncThunk(
  "albums/getAlbumPhotos",
  async (payload) => {
    const token = localStorage.getItem("token");
    const { ids, callBack } = payload;
    const response = await axios.post(
      Base_Url + "photos/albumPhotos",
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    callBack(response?.data);
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
  createAlbums,
  getAlbumPhotos,
};
