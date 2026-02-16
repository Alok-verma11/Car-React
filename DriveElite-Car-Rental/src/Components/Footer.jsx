import React from 'react'
import { Car, MapPin, Phone, Mail } from 'lucide-react';

const Footer = ({ setView }) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 no-print mt-20 border-t-8 border-blue-600">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
        {/* Column 1: Brand Identity */}
        <div className="space-y-4">
          <h3 className="text-3xl font-black italic tracking-tighter text-blue-500 uppercase">
            DRIVEELITE
          </h3>
          <p className="text-gray-400 text-xs font-bold leading-relaxed tracking-wide">
            INDORE'S PREMIER CAR RENTAL SERVICE. OFFERING A CURATED FLEET OF
            LUXURY AND BUDGET VEHICLES FOR EVERY JOURNEY.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition cursor-pointer shadow-lg">
              <Phone className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition cursor-pointer shadow-lg">
              <Mail className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-amber-500 underline decoration-blue-600 decoration-4 underline-offset-8">
            Navigation
          </h4>
          <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
            <li>
              <button
                onClick={() => setView("home")}
                className="hover:text-blue-500 transition text-left"
              >
                Home
              </button>
            </li>
            <li>
              <a
                href="#fleet"
                onClick={() => setView("home")}
                className="hover:text-blue-500 transition block"
              >
                Our Fleet
              </a>
            </li>
            <li>
              <a
                href="#packages"
                onClick={() => setView("home")}
                className="hover:text-blue-500 transition block"
              >
                Tour Packages
              </a>
            </li>
            <li>
              <button
                onClick={() => setView("contact")}
                className="hover:text-blue-500 transition text-left"
              >
                Get In Touch
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Local HQ (SVGI) */}
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-amber-500 underline decoration-blue-600 decoration-4 underline-offset-8">
            Headquarters
          </h4>
          <div className="space-y-5 text-[11px] font-black uppercase tracking-tight">
            <p className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="leading-tight">
                SVGI, Khandwa Road,
                <br />
                Indore, MP 452020
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-500 shrink-0" />
              <span>+91 8305337***</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="lowercase tracking-normal">
                driveelite@gmail.com
              </span>
            </p>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-amber-500 underline decoration-blue-600 decoration-4 underline-offset-8">
            Stay Updated
          </h4>
          <p className="text-[10px] text-gray-500 mb-6 font-bold">
            SUBSCRIBE FOR EXCLUSIVE OFFERS AND NEW FLEET UPDATES.
          </p>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="EMAIL@EXAMPLE.COM"
              className="w-full p-4 bg-gray-800 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="w-full py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-xl hover:bg-blue-700 transition active:scale-95">
              Join Now
            </button>
          </form>
        </div>
      </div>

      {/* Project Footer Note */}
      <div className="container mx-auto px-6 mt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] gap-6">
        <p>© 2026 DRIVEELITE RENTAL. DESIGNED BY ALOK.</p>
        <div className="flex gap-8 italic">
          <span className="hover:text-blue-500 cursor-pointer transition">
            Privacy Policy
          </span>
          <span className="hover:text-blue-500 cursor-pointer transition">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
