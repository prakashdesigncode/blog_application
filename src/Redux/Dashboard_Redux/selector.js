import { List } from "immutable";

const dashBoard = (state) => state.dashBoard;
const selectedIsLoading = (state) => dashBoard(state).get("isLoading");
const selectedPhotos = (state) => dashBoard(state).get("userPhotos", List());
const selectedPosts = (state) => dashBoard(state).get("posts", List());
const selectedCreation = (state) => dashBoard(state).get("creation", List());
const selectedAlbums = (state) => dashBoard(state).get("albums", List());

export {
  selectedIsLoading,
  selectedPosts,
  selectedPhotos,
  selectedCreation,
  selectedAlbums,
};
