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
  const isHere = handleLocalStorage();
  return isHere ? children : <Navigate to="/" replace />;
};

const CheckLoginRedirect = ({ children }) => {
  const isHere = handleLocalStorage();
  return isHere ? (
    <Navigate to="/home/dashboard?current=0" replace />
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
            <CheckLoginRedirect>
              <LoginCompound />
            </CheckLoginRedirect>
          }
          path="/"
        />
        <Route
          element={
            <CheckRedirect>
              <DashboardCompound />
            </CheckRedirect>
          }
          path="/home"
        >
          <Route
            element={
              <CheckRedirect>
                <Home />
              </CheckRedirect>
            }
            path="dashboard"
          />
          <Route
            element={
              <CheckRedirect>
                <Posts />
              </CheckRedirect>
            }
            path="posts"
          />
          <Route
            element={
              <CheckRedirect>
                <Photos />
              </CheckRedirect>
            }
            path="photos"
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
