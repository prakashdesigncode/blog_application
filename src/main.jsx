import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/Dashboard_Redux/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { handleLocalStorage } from "./Utils/customfunctions";
import "./main.scss";
import "./style.css";
import Home from "./Compounds/Home";
import { Suspense, lazy } from "react";
import { CircularProgress } from "@mui/material";

const LoginCompound = lazy(() => import("./Login"));
const DashboardCompound = lazy(() => import("./Dashboard"));
const Photos = lazy(() => import("./Compounds/Photos"));
const Posts = lazy(() => import("./Compounds/Posts"));

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
            <Suspense fallback={<CircularProgress />}>
              <CheckLoginRedirect>
                <LoginCompound />
              </CheckLoginRedirect>
            </Suspense>
          }
          path="/"
        />
        <Route
          element={
            <Suspense fallback={<CircularProgress />}>
              <CheckRedirect>
                <DashboardCompound />
              </CheckRedirect>
            </Suspense>
          }
          path="/home"
        >
          <Route
            element={
              <Suspense fallback={<CircularProgress />}>
                <CheckRedirect>
                  <Home />
                </CheckRedirect>
              </Suspense>
            }
            path="dashboard"
          />
          <Route
            element={
              <Suspense fallback={<CircularProgress />}>
                <CheckRedirect>
                  <Posts />
                </CheckRedirect>
              </Suspense>
            }
            path="posts"
          />
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
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
