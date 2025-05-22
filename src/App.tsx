import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ChefDashboard from "./pages/ChefDashboard";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Hostings from "./pages/Hostings";
import OrderDish from "./pages/OrderDish";
import ChefProfile from "./pages/ChefProfile";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import BookHosting from "./pages/BookHosting";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/hostings" element={<Hostings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route 
                path="/order/:dishId" 
                element={
                  <ProtectedRoute requiresCustomer={true}>
                    <OrderDish />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chef/:chefId" 
                element={
                  <ProtectedRoute>
                    <ChefProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiresChef={true}>
                    <ChefDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute requiresCustomer={true}>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/book-hosting/:hostingId" 
                element={
                  <ProtectedRoute requiresCustomer={true}>
                    <BookHosting />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
