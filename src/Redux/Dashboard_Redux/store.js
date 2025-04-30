import { configureStore } from "@reduxjs/toolkit";
import dashBoard from "./reducer";

const store = configureStore({
  reducer: { dashBoard },
});

export default store;
