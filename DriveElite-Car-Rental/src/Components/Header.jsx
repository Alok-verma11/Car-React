import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Car,
  Package,
  BookOpen,
  User as UserIcon, // Fixed: Standardized icon name
  Phone,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Header({
  user,
  setUser,
  bookingsCount,
  setAuthModal,
  isMenuOpen,
  setIsMenuOpen,
}) {
  const location = useLocation();

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Fleet", path: "/", icon: <Car className="w-4 h-4" /> },
    {
      name: "Packages",
      path: "/packages",
      icon: <Package className="w-4 h-4" />,
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: <BookOpen className="w-4 h-4" />,
      count: bookingsCount,
    },
    { name: "Contact", path: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 font-semibold uppercase tracking-tighter shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition shadow-lg shadow-blue-100">
            <Car className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl italic text-blue-800 tracking-tighter">
            Drive<span className="text-amber-500">Elite</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] transition-all relative ${
                isActive(link.path)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              {link.name}
              {link.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">
                  {link.count}
                </span>
              )}
            </Link>
          ))}

          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] transition ${
                  isActive("/profile")
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {/* Fixed: Use UserIcon here consistently */}
                <UserIcon className="w-4 h-4 text-blue-600" />
                {user.username}
              </Link>
              <button
                onClick={() => {
                  setUser(null);
                  localStorage.removeItem("de_user");
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal({ open: true, error: "" })}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] hover:bg-blue-600 transition shadow-xl"
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 bg-gray-100 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-sm ${
                  isActive(link.path) ? "bg-blue-600 text-white" : "bg-gray-50"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            ))}

            {/* Fixed Conditional Logic for Mobile */}
            {user ? (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold uppercase"
              >
                <UserIcon className="w-5 h-5" /> My Profile
              </Link>
            ) : (
              <button
                onClick={() => {
                  setAuthModal({ open: true, error: "" });
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-4 p-4 bg-gray-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest text-left"
              >
                <UserIcon className="w-5 h-5" /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
