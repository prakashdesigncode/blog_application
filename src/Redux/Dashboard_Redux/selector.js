import { createSelector } from "@reduxjs/toolkit";
import { List } from "immutable";

const dashBoard = (state) => state.dashBoard;
const selectedIsAuthenticate = (state) =>
  dashBoard(state).get("isAuthenticate");
const selectedPhotos = (state) => dashBoard(state).get("photos", List());
const selectedPosts = (state) => dashBoard(state).get("posts", List());

export { selectedIsAuthenticate, selectedPosts, selectedPhotos };
