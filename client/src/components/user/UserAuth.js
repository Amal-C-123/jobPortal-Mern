import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserAuth = () => {
  const userToken = localStorage.getItem("userToken");
  return userToken ? <Outlet /> : <Navigate to="/login" />;
};

const AvoidLogdUser = () => {
  const userToken = localStorage.getItem("userToken");
  return !userToken ? <Outlet /> : <Navigate to="/feed" />;
};

export { UserAuth, AvoidLogdUser };
