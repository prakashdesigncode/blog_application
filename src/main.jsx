import { createRoot } from "react-dom/client";
import LoginCompound from "./Login";
import DashboardCompound from "./Dashboard";
import Photos from "./Compounds/Photos";
import Posts from "./Compounds/Posts";
import { Provider } from "react-redux";
import store from "./Redux/Dashboard_Redux/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { handleLocalStorage } from "./Utils/customfunctions";
import "./main.scss";
import "./style.css";
import Home from "./Compounds/Home";

const CheckRedirect = ({ children }) => {
  const { username, password } = handleLocalStorage();
  return username && password ? (
    <Navigate to="/dashboard/photos" replace />
  ) : (
    children
  );
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <CheckRedirect>
              <LoginCompound />
            </CheckRedirect>
          }
          path="/login"
        />
        <Route element={<DashboardCompound />} path="/">
          <Route element={<Home />} path="home" />
          <Route element={<Posts />} path="posts" />
          <Route element={<Photos />} path="photos" />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
