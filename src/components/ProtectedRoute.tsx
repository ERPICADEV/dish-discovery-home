import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

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

  if (requiresCustomer && isChef) {
    useEffect(() => {
      toast({
        title: "Access Denied",
        description: "Please log in as a customer to place an order.",
        variant: "destructive",
      });
    }, []);
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="mb-6">Please log in as a customer to place an order.</p>
      </div>
    );
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
