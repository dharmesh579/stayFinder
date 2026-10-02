import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Loading from "./Loading";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
