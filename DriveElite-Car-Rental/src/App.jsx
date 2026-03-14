import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Printer,
  Save,
  Trash2,
  CheckCircle,
  Info,
  Clock,
  Map,
  ArrowLeft,
  User as UserIcon,
} from "lucide-react";

import carData from "./Components/carData";
import Header from "./Components/Header";
import packageData from "./Components/packageData";
import Footer from "./Components/Footer";

export default function App() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("de_user")) || null,
  );
  const [bookings, setBookings] = useState(
    () => JSON.parse(localStorage.getItem("de_bookings")) || [],
  );
  const [bookingDates, setBookingDates] = useState({ pickup: "", return: "" });
  const [showToast, setShowToast] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, error: "" });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [driverModal, setDriverModal] = useState({ open: false, item: null });

  useEffect(() => {
    localStorage.setItem("de_user", JSON.stringify(user));
    localStorage.setItem("de_bookings", JSON.stringify(bookings));
  }, [user, bookings]);

  const handleRentNow = (item, withDriver = false) => {
    if (!user) {
      setAuthModal({ open: true, error: "" });
      return;
    }
    if (!bookingDates.pickup || !bookingDates.return) {
      alert("Please select dates first on the Home page!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsBooking(true);
    const driverFeePerDay = 500;

    setTimeout(() => {
      const d1 = new Date(bookingDates.pickup);
      const d2 = new Date(bookingDates.return);
      const diffDays =
        Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;

      let baseRent = item.id >= 100 ? item.price : item.price * diffDays;
      let totalDriverCost = withDriver ? driverFeePerDay * diffDays : 0;

      const newEntry = {
        ...item,
        bookingId: `DE-${Date.now()}`,
        rentalDays: item.id >= 100 ? "Package" : diffDays,
        withDriver: withDriver,
        driverCost: totalDriverCost,
        totalRent: baseRent + totalDriverCost,
        ...bookingDates,
      };

      setBookings([...bookings, newEntry]);
      setIsBooking(false);
      setShowToast(`${item.name} Booked!`);
      setTimeout(() => setShowToast(null), 800);
    }, 400);
  };

  return (
    <Router>
      <div className="bg-gray-50 text-gray-800 font-sans min-h-screen relative overflow-x-hidden">
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl animate-bounce italic text-xs uppercase tracking-widest">
            {showToast}
          </div>
        )}

        <Header
          user={user}
          setUser={setUser}
          bookingsCount={bookings.length}
          setAuthModal={setAuthModal}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                carData={carData}
                bookingDates={bookingDates}
                setBookingDates={setBookingDates}
                setDriverModal={setDriverModal}
                isBooking={isBooking}
              />
            }
          />
          <Route path="/packages" element={<PackagesView />} />
          <Route
            path="/tour/:id"
            element={
              <TourDetailPage
                handleRentNow={handleRentNow}
                isBooking={isBooking}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <BookingsView
                bookings={bookings}
                setBookings={setBookings}
                setSelectedInvoice={setSelectedInvoice}
                setShowToast={setShowToast}
              />
            }
          />
          <Route
            path="/contact"
            element={<ContactView setShowToast={setShowToast} />}
          />
          <Route
            path="/profile"
            element={
              <ProfileView
                user={user}
                setUser={setUser}
                setShowToast={setShowToast}
              />
            }
          />
        </Routes>

        <Footer />

        {driverModal.open && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 relative shadow-2xl text-center border-t-[12px] border-blue-600">
              <h3 className="text-2xl font-semibold mb-2 italic text-blue-800 tracking-tighter uppercase">
                Select Option
              </h3>
              <p className="text-[10px] text-gray-400 uppercase mb-8 tracking-widest font-black italic border-b pb-4">
                {driverModal.item?.name}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    handleRentNow(driverModal.item, false);
                    setDriverModal({ open: false, item: null });
                  }}
                  className="w-full py-5 bg-gray-50 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition border border-gray-100"
                >
                  Self Drive
                </button>
                <button
                  onClick={() => {
                    handleRentNow(driverModal.item, true);
                    setDriverModal({ open: false, item: null });
                  }}
                  className="w-full py-5 bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl"
                >
                  With Driver (+₹500/Day)
                </button>
              </div>
              <button
                onClick={() => setDriverModal({ open: false, item: null })}
                className="mt-8 text-[10px] font-black uppercase text-gray-400 tracking-widest"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        {authModal.open && (
          <AuthModal
            setAuthModal={setAuthModal}
            setUser={setUser}
            setShowToast={setShowToast}
          />
        )}
        {selectedInvoice && (
          <InvoiceModal
            booking={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            currentUser={user}
          />
        )}
      </div>
    </Router>
  );
}

