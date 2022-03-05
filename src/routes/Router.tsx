import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import BasicLayout from "@/layouts/BasicLayout";

import NonAutorizedRoute from "./NonAutorizedRoute";
import PrivateRoute from "./PrivateRoute";

const Login = React.lazy(() => import("@/pages/login"));
const Register = React.lazy(() => import("@/pages/register"));
const Home = React.lazy(() => import("@/pages"));

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BasicLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
        </Route>
        <Route
          path="/auth"
          element={
            <NonAutorizedRoute>
              <BasicLayout />
            </NonAutorizedRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
