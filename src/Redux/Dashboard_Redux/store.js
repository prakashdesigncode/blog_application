import { configureStore } from "@reduxjs/toolkit";
import dashBoard from "./reducer";

const store = configureStore({
  reducer: { dashBoard },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
