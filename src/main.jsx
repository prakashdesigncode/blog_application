import { createRoot } from "react-dom/client";
import LoginCompound from "./Login";
import DashboardCompound from "./Dashboard";
import Photos from "./Compounds/Photos";
import Posts from "./Compounds/Posts";
import { Provider } from "react-redux";
import store from "./Redux/Dashboard_Redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route Component={LoginCompound} path="/login" />
        <Route Component={DashboardCompound} path="/dashboard" />
        <Route Component={Posts} path="dashboard/posts" />
        <Route Component={Photos} path="dashboard/photos" />
      </Routes>
    </BrowserRouter>
  </Provider>
);
