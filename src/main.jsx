import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/Dashboard_Redux/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./main.scss";
import "./style.css";
import { Suspense, lazy } from "react";
import { CircularProgress } from "@mui/material";

const LoginCompound = lazy(() => import("./Login"));
const DashboardCompound = lazy(() => import("./Dashboard"));
const Photos = lazy(() => import("./Compounds/Photos"));
const Albums = lazy(() => import("./Compounds/Albums"));

const CheckRedirect = ({ children }) => {
  const isHere = localStorage.getItem("token");
  return isHere ? children : <Navigate to="/login" replace />;
};

const CheckLoginRedirect = ({ children }) => {
  const isHere = localStorage.getItem("token");
  return isHere ? <Navigate to="/photos" replace /> : children;
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Suspense fallback={<CircularProgress />}>
              <CheckLoginRedirect>
                <LoginCompound />
              </CheckLoginRedirect>
            </Suspense>
          }
          path="/login"
        />
        <Route
          element={
            <Suspense fallback={<CircularProgress />}>
              <CheckRedirect>
                <DashboardCompound />
              </CheckRedirect>
            </Suspense>
          }
          path="/"
        >
          <Route
            element={
              <Suspense fallback={<CircularProgress />}>
                <CheckRedirect>
                  <Photos />
                </CheckRedirect>
              </Suspense>
            }
            path="photos"
          />
          <Route
            element={
              <Suspense fallback={<CircularProgress />}>
                <CheckRedirect>
                  <Albums />
                </CheckRedirect>
              </Suspense>
            }
            path="albums"
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
