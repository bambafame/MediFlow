import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function RoleRoute({ allowedRoles, children }) {
  const { auth } = useAuth();

  if (!allowedRoles.includes(auth?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
