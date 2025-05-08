
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50 py-4">
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold font-poppins text-idish-orange">
            i<span className="text-black">DISH</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-idish-orange transition-colors">
            Home
          </Link>
          <Link to="/browse" className="font-medium hover:text-idish-orange transition-colors">
            Browse
          </Link>
          <Link to="/chef-signup" className="font-medium hover:text-idish-orange transition-colors">
            Become a Chef
          </Link>
          <Button variant="outline" className="ml-4">
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-4 transition-transform duration-300 ease-in-out transform md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-6 items-center text-lg">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-medium hover:text-idish-orange transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/browse" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-medium hover:text-idish-orange transition-colors"
          >
            Browse
          </Link>
          <Link 
            to="/chef-signup" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-medium hover:text-idish-orange transition-colors"
          >
            Become a Chef
          </Link>
          <Button className="w-full mt-4">Login</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
