import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  X,
  Printer,
  Save,
  Trash2,
  Info,
  ArrowLeft,
  User as UserIcon,
  ShieldCheck,
  Upload,
  FileCheck,
  ArrowRight,
  Menu,
  Car,
  Package,
  BookOpen,
  LogOut,
} from "lucide-react";

// --- Appwrite Imports ---
import {
  account,
  databases,
  DATABASE_ID,
  storage,
  BUCKET_ID,
  BOOKINGS_COLLECTION_ID,
  ID,
} from "./appwriteConfig";

import carData from "./Components/carData";
import Header from "./Components/Header";
import packageData from "./Components/packageData";
import Footer from "./Components/Footer";

export default function App() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingDates, setBookingDates] = useState({ pickup: "", return: "" });
  const [showToast, setShowToast] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, error: "" });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [driverModal, setDriverModal] = useState({ open: false, item: null });

  useEffect(() => {
    const init = async () => {
      try {
        const session = await account.get();
        setUser({
          email: session.email,
          username: session.name,
          id: session.$id,
        });
        fetchBookings(session.$id);
      } catch (err) {
        setUser(null);
      }
    };
    init();
  }, []);

  const fetchBookings = async (userId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKINGS_COLLECTION_ID,
      );
      const userBookings = response.documents.filter(
        (doc) => doc.userId === userId,
      );
      setBookings(userBookings);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2000);
  };

  return (
    <Router>
      <div className="bg-gray-50 text-gray-800 font-sans min-h-screen relative overflow-x-hidden">
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl animate-bounce italic text-xs uppercase tracking-widest text-center">
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
                user={user}
                setAuthModal={setAuthModal}
              />
            }
          />
          <Route path="/packages" element={<PackagesView />} />
          <Route
            path="/tour/:id"
            element={
              <TourDetailPage
                user={user}
                setAuthModal={setAuthModal}
                bookingDates={bookingDates}
              />
            }
          />
          <Route
            path="/upload-docs"
            element={
              <DocumentUploadView
                triggerToast={triggerToast}
                user={user}
                fetchBookings={fetchBookings}
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
                triggerToast={triggerToast}
              />
            }
          />
          <Route
            path="/contact"
            element={<ContactView triggerToast={triggerToast} />}
          />
          <Route
            path="/profile"
            element={
              <ProfileView
                user={user}
                setUser={setUser}
                triggerToast={triggerToast}
              />
            }
          />
          <Route
            path="/admin-control-panel"
            element={
              // Check yahan bhi rahega aur data niche bhi jayega
              user && user.email === "vaalok185@gmail.com" ? (
                <AdminView user={user} /> // <--- Yahan user={user} likhna zaroori hai
              ) : (
                <div className="py-40 text-center font-black uppercase italic text-red-600">
                  403: Access Denied. Admin Only!
                </div>
              )
            }
          />
        </Routes>

        <Footer />

        {driverModal.open && (
          <DriverSelectionModal
            item={driverModal.item}
            onClose={() => setDriverModal({ open: false, item: null })}
            bookingDates={bookingDates}
          />
        )}
        {authModal.open && (
          <AuthModal
            setAuthModal={setAuthModal}
            setUser={setUser}
            triggerToast={triggerToast}
            fetchBookings={fetchBookings}
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

// --- HomeView ---
function HomeView({
  carData,
  bookingDates,
  setBookingDates,
  setDriverModal,
  user,
  setAuthModal,
}) {
  const [category, setCategory] = useState("all");
  const filteredCars = useMemo(
    () =>
      category === "all"
        ? carData
        : carData.filter((c) => c.category === category),
    [category, carData],
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-900 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden uppercase font-semibold">
        <div>
          <h1 className="text-5xl md:text-6xl font-semibold mb-4 italic">
            Drive Elite
          </h1>
          <p className="text-gray-400 mb-8 max-w-xl italic underline decoration-blue-500 underline-offset-4 tracking-tighter">
            Luxury and Budget Car Rental Indore
          </p>
          <button
            onClick={() =>
              document
                .getElementById("fleet")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="bg-amber-500 text-gray-900 px-8 py-4 rounded-2xl font-semibold shadow-xl text-xs italic tracking-widest"
          >
            Explore Fleet
          </button>
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
              className="w-full p-4 border rounded-xl bg-gray-50 text-black uppercase font-black"
            />
            <input
              type="date"
              value={bookingDates.return}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, return: e.target.value })
              }
              className="w-full p-4 border rounded-xl bg-gray-50 text-black uppercase font-black"
            />
          </div>
        </div>
      </section>

      <div
        id="fleet"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20"
      >
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-[2rem] border-2 border-gray-100 p-4 shadow-sm hover:shadow-2xl transition flex flex-col font-semibold uppercase"
          >
            <div className="overflow-hidden rounded-2xl h-44 mb-4">
              <img
                src={car.image}
                className="w-full h-full object-cover"
                alt={car.name}
              />
            </div>
            <h3 className="font-bold text-lg mb-1 truncate tracking-tighter">
              {car.name}
            </h3>
            <p className="text-blue-600 text-xl mb-4 italic">
              ₹{car.price.toLocaleString("en-IN")}{" "}
              <span className="text-[10px] text-gray-400">/day</span>
            </p>
            <button
              onClick={() =>
                !user
                  ? setAuthModal({ open: true })
                  : setDriverModal({ open: true, item: car })
              }
              className="mt-auto w-full py-4 rounded-2xl bg-amber-500 text-gray-900 text-[10px] tracking-widest italic font-semibold shadow-lg"
            >
              Rent Now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

// --- PackagesView (RESTORED) ---
function PackagesView() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-12 pb-20 uppercase font-semibold">
      <h2 className="text-3xl font-semibold mb-12 border-b-8 border-blue-600 inline-block italic tracking-tighter">
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
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] shadow-lg italic"
              >
                Details
              </button>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-semibold text-2xl mb-4 tracking-tighter">
                {pkg.name}
              </h3>
              <p className="text-amber-600 text-3xl mb-6 italic">
                ₹{pkg.price.toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => navigate(`/tour/${pkg.id}`)}
                className="mt-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] tracking-widest w-full italic"
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

// --- TourDetailPage (RESTORED) ---
function TourDetailPage({ user, setAuthModal, bookingDates }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packageData.find((p) => p.id === parseInt(id));
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split("/").pop().split("?")[0].replace("watch?v=", "");
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1`;
  };
  if (!pkg)
    return <div className="text-center py-40 font-black">Tour Not Found!</div>;

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500 uppercase font-semibold">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-[10px] text-blue-600 tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Packages
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[3rem] shadow-2xl overflow-hidden border">
        <div className="h-[450px] lg:h-auto overflow-hidden relative bg-black flex items-center justify-center">
          {pkg.video ? (
            <iframe
              src={getEmbedUrl(pkg.video)}
              title={pkg.name}
              className="absolute inset-0 w-full h-full scale-[1.15] pointer-events-none"
              allow="autoplay; encrypted-media"
              style={{ border: "none" }}
            />
          ) : (
            <img src={pkg.image} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-12">
          <h1 className="text-4xl font-semibold italic text-blue-800 underline decoration-amber-500 underline-offset-8 mb-8 tracking-tighter">
            {pkg.name}
          </h1>
          <p className="text-sm font-bold text-gray-700 leading-relaxed italic mb-10">
            {pkg.details}
          </p>
          <div className="flex items-center justify-between pt-8 border-t-2 border-dashed">
            <h2 className="text-3xl font-semibold text-amber-600 ">
              ₹{pkg.price.toLocaleString("en-IN")}
            </h2>
            <button
              onClick={() =>
                !user
                  ? setAuthModal({ open: true })
                  : navigate("/upload-docs", {
                      state: {
                        tempBooking: {
                          ...pkg,
                          totalRent: pkg.price,
                          withDriver: true,
                          ...bookingDates,
                        },
                      },
                    })
              }
              className="bg-blue-700 text-white px-10 py-5 rounded-2xl text-xs shadow-xl italic uppercase"
            >
              Book Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DocumentUploadView ---
function DocumentUploadView({ triggerToast, user, fetchBookings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState({ aadhar: null, license: null });
  const [showPayment, setShowPayment] = useState(false); // Payment Modal State
  const [isProcessing, setIsProcessing] = useState(false); // Loading State

  const pending = location.state?.tempBooking;

  if (!pending)
    return (
      <div className="py-40 text-center font-black uppercase italic">
        No Booking Data Found
      </div>
    );

  // --- YE HAI ASLI MAGIC: PAYMENT SUCCESS HONE KE BAAD CHALEGA ---
  const handleFinalCloudSave = async () => {
    setIsProcessing(true);
    try {
      // 1. Aadhar Card Upload (Storage)
      const aadharRes = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        files.aadhar,
      );

      // 2. License Upload (Storage)
      const licenseRes = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        files.license,
      );

      // 3. Database mein Booking save (Saari details ke saath)
      await databases.createDocument(
        DATABASE_ID,
        BOOKINGS_COLLECTION_ID,
        ID.unique(),
        {
          carName: pending.name,
          totalRent: parseInt(pending.totalRent),
          pickupDate: pending.pickup,
          returnDate: pending.return,
          userId: user.id,
          userName: user.username,
          withDriver: pending.withDriver,
          aadharFileId: aadharRes.$id,
          licenseFileId: licenseRes.$id,
        },
      );

      triggerToast("Payment Success & Booking Confirmed!");
      fetchBookings(user.id);
      navigate("/bookings");
    } catch (err) {
      alert("Cloud Error: " + err.message);
      setIsProcessing(false);
      setShowPayment(false);
    }
  };

  // Pehle check karein ki files hain ya nahi
  const startPaymentProcess = () => {
    if (!files.aadhar || !files.license)
      return alert("Bhai, pehle Aadhar aur License toh upload karo!");
    setShowPayment(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 uppercase font-black text-center italic relative">
      <div className="bg-white rounded-[3rem] shadow-2xl border-t-[12px] border-blue-600 p-12">
        <h2 className="text-4xl mb-10 tracking-tighter">1. Verify Identity</h2>

        {/* Document Selection UI */}
        <div className="grid grid-cols-2 gap-8 mb-10 not-italic">
          <div className="relative h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-all overflow-hidden cursor-pointer">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={(e) =>
                setFiles({ ...files, aadhar: e.target.files[0] })
              }
            />
            <div className="z-10 flex flex-col items-center">
              <Upload
                className={
                  files.aadhar
                    ? "text-green-600 w-8 h-8"
                    : "text-gray-400 w-8 h-8"
                }
              />
              <p className="text-[10px] mt-3 font-bold">
                {files.aadhar ? files.aadhar.name : "SELECT AADHAR CARD"}
              </p>
            </div>
          </div>

          <div className="relative h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-all overflow-hidden cursor-pointer">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={(e) =>
                setFiles({ ...files, license: e.target.files[0] })
              }
            />
            <div className="z-10 flex flex-col items-center">
              <Upload
                className={
                  files.license
                    ? "text-green-600 w-8 h-8"
                    : "text-gray-400 w-8 h-8"
                }
              />
              <p className="text-[10px] mt-3 font-bold">
                {files.license ? files.license.name : "SELECT DRIVING LICENSE"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={startPaymentProcess}
          className="w-full py-6 bg-blue-700 text-white rounded-2xl tracking-[0.2em] shadow-xl hover:bg-black transition-all"
        >
          PROCEED TO PAYMENT
        </button>
      </div>

      {/* --- STEP 2: PROFESSIONAL PAYMENT MODAL --- */}
      {showPayment && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 not-italic">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-3xl overflow-hidden border-t-[12px] border-green-500 animate-in zoom-in duration-300">
            <div className="p-10 text-center">
              <h3 className="text-2xl font-black italic uppercase mb-2">
                Secure Gateway
              </h3>
              <p className="text-[9px] text-gray-400 tracking-widest uppercase mb-8">
                Indore Digital Rental Service
              </p>

              <div className="bg-green-50 p-6 rounded-3xl mb-8 border-2 border-dashed border-green-200">
                <p className="text-green-800 text-[10px] font-bold uppercase mb-1">
                  Total Payable Amount
                </p>
                <p className="text-4xl font-black text-green-700 italic">
                  ₹{pending.totalRent.toLocaleString()}
                </p>
              </div>

              {!isProcessing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="CARD NUMBER (XXXX XXXX XXXX XXXX)"
                    className="w-full p-4 bg-gray-100 rounded-xl text-[10px] font-bold border-none outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="EXP (MM/YY)"
                      className="p-4 bg-gray-100 rounded-xl text-[10px] font-bold"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      className="p-4 bg-gray-100 rounded-xl text-[10px] font-bold"
                    />
                  </div>
                  <button
                    onClick={handleFinalCloudSave}
                    className="w-full py-6 bg-green-600 text-white rounded-2xl font-black italic tracking-widest hover:bg-black transition-all shadow-xl"
                  >
                    CONFIRM & PAY NOW
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-[9px] text-gray-400 font-bold uppercase underline"
                  >
                    Cancel Transaction
                  </button>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center">
                  <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="text-xs font-black animate-pulse text-green-700 uppercase italic">
                    Verifying Payment with Cloud...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- ContactView (RESTORED) ---
function ContactView({ triggerToast }) {
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
          triggerToast("Inquiry Sent!");
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
        />
        <button className="w-full py-5 bg-blue-700 text-white rounded-2xl uppercase font-semibold tracking-widest">
          Send Now
        </button>
      </form>
    </section>
  );
}

// --- InvoiceModal (RESTORED ORIGINAL) ---
function InvoiceModal({ booking, onClose, currentUser }) {
  const base = booking.totalRent - (booking.driverCost || 0);
  const gst = booking.totalRent * 0.18;
  const total = booking.totalRent + gst;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print uppercase font-semibold">
      <div
        id="invoice-pdf"
        className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl border"
      >
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center print:text-blue-600 print:bg-white print:border-b-4">
          <div>
            <h2 className="text-2xl italic tracking-tighter">DRIVE ELITE</h2>
            <p className="text-[10px] opacity-80">INVOICE STATEMENT</p>
          </div>
          <X className="cursor-pointer no-print" onClick={onClose} />
        </div>
        <div className="p-8">
          <div className="flex justify-between border-b pb-6 mb-8 text-[10px] italic">
            <div>
              <p className="text-gray-400">Client</p>
              <p className="font-black text-xl tracking-tighter">
                {currentUser?.username}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Issued</p>
              <p className="font-black">
                {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <div className="space-y-4 text-[10px] italic">
            <div className="flex justify-between">
              <span>Vehicle: {booking.carName || booking.name}</span>
              <span>₹{base.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-blue-600 border-b pb-2">
              <span>Driver Option</span>
              <span>Active</span>
            </div>
            <div className="flex justify-between text-3xl text-blue-600 pt-6 border-t-2 border-dashed italic">
              <span>TOTAL</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full mt-10 py-6 bg-gray-900 text-white rounded-2xl no-print italic uppercase text-xs tracking-[0.3em]"
          >
            Print PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// --- AuthModal & Helper Mods ---
function DriverSelectionModal({ item, onClose, bookingDates }) {
  const navigate = useNavigate();
  const handleGo = (withDriver) => {
    const d1 = new Date(bookingDates.pickup);
    const d2 = new Date(bookingDates.return);
    const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;
    const cost = withDriver ? 500 * diff : 0;
    const tempBooking = {
      ...item,
      withDriver,
      totalRent: item.price * diff + cost,
      ...bookingDates,
    };
    onClose();
    navigate("/upload-docs", { state: { tempBooking } });
  };
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md italic font-black uppercase">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-3xl border-t-[12px] border-blue-600">
        <h3 className="text-3xl text-blue-900 mb-8 italic">Driver Support?</h3>
        <button
          onClick={() => handleGo(false)}
          className="w-full py-4 bg-gray-50 border rounded-xl mb-4 text-[10px]"
        >
          Self Drive
        </button>
        <button
          onClick={() => handleGo(true)}
          className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px]"
        >
          With Driver
        </button>
      </div>
    </div>
  );
}

function AuthModal({ setAuthModal, setUser, triggerToast, fetchBookings }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state add ki hai

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); // Button ko disable karne ke liye

    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = isSignUp ? e.target.name.value : "";

    try {
      // 1. Purana session saaf karein (Handle error silently)
      try {
        await account.deleteSession("current");
      } catch (sErr) {
        // No session to delete, ignore
      }

      // 2. Agar Register kar raha hai
      if (isSignUp) {
        await account.create(ID.unique(), email, password, name);
        // Chota sa delay taaki Appwrite backend update ho jaye
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // 3. Login Process
      await account.createEmailPasswordSession(email, password);

      // 4. User data fetch karein
      const res = await account.get();

      const userData = {
        email: res.email,
        username: res.name,
        id: res.$id,
      };

      // State aur LocalStorage update karein (Consistency ke liye)
      setUser(userData);
      localStorage.setItem("de_user", JSON.stringify(userData));

      fetchBookings(res.$id);
      setAuthModal({ open: false });
      triggerToast(isSignUp ? "Account Created!" : "Welcome Back!");
    } catch (err) {
      console.error("Auth Error:", err.message);
      // Agar error aaye toh alert dikhayein taaki pata chale kya galat hai
      alert(
        err.message === "Invalid credentials"
          ? "Ghalat Email ya Password hai!"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 italic font-black uppercase">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-3xl text-center border-t-[12px] border-blue-600 animate-in zoom-in duration-200">
        <h2 className="text-4xl mb-10 text-blue-800 italic underline">
          {isSignUp ? "Register" : "Sign In"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <input
              name="name"
              placeholder="FULL NAME"
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="MAIL@DOMAIN.COM"
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="PASSWORD"
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] outline-none focus:ring-2 focus:ring-blue-600"
            required
            minLength={8} // Appwrite requires min 8 chars
          />

          <button
            disabled={loading}
            className={`w-full py-6 rounded-2xl text-xs uppercase transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Authorizing..." : "Authorize"}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-8 text-[9px] text-slate-400 hover:text-blue-600 transition"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Need an account? Switch to Register"}
        </button>
      </div>
    </div>
  );
}