function HomeView({
  carData,
  bookingDates,
  setBookingDates,
  setDriverModal,
  isBooking,
}) {
  const [category, setCategory] = useState("all");
  const categories = [
    { id: "all", name: "All" },
    { id: "budget", name: "Budget" },
    { id: "suv", name: "SUV & 4x4" },
    { id: "luxury", name: "Luxury" },
    { id: "electric", name: "Electric" },
  ];

  const filteredCars = useMemo(() => {
    let result = [...carData];
    if (category !== "all")
      result = result.filter((c) => c.category === category);
    return result;
  }, [category, carData]);

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-900 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden uppercase">
        <div>
          <h1 className="text-5xl md:text-6xl font-semibold mb-4 italic">
            Drive Elite
          </h1>
          <p className="text-gray-400 mb-8 max-w-xl italic underline decoration-blue-500 underline-offset-4 tracking-tighter">
            Luxury and Budget Car Rental Indore
          </p>
          <a
            href="#fleet"
            className="bg-amber-500 text-gray-900 px-8 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition inline-block text-xs italic tracking-widest"
          >
            Explore Fleet
          </a>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-800">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700 italic border-b-2 pb-2 tracking-tighter uppercase">
            Travel Dates
          </h2>
          <div className="space-y-4">
            <input
              type="date"
              value={bookingDates.pickup}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, pickup: e.target.value })
              }
              className="w-full p-4 border rounded-xl bg-gray-50 text-black uppercase"
            />
            <input
              type="date"
              value={bookingDates.return}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, return: e.target.value })
              }
              className="w-full p-4 border rounded-xl bg-gray-50 text-black  uppercase"
            />
            <a
              href="#fleet"
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl inline-block text-center shadow-lg active:scale-95 transition text-[10px] tracking-[0.2em] italic"
            >
              Refresh Rates
            </a>
          </div>
        </div>
      </section>

      {/* --- FIXED: Horizontal Scrollable Filters for Mobile --- */}
      <div id="fleet" className="w-full mb-12 px-2">
        <div className="flex lg:justify-center items-center gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap px-8 py-3 rounded-2xl font-semibold text-[10px] uppercase tracking-widest transition-all shrink-0 ${
                category === cat.id
                  ? "bg-blue-600 text-white shadow-xl scale-105 border-blue-600"
                  : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-[2rem] border-2 border-gray-100 p-4 shadow-sm hover:shadow-2xl transition group flex flex-col"
          >
            <div className="overflow-hidden rounded-2xl h-44 mb-4">
              <img
                src={car.image}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                alt={car.name}
              />
            </div>
            <h3 className="font-bold text-lg mb-1 truncate uppercase tracking-tighter">
              {car.name}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {car.specs.map((spec, i) => (
                <span
                  key={i}
                  className="text-[8px] bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-500 uppercase"
                >
                  {spec}
                </span>
              ))}
            </div>
            <p className="text-blue-600 font-semibold text-xl mb-4 ">
              ₹{car.price.toLocaleString("en-IN")}{" "}
              <span className="text-[10px] text-gray-400 font-semibold ml-1 uppercase">
                /day
              </span>
            </p>
            <button
              onClick={() => setDriverModal({ open: true, item: car })}
              disabled={isBooking}
              className="mt-auto w-full py-4 rounded-2xl font-semibold shadow-lg bg-amber-500 text-gray-900 transition uppercase text-[10px] tracking-widest "
            >
              Rent Now
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

