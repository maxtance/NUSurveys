import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/Auth";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  //console.log(user);
  return user ? children : <Navigate to="/login" />;
}