function BookingsView({
  bookings,
  setBookings,
  setSelectedInvoice,
  triggerToast,
}) {
  // --- Cancel Booking Logic ---
  const handleCancel = async (docId) => {
    if (window.confirm("Do you really want to cancel this booking?")) {
      try {
        // Appwrite Cloud se delete karein
        await databases.deleteDocument(
          DATABASE_ID,
          BOOKINGS_COLLECTION_ID,
          docId,
        );

        setBookings(bookings.filter((b) => b.$id !== docId));

        triggerToast("Booking Cancelled Successfully!");
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-20 px-4 min-h-[60vh] uppercase font-bold text-center md:text-left italic">
      <h2 className="text-3xl mb-12 border-b-8 border-blue-600 inline-block italic tracking-tighter">
        My Records ({bookings.length})
      </h2>

      {bookings.length === 0 && (
        <div className="py-20 text-gray-400 italic text-xl">
          No active bookings found in cloud.
        </div>
      )}

      {bookings.map((b) => (
        <div
          key={b.$id}
          className="bg-white p-8 rounded-[2rem] border-l-[12px] border-blue-600 shadow-xl flex justify-between items-center mb-8 gap-4 transition hover:scale-[1.02]"
        >
          <div>
            <h4 className="text-xl mb-1 tracking-tighter text-slate-800">
              {b.carName}
            </h4>
            <p className="text-[10px] text-gray-400 italic font-medium">
              REF: {b.$id} | DATE: {b.pickupDate}
            </p>
          </div>

          <div className="flex gap-3">
            {/* Invoice/Print Button */}
            <button
              onClick={() => setSelectedInvoice(b)}
              className="bg-gray-100 p-5 rounded-2xl hover:bg-blue-600 hover:text-white transition shadow-sm"
            >
              <Printer className="w-5 h-5" />
            </button>

            {/* Cancel/Delete Button */}
            <button
              onClick={() => handleCancel(b.$id)}
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

function ProfileView({ user, setUser, triggerToast }) {
  const [name, setName] = useState(user?.username || "");
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="text-center py-40 italic text-red-500 uppercase font-black">
        Session Required!
      </div>
    );

  return (
    <section className="max-w-md mx-auto py-20 px-4 uppercase font-semibold text-center">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-[12px] border-blue-600">
        <h2 className="text-2xl mb-8 italic text-blue-700 underline decoration-amber-500 uppercase">
          Profile Settings
        </h2>
        <div className="space-y-6 text-left">
          <p className="text-[10px] text-gray-400 italic">
            Email: <span className="text-gray-800 lowercase">{user.email}</span>
          </p>
          <p className="text-[10px] text-gray-400 italic">
            Phone: <span className="text-gray-800">{user.phone || "N/A"}</span>
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-5 border rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => {
              setUser({ ...user, username: name });
              triggerToast("Updated!");
              navigate("/");
            }}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl italic tracking-widest uppercase hover:bg-black transition-all"
          >
            Update Profile
          </button>
        </div>
      </div>
    </section>
  );
}

function AdminView({ user }) {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.email !== "vaalok185@gmail.com") {
    return (
      <div className="py-40 text-center uppercase font-black">
        Unauthorized Access
      </div>
    );
  }

  // 1. Fetch All Bookings
  const fetchAll = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKINGS_COLLECTION_ID,
      );
      setAllBookings(response.documents);
      setLoading(false);
    } catch (err) {
      alert("Admin Error: " + err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getFilePreview = (fileId) =>
    fileId ? storage.getFileView(BUCKET_ID, fileId) : "#";

  // 2. Admin Delete Logic
  const deleteBooking = async (docId, aadharId, licenseId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          BOOKINGS_COLLECTION_ID,
          docId,
        );
        if (aadharId) await storage.deleteFile(BUCKET_ID, aadharId);
        if (licenseId) await storage.deleteFile(BUCKET_ID, licenseId);
        setAllBookings(allBookings.filter((b) => b.$id !== docId));
        alert("Deleted!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="py-40 text-center font-black italic">
        LOADING ADMIN DATABASE...
      </div>
    );

  return (
    <section className="container mx-auto px-4 py-20 uppercase font-bold italic">
      <h2 className="text-4xl border-b-8 border-red-600 inline-block mb-10 italic">
        Master Admin
      </h2>
      <div className="overflow-x-auto bg-white rounded-[2rem] shadow-2xl border">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white text-[9px]">
            <tr>
              <th className="p-6">USER</th>
              <th className="p-6">DOCS</th>
              <th className="p-6">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((b) => (
              <tr key={b.$id} className="border-b">
                <td className="p-6">
                  {b.userName} <br />{" "}
                  <span className="text-gray-400 text-[9px]">{b.carName}</span>
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <a
                      href={getFilePreview(b.aadharFileId)}
                      target="_blank"
                      className="bg-blue-600 text-white p-2 rounded text-[8px]"
                    >
                      AADHAR
                    </a>
                    <a
                      href={getFilePreview(b.licenseFileId)}
                      target="_blank"
                      className="bg-blue-600 text-white p-2 rounded text-[8px]"
                    >
                      LICENSE
                    </a>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <button
                    onClick={() =>
                      deleteBooking(b.$id, b.aadharFileId, b.licenseFileId)
                    }
                    className="text-red-500"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PaymentModal({ totalAmount, onConfirm, onClose }) {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Asli API call ki jagah hum 2 second ka delay denge (Simulation)
    setTimeout(() => {
      setProcessing(false);
      onConfirm(); // Payment successful, ab booking save hogi
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 uppercase italic font-black">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-3xl border-t-[12px] border-green-500">
        <div className="p-10 text-center">
          <h2 className="text-3xl mb-2 text-slate-900 italic">
            Secure Checkout
          </h2>
          <p className="text-[10px] text-gray-400 mb-8 tracking-widest">
            INDORE GATEWAY SECURED
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border-2 border-dashed">
            <p className="text-gray-500 text-[10px] mb-1">TOTAL PAYABLE</p>
            <p className="text-4xl text-green-600 tracking-tighter">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>

          {!processing ? (
            <div className="space-y-4">
              <input
                placeholder="CARD NUMBER"
                className="w-full p-4 bg-gray-100 rounded-xl text-[10px] border-none outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="MM/YY"
                  className="p-4 bg-gray-100 rounded-xl text-[10px]"
                />
                <input
                  placeholder="CVV"
                  type="password"
                  className="p-4 bg-gray-100 rounded-xl text-[10px]"
                />
              </div>
              <button
                onClick={handlePay}
                className="w-full py-6 bg-green-500 text-white rounded-2xl shadow-xl hover:bg-black transition-all tracking-[0.2em]"
              >
                CONFIRM & PAY
              </button>
              <button
                onClick={onClose}
                className="text-[9px] text-gray-400 underline"
              >
                Cancel Transaction
              </button>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm animate-pulse text-green-600">
                VERIFYING WITH BANK...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}