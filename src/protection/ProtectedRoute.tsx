import { Navigate } from "react-router-dom";
import { useAuthState } from "./useAuthState";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthState();

  if (loading) return <div>Loading...</div>; // avoid flashing redirect

  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
