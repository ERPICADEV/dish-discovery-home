
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresChef?: boolean;
  requiresCustomer?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiresChef = false, 
  requiresCustomer = false 
}: ProtectedRouteProps) => {
  const { isLoggedIn, isChef, isCustomer } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiresChef && !isChef) {
    return <Navigate to="/" replace />;
  }

  if (requiresCustomer && !isCustomer) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
