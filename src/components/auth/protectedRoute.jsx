import { Navigate } from "react-router-dom";
import { getToken } from "../../lib/auth/token";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!getToken();

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
