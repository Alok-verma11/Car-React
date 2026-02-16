import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Printer,
  User as UserIcon,
  Save,
  Trash2,
} from "lucide-react";

import carData from "./Components/carData";
import Header from "./Components/Header";
import packageData from "./Components/packageData";
import Footer from "./Components/Footer";

export default function App() {
  const [view, setView] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [authModal, setAuthModal] = useState({ open: false, error: "" });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [bookingDates, setBookingDates] = useState({ pickup: "", return: "" });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("de_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("de_bookings");
    return saved ? JSON.parse(saved) : [];
  });

  const [tempName, setTempName] = useState(user?.username || "");

  useEffect(() => {
    localStorage.setItem("de_user", JSON.stringify(user));
    localStorage.setItem("de_bookings", JSON.stringify(bookings));
  }, [user, bookings]);

  const filteredCars = useMemo(() => {
    let result = [...carData];
    if (category !== "all")
      result = result.filter((car) => car.category === category);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [category, sortBy]);

  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const username = email.split("@")[0];
    setUser({ email, username });
    setTempName(username);
    setAuthModal({ open: false, error: "" });
  };

  const deleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      const updated = bookings.filter((b) => b.bookingId !== bookingId);
      setBookings(updated);
    }
  };

  const handleRentNow = (item) => {
    if (!user) {
      setAuthModal({ open: true, error: "Sign In Required to Book!" });
      return;
    }
    if (!bookingDates.pickup || !bookingDates.return) {
      alert("Please select dates first on the Home page!");
      setView("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const d1 = new Date(bookingDates.pickup);
    const d2 = new Date(bookingDates.return);
    const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;
    const bookingId = `DE-${Date.now()}`;
    const totalRent = item.id >= 100 ? item.price : item.price * diffDays;

    setBookings((prev) => [
      ...prev,
      {
        ...item,
        bookingId,
        rentalDays: item.id >= 100 ? "Package" : diffDays,
        totalRent,
        ...bookingDates,
      },
    ]);
    // alert("Booking Saved!");
    setView("bookings");
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <Header
        view={view}
        setView={setView}
        user={user}
        setUser={setUser}
        bookingsCount={bookings.length}
        setAuthModal={setAuthModal}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="container mx-auto px-4 py-8">
        {/* --- HOME VIEW (Fleet Only) --- */}
        {view === "home" && (
          <>
            <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-900 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase italic">
                  Drive the Best
                </h1>
                <p className="text-gray-400 mb-8 max-w-xl ">
                  Indore's #1 Car Rental. Select your dates and calculate the
                  exact rate for your journey.
                </p>
                <a
                  href="#fleet"
                  className="bg-amber-500 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition inline-block"
                >
                  Explore Fleet
                </a>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-800">
                <h2 className="text-2xl font-black mb-6 text-blue-700 italic border-b-2 pb-2 uppercase ">
                  Choose Dates
                </h2>
                <div className="space-y-4">
                  <input
                    type="date"
                    value={bookingDates.pickup}
                    onChange={(e) =>
                      setBookingDates({
                        ...bookingDates,
                        pickup: e.target.value,
                      })
                    }
                    className="w-full p-4 border rounded-xl bg-gray-50 text-black font-bold"
                  />
                  <input
                    type="date"
                    value={bookingDates.return}
                    onChange={(e) =>
                      setBookingDates({
                        ...bookingDates,
                        return: e.target.value,
                      })
                    }
                    className="w-full p-4 border rounded-xl bg-gray-50 text-black font-bold"
                  />
                  <a
                    href="#fleet"
                    className="w-full py-4 bg-blue-600 text-white font-black uppercase rounded-xl inline-block text-center shadow-lg active:scale-95 transition"
                  >
                    Refresh Rates
                  </a>
                </div>
              </div>
            </section>

            <section id="fleet">
              <h2 className="text-3xl font-black mb-10 text-center uppercase border-b-4 border-amber-500 inline-block tracking-widest italic">
                Premium Fleet
              </h2>
              <div className="flex flex-wrap justify-between items-center mb-10 font-black uppercase text-xs">
                <div className="flex flex-wrap gap-2">
                  {["all", "luxury", "suv", "budget", "electric"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-2 rounded-full transition ${
                        category === cat
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white border"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded-xl bg-white outline-none font-black"
                >
                  <option value="default">Default Sort</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-[2rem] border-2 border-gray-100 p-4 shadow-sm hover:shadow-2xl transition group"
                  >
                    <div className="overflow-hidden rounded-2xl h-44 mb-4">
                      <img
                        src={car.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        alt={car.name}
                      />
                    </div>
                    <h3 className="font-black text-lg mb-1 truncate">
                      {car.name}
                    </h3>
                    <p className="text-blue-600 font-black text-xl mb-4">
                      ₹{car.price.toLocaleString("en-IN")}
                      <span className="text-[10px] text-gray-400 font-black ml-1 uppercase">
                        /day
                      </span>
                    </p>
                    <button
                      onClick={() => handleRentNow(car)}
                      className="w-full py-4 bg-amber-500 text-gray-900 font-black uppercase rounded-2xl shadow-lg active:scale-95 transition tracking-widest text-xs"
                    >
                      Rent Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* --- SEPARATE PACKAGES VIEW --- */}
        {view === "packages" && (
          <section className="py-10">
            <h2 className="text-3xl font-black mb-12 border-b-8 border-blue-600 inline-block italic uppercase tracking-tighter">
              Indore Tour Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packageData.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border hover:border-blue-600 transition group"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={pkg.image}
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                      alt={pkg.name}
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-black text-2xl mb-2 italic tracking-tighter">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-500 text-xs font-bold mb-6 uppercase tracking-widest leading-relaxed">
                      {pkg.details}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-amber-600 font-black text-3xl">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => handleRentNow(pkg)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- BOOKINGS VIEW --- */}
        {view === "bookings" && (
          <section className="max-w-2xl mx-auto py-10 font-black uppercase tracking-tight text-gray-800">
            <h2 className="text-3xl mb-12 border-b-8 border-blue-600 inline-block italic">
              Reservations ({bookings.length})
            </h2>
            {bookings.length === 0 ? (
              <p className="text-gray-400 text-center py-20 italic">
                No active bookings found.
              </p>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="bg-white p-8 rounded-[2rem] border-l-[12px] border-blue-600 shadow-xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
                >
                  <div className="flex-1">
                    <h4 className="text-xl mb-1 tracking-tighter">{b.name}</h4>
                    <p className="text-[10px] text-gray-400 tracking-widest">
                      REF: {b.bookingId}
                    </p>
                    <p className="text-xs text-blue-500 mt-2 font-black">
                      {b.rentalDays} Day(s) • {b.pickup} to {b.return}
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
              ))
            )}
          </section>
        )}

        {/* --- CONTACT VIEW --- */}
        {view === "contact" && (
          <section className="max-w-4xl mx-auto py-10 font-black uppercase tracking-tight">
            <h2 className="text-3xl mb-12 border-b-8 border-blue-600 inline-block italic">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-6 bg-white p-8 rounded-3xl shadow-sm border">
                  <MapPin className="text-blue-600 w-10 h-10 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-widest mb-1">
                      Address
                    </p>
                    <p className="text-lg">SVGI, Khandwa Road, Indore 452020</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 bg-white p-8 rounded-3xl shadow-sm border">
                  <Phone className="text-blue-600 w-10 h-10 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-widest mb-1">
                      Direct Line
                    </p>
                    <p className="text-lg">+91 8305337***</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 bg-white p-8 rounded-3xl shadow-sm border">
                  <Mail className="text-blue-600 w-10 h-10 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-widest mb-1">
                      Email Address
                    </p>
                    <p className="text-lg lowercase font-bold tracking-normal">
                      driveelite@gmail.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <h3 className="text-xl mb-6 italic text-blue-700 underline tracking-tighter">
                  Send Inquiry
                </h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Inquiry Sent!");
                    setView("home");
                  }}
                >
                  <input
                    type="text"
                    required
                    placeholder="FULL NAME"
                    className="w-full p-4 bg-gray-50 border rounded-xl outline-none font-black uppercase"
                  />
                  <input
                    type="email"
                    required
                    placeholder="EMAIL"
                    className="w-full p-4 bg-gray-50 border rounded-xl outline-none font-black tracking-normal lowercase"
                  />
                  <textarea
                    placeholder="MESSAGE"
                    className="w-full p-4 bg-gray-50 border rounded-xl h-32 outline-none resize-none font-black uppercase"
                  ></textarea>
                  <button className="w-full py-5 bg-blue-700 text-white rounded-2xl shadow-xl uppercase font-black tracking-widest">
                    Send Now
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* --- PROFILE VIEW --- */}
        {view === "profile" && user && (
          <section className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-[12px] border-blue-600 font-black uppercase">
            <h2 className="text-2xl mb-8 flex items-center gap-2 italic text-blue-700  underline">
              Account Profile
            </h2>
            <div className="space-y-8 text-[10px] tracking-widest">
              <div>
                <p className="text-gray-400 mb-2 font-black uppercase">
                  Registered Email
                </p>
                <p className="p-4 bg-gray-50 border rounded-xl text-gray-400 lowercase font-bold tracking-normal text-xs">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2 font-black uppercase">
                  Display Name
                </p>
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full p-5 border rounded-xl shadow-inner font-black uppercase text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setUser({ ...user, username: tempName });
                  setView("home");
                  alert("Profile Updated!");
                }}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center gap-2 tracking-[0.2em] text-xs hover:bg-blue-700 transition active:scale-95 uppercase font-black"
              >
                <Save className="w-4 h-4" /> Update Profile
              </button>
            </div>
          </section>
        )}

        {/* Global Footer */}
        <Footer setView={setView} />
      </main>

      {/* Auth Modal */}
      {authModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl  uppercase tracking-widest animate-in zoom-in duration-300">
            <button
              onClick={() => setAuthModal({ open: false, error: "" })}
              className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition"
            >
              <X className="w-8 h-8" />
            </button>
            {authModal.error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] rounded-xl border-l-4 border-red-500 font-black">
                {authModal.error}
              </div>
            )}
            <h2 className="text-3xl mb-10 italic text-blue-700 underline tracking-tighter">
              Sign In
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                name="email"
                type="email"
                required
                className="w-full p-5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-600 lowercase tracking-normal font-black"
                placeholder="email@example.com"
              />
              <input
                type="password"
                required
                className="w-full p-5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-600 font-black"
                placeholder="PASSWORD"
              />
              <button
                type="submit"
                className="w-full py-6 bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-100 tracking-[0.2em] hover:bg-blue-800 transition active:scale-95 text-xs"
              >
                Sign In
              </button>
            </form>
            <p className="mt-8 text-[9px] text-gray-300 text-center border-t pt-8 italic opacity-50 tracking-widest">
              Authorized Access Portal
            </p>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          currentUser={user}
        />
      )}
    </div>
  );
}

