
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Sun, Moon, LogOut, ShoppingBag, Home, Search, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout, isChef, isCustomer } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "ID";

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-900 shadow-sm z-50 py-4">
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold font-poppins text-idish-orange dark:text-idish-orange">
            i<span className="text-black dark:text-white">DISH</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange">
            Home
          </Link>
          <Link to="/browse" className="font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange">
            Browse
          </Link>
          
          {!isLoggedIn ? (
            <>
              <Link to="/chef-signup" className="font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange">
                Become a Chef
              </Link>
              <Link to="/login">
                <Button variant="outline" className="ml-4">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              {isChef && (
                <Link to="/dashboard" className="font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange">
                  Dashboard
                </Link>
              )}
              
              {isCustomer && (
                <Link to="/orders" className="font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange">
                  My Orders
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.user_metadata?.role || "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isChef && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <ChefHat className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  {isCustomer && (
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="ml-2"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-20 px-4 transition-transform duration-300 ease-in-out transform md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-6 items-center text-lg">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link 
            to="/browse" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange"
          >
            <Search size={20} />
            <span>Browse</span>
          </Link>
          
          {!isLoggedIn ? (
            <>
              <Link 
                to="/chef-signup" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange"
              >
                <ChefHat size={20} />
                <span>Become a Chef</span>
              </Link>
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link 
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-2 border-t border-b py-4 w-full">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <p className="font-medium dark:text-white">{user?.email}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.user_metadata?.role || "User"}
                </p>
              </div>
              
              {isChef && (
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange"
                >
                  <ChefHat size={20} />
                  <span>Chef Dashboard</span>
                </Link>
              )}
              
              {isCustomer && (
                <Link 
                  to="/orders" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 font-medium hover:text-idish-orange transition-colors dark:text-white dark:hover:text-idish-orange"
                >
                  <ShoppingBag size={20} />
                  <span>My Orders</span>
                </Link>
              )}
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