function TourDetailPage({ handleRentNow, isBooking }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packageData.find((p) => p.id === parseInt(id));
  if (!pkg)
    return (
      <div className="text-center py-40 font-semibold uppercase italic">
        Tour Not Found!
      </div>
    );
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split("/").pop().split("?")[0].replace("watch?v=", "");
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1`;
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 font-semibold text-[10px] text-blue-600 uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Packages
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[3rem] shadow-2xl overflow-hidden border">
        <div className="h-[450px] lg:h-auto overflow-hidden relative bg-black flex items-center justify-center">
          {pkg.video ? (
            <>
              <iframe
                src={getEmbedUrl(pkg.video)}
                title={pkg.name}
                className="absolute inset-0 w-full h-full scale-[1.15] pointer-events-none"
                allow="autoplay; encrypted-media"
                style={{ border: "none" }}
              />
              <div className="absolute inset-0 z-10 bg-transparent"></div>
            </>
          ) : (
            <img
              src={pkg.image}
              className="w-full h-full object-cover"
              alt={pkg.name}
            />
          )}
        </div>
        <div className="p-12">
          <h1 className="text-4xl font-semibold italic text-blue-800 underline decoration-amber-500 underline-offset-8 mb-8 tracking-tighter uppercase">
            {pkg.name}
          </h1>
          <div className="space-y-6 mb-10">
            <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
              {pkg.details}
            </p>
            <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-600 font-semibold text-[10px] text-gray-600 uppercase italic tracking-tighter">
              •Professional Driver Included
              <br /> • Fuel Included
              <br /> • Doorstep Pick Up & Drop
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t-2 border-dashed">
            <h2 className="text-3xl font-semibold text-amber-600 ">
              ₹{pkg.price.toLocaleString("en-IN")}
            </h2>
            <button
              onClick={() => handleRentNow(pkg, true)}
              disabled={isBooking}
              className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-semibold text-xs shadow-xl active:scale-95 transition uppercase tracking-widest italic"
            >
              {isBooking ? "Wait..." : "Confirm Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackagesView() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-12 pb-20">
      <h2 className="text-3xl font-semibold mb-12 border-b-8 border-blue-600 inline-block italic tracking-tighter uppercase">
        Tour Packages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packageData.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border hover:border-blue-600 transition group flex flex-col"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={pkg.image}
                className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                alt={pkg.name}
              />
              <button
                onClick={() => navigate(`/tour/${pkg.id}`)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition flex items-center gap-2 italic uppercase"
              >
                <Info className="w-3 h-3" /> Details
              </button>
            </div>
            <div className="p-8 flex-1 flex flex-col items-start">
              <h3 className="font-semibold text-2xl mb-4  tracking-tighter uppercase">
                {pkg.name}
              </h3>
              <p className="text-amber-600 font-semibold text-3xl mb-6 ">
                ₹{pkg.price.toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => navigate(`/tour/${pkg.id}`)}
                className="mt-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-[10px] tracking-widest hover:bg-blue-700 transition w-full uppercase "
              >
                Select Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function BookingsView({
  bookings,
  setBookings,
  setSelectedInvoice,
  setShowToast,
}) {
  const deleteBooking = (id) => {
    if (window.confirm("Cancel?")) {
      setBookings(bookings.filter((b) => b.bookingId !== id));
      setShowToast("Cancelled!");
      setTimeout(() => setShowToast(null), 1000);
    }
  };
  return (
    <section className="max-w-2xl mx-auto py-20 font-semibold px-4 min-h-[60vh] uppercase">
      <h2 className="text-3xl mb-12 border-b-8 border-blue-600 inline-block italic">
        My Bookings ({bookings.length})
      </h2>
      {bookings.map((b) => (
        <div
          key={b.bookingId}
          className="bg-white p-8 rounded-[2rem] border-l-[12px] border-blue-600 shadow-xl flex justify-between items-center mb-8 gap-4 animate-in slide-in-from-left duration-300"
        >
          <div className="flex-1">
            <h4 className="text-xl mb-1 ">{b.name}</h4>
            <p className="text-[10px] text-gray-400 tracking-widest font-semibold italic">
              REF: {b.bookingId}
            </p>
            <p className="text-[10px] text-blue-600 font-bold mt-1 tracking-widest italic">
              {b.withDriver ? "Driver Included" : "Self Drive"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedInvoice(b)}
              className="bg-gray-100 p-5 rounded-2xl hover:bg-blue-600 hover:text-white transition shadow-sm"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteBooking(b.bookingId)}
              className="bg-red-50 p-5 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white transition shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
function ContactView({ setShowToast }) {
  const navigate = useNavigate();
  return (
    <section className="max-w-4xl mx-auto py-20 font-semibold px-4 uppercase">
      <h2 className="text-3xl mb-12 border-b-8 border-blue-600 inline-block italic">
        Contact Us
      </h2>
      <form
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl border"
        onSubmit={(e) => {
          e.preventDefault();
          setShowToast("Inquiry Sent!");
          navigate("/");
        }}
      >
        <input
          type="text"
          required
          placeholder="NAME"
          className="w-full p-4 bg-gray-50 border rounded-xl mb-4 font-semibold"
        />
        <input
          type="email"
          required
          placeholder="EMAIL"
          className="w-full p-4 bg-gray-50 border rounded-xl mb-4 font-semibold"
        />
        <textarea
          placeholder="MESSAGE"
          className="w-full p-4 bg-gray-50 border rounded-xl h-32 mb-4 font-semibold"
        ></textarea>
        <button className="w-full py-5 bg-blue-700 text-white rounded-2xl uppercase font-semibold transition active:scale-95 tracking-widest ">
          Send Now
        </button>
      </form>
    </section>
  );
}

function ProfileView({ user, setUser, setShowToast }) {
  const [name, setName] = useState(user?.username || "");
  const navigate = useNavigate();
  if (!user)
    return (
      <div className="text-center py-40 font-semibold italic text-red-500 underline decoration-red-200 uppercase">
        Session Required!
      </div>
    );

  return (
    <section className="max-w-md mx-auto py-20 px-4 text-center uppercase">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-[12px] border-blue-600 font-semibold">
        <h2 className="text-2xl mb-8 italic text-blue-700 underline decoration-amber-500 tracking-tighter">
          User Account
        </h2>
        <div className="space-y-6 text-left">
          <div>
            <p className="text-gray-400 mb-2 text-[10px] tracking-widest uppercase italic">
              Logged In Email
            </p>
            <p className="p-5 bg-gray-50 border rounded-xl font-bold lowercase italic text-gray-500 tracking-normal">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-2 text-[10px] tracking-widest uppercase italic">
              Display Name
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-5 border rounded-xl font-bold  tracking-tighter focus:ring-2 focus:ring-blue-600 outline-none uppercase"
              placeholder="YOUR NAME"
            />
          </div>
          <button
            onClick={() => {
              setUser({ ...user, username: name });
              setShowToast("Profile Updated!");
              setTimeout(() => setShowToast(null), 800);
              navigate("/");
            }}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl flex justify-center items-center gap-3 shadow-xl hover:bg-black transition italic tracking-widest"
          >
            <Save className="w-4 h-4" /> Update Profile
          </button>
        </div>
      </div>
    </section>
  );
}

function AuthModal({ setAuthModal, setUser, setShowToast }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const name = isSignUp ? e.target.name.value : email.split("@")[0];
    setUser({ email, username: name });
    setAuthModal({ open: false, error: "" });
    setShowToast(isSignUp ? "Account Created!" : `Welcome!`);
    setTimeout(() => setShowToast(null), 800);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md uppercase tracking-widest">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in duration-300 border-t-8 border-amber-500">
        <button
          onClick={() => setAuthModal({ open: false, error: "" })}
          className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition"
        >
          <X className="w-8 h-8" />
        </button>
        <h2 className="text-3xl mb-10 italic text-blue-700 underline decoration-amber-500 tracking-tighter">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <input
              name="name"
              type="text"
              required
              className="w-full p-5 border rounded-xl bg-gray-50 font-semibold italic uppercase tracking-tighter"
              placeholder="FULL NAME"
            />
          )}
          <input
            name="email"
            type="email"
            required
            className="w-full p-5 border rounded-xl bg-gray-50 font-semibold italic lowercase tracking-normal"
            placeholder="EMAIL@EXAMPLE.COM"
          />
          <input
            name="password"
            type="password"
            required
            className="w-full p-5 border rounded-xl bg-gray-50 font-semibold tracking-tighter italic"
            placeholder="PASSWORD"
          />
          <button
            type="submit"
            className="w-full py-6 bg-blue-700 text-white rounded-2xl shadow-xl font-semibold transition  uppercase tracking-[0.3em]"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-black text-gray-400 hover:text-blue-600 transition tracking-widest"
          >
            {isSignUp
              ? "ALREADY HAVE AN ACCOUNT? LOGIN"
              : "NEW HERE? CREATE AN ACCOUNT"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoiceModal({ booking, onClose, currentUser }) {
  const base = booking.totalRent - (booking.driverCost || 0);
  const driverCost = booking.driverCost || 0;
  const gst = booking.totalRent * 0.18;
  const total = booking.totalRent + gst;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print uppercase">
      <div
        id="invoice-pdf"
        className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl font-semibold border animate-in slide-in-from-top-10 duration-300"
      >
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center print:text-blue-600 print:bg-white print:border-b-4 print:border-blue-600">
          <div>
            <h2 className="text-2xl font-semibold italic tracking-tighter">
              DRIVE ELITE
            </h2>
            <p className="text-[10px] opacity-80 font-semibold tracking-widest italic">
              INVOICE STATEMENT
            </p>
          </div>
          <X className="cursor-pointer no-print" onClick={onClose} />
        </div>
        <div className="p-8">
          <div className="flex justify-between border-b-2 border-gray-100 pb-6 mb-8 text-[10px] tracking-[0.2em] italic">
            <div>
              <p className="text-gray-400 mb-1">Client</p>
              <p className="font-black text-xl text-gray-800 tracking-tighter italic underline decoration-blue-100">
                {currentUser?.username}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">Issued</p>
              <p className="font-black text-gray-800 italic">
                {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <div className="border-t-4 border-blue-600 pt-6 space-y-4 text-[10px] font-semibold italic tracking-tighter">
            <div className="flex justify-between text-gray-700">
              <span>Vehicle: {booking.name}</span>
              <span>₹{base.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-blue-600 border-b pb-2">
              <span>
                Chauffeur {booking.withDriver ? "(Active)" : "(Self)"}
              </span>
              <span>₹{driverCost.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-3xl font-semibold text-blue-600 pt-6 border-t-2 border-dashed tracking-tighter italic">
              <span>GRAND TOTAL</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full mt-10 py-6 bg-gray-900 text-white font-semibold tracking-[0.3em] rounded-2xl no-print shadow-2xl hover:bg-black transition text-xs italic"
          >
            Print PDF
          </button>
        </div>
      </div>
    </div>
  );
}
