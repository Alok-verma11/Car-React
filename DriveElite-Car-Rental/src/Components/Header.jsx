import React from "react";
import { Car, LogOut, Menu, X } from "lucide-react";

const Header = ({
  view,
  setView,
  user,
  setUser,
  bookingsCount,
  setAuthModal,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm no-print">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center font-bold uppercase tracking-tighter">
        {/* Logo Section */}
        <button
          onClick={() => {
            setView("home");
            setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-2xl text-blue-700 italic flex items-center"
        >
          <Car className="w-6 h-6 mr-1 not-italic" /> DRIVEELITE
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center text-sm">
          <button
            onClick={() => setView("home")}
            className={
              view === "home"
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500 transition"
            }
          >
            Home
          </button>

          {/* New Separate Packages Page Button */}
          <button
            onClick={() => setView("packages")}
            className={
              view === "packages"
                ? "text-blue-600 underline decoration-4 underline-offset-8"
                : "text-gray-800 hover:text-blue-500 transition"
            }
          >
            Packages
          </button>

          <button
            onClick={() => setView("contact")}
            className={
              view === "contact"
                ? "text-blue-600"
                : "text-gray-800 hover:text-blue-500 transition"
            }
          >
            Contact
          </button>

          {user ? (
            <>
              <button
                onClick={() => setView("bookings")}
                className={
                  view === "bookings"
                    ? "text-blue-600"
                    : "text-gray-800 hover:text-blue-500 transition"
                }
              >
                Bookings ({bookingsCount})
              </button>
              <button
                onClick={() => setView("profile")}
                className={
                  view === "profile"
                    ? "text-blue-600 flex items-center gap-2"
                    : "text-gray-800 flex items-center gap-2 hover:text-blue-500 transition"
                }
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 border border-blue-200 uppercase">
                  {user.username[0]}
                </div>
                {user.username}
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    setUser(null);
                    localStorage.clear();
                    setView("home");
                  }
                }}
                className="text-red-500 hover:scale-110 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthModal({ open: true, error: "" })}
              className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg transition hover:bg-blue-700 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-t shadow-xl transition-all duration-300 overflow-hidden ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="p-6 flex flex-col space-y-4 font-bold uppercase text-xs">
          <button
            onClick={() => {
              setView("home");
              setIsMenuOpen(false);
            }}
            className={
              view === "home" ? "text-blue-600 text-left" : "text-left"
            }
          >
            Home
          </button>
          <button
            onClick={() => {
              setView("packages");
              setIsMenuOpen(false);
            }}
            className={
              view === "packages" ? "text-blue-600 text-left" : "text-left"
            }
          >
            Tour Packages
          </button>
          <button
            onClick={() => {
              setView("contact");
              setIsMenuOpen(false);
            }}
            className={
              view === "contact" ? "text-blue-600 text-left" : "text-left"
            }
          >
            Contact
          </button>
          {user ? (
            <>
              <button
                onClick={() => {
                  setView("bookings");
                  setIsMenuOpen(false);
                }}
                className={
                  view === "bookings" ? "text-blue-600 text-left" : "text-left"
                }
              >
                My Bookings ({bookingsCount})
              </button>
              <button
                onClick={() => {
                  setUser(null);
                  setIsMenuOpen(false);
                  localStorage.clear();
                  setView("home");
                }}
                className="text-red-500 text-left flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setAuthModal({ open: true });
                setIsMenuOpen(false);
              }}
              className="bg-blue-600 text-white p-4 rounded-xl text-center shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
