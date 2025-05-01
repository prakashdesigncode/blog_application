import { List } from "immutable";

const dashBoard = (state) => state.dashBoard;
const selectedIsLoading = (state) => dashBoard(state).get("isLoading");
const selectedPhotos = (state) => dashBoard(state).get("photos", List());
const selectedPosts = (state) => dashBoard(state).get("posts", List());

export { selectedIsLoading, selectedPosts, selectedPhotos };
