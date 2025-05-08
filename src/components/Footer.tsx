
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold font-poppins text-idish-orange">
                i<span className="text-black">DISH</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm mt-2">
              Connecting passionate home chefs with food lovers in your community.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-idish-orange">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"></path>
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-idish-orange">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.41 10.41 0 01-3.113 1.19 4.92 4.92 0 00-8.391 4.491 13.996 13.996 0 01-10.15-5.15 4.92 4.92 0 001.525 6.574 4.95 4.95 0 01-2.23-.618v.063a4.926 4.926 0 003.95 4.827 4.996 4.996 0 01-2.225.084 4.928 4.928 0 004.6 3.42 9.864 9.864 0 01-6.115 2.108c-.398 0-.79-.023-1.175-.068a13.922 13.922 0 007.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.214-.005-.428-.014-.64.96-.695 1.795-1.562 2.452-2.55z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-idish-orange">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-idish-orange text-sm">Home</Link></li>
              <li><Link to="/browse" className="text-gray-600 hover:text-idish-orange text-sm">Browse Meals</Link></li>
              <li><Link to="/chef-signup" className="text-gray-600 hover:text-idish-orange text-sm">Become a Chef</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-idish-orange text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-idish-orange text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-idish-orange text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-idish-orange text-sm">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                <span className="block">Email: hello@idish.com</span>
              </li>
              <li className="text-gray-600 text-sm">
                <span className="block">Support: support@idish.com</span>
              </li>
            </ul>
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Subscribe to our newsletter</h4>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-white border border-gray-300 rounded-l-md px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-idish-orange focus:border-transparent"
                />
                <button className="bg-idish-orange text-white px-4 rounded-r-md hover:bg-orange-600 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} iDISH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
