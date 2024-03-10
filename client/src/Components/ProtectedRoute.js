import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";

// authentication checker
const ProtectedRoute = ({ children }) => {
  const { user } = UserAuth();

  // if user doesnt exist, redirect to authentication
  if (!user) {
    return <Navigate to="/authentication" />;
  }

  // else return children
  return children;
};

export default ProtectedRoute;