// --- Invoice Component ---
function InvoiceModal({ booking, onClose, currentUser }) {
  const base = booking.totalRent;
  const gst = base * 0.18;
  const total = base + gst;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print">
      <div
        id="invoice-pdf"
        className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl font-black uppercase tracking-tighter border"
      >
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center print:text-blue-600 print:bg-white print:border-b-4 print:border-blue-600">
          <div>
            <h2 className="text-2xl font-black italic">DRIVEELITE</h2>
            <p className="text-[10px] opacity-80 font-black tracking-widest">
              Official Rental Statement
            </p>
          </div>
          <X className="cursor-pointer no-print" onClick={onClose} />
        </div>
        <div className="p-8">
          <div className="flex justify-between border-b-2 border-gray-100 pb-6 mb-8 text-[10px] tracking-[0.2em]">
            <div>
              <p className="text-gray-400 mb-2 font-black uppercase">
                Billed To:
              </p>
              <p className="font-black text-xl text-gray-800 tracking-tight">
                {currentUser?.username}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-2 font-black uppercase">
                Issue Date:
              </p>
              <p className="font-black text-gray-800 tracking-tight">
                {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <table className="w-full mb-10 text-xs text-left">
            <thead className="text-[10px] text-gray-400 border-b-2 uppercase tracking-widest italic font-black">
              <tr>
                <th className="pb-3">Vehicle Detail</th>
                <th className="pb-3 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 font-bold uppercase tracking-tighter">
              <tr>
                <td className="py-6">
                  {booking.name}{" "}
                  <span className="block text-[8px] text-blue-500 mt-1 font-black">
                    {booking.rentalDays} Day(s) ({booking.pickup} to{" "}
                    {booking.return})
                  </span>
                </td>
                <td className="py-6 text-right font-black">
                  ₹{base.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="border-t-4 border-blue-600 pt-6 space-y-3 text-xs tracking-tighter font-black uppercase">
            <div className="flex justify-between text-gray-400 tracking-widest">
              <span>Fare Subtotal</span>
              <span>₹{base.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-400 tracking-widest">
              <span>Taxes (GST 18%)</span>
              <span>₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-3xl font-black text-blue-600 pt-6 border-t-2 border-dashed border-gray-200 tracking-tight italic">
              <span>GRAND TOTAL</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full mt-10 py-6 bg-gray-900 text-white font-black tracking-[0.3em] rounded-2xl no-print shadow-2xl hover:bg-black transition text-xs"
          >
            Download PDF Statement
          </button>
          <p className="mt-10 text-[9px] text-gray-300 text-center uppercase tracking-[0.2em] hidden print:block border-t pt-4 italic font-black">
            DriveElite Indore - SVGI Khandwa Road. Thank you for riding with us!
          </p>
        </div>
      </div>
    </div>
  );
}
