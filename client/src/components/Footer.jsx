import { Headset, Mail, Shield, Star, Truck } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Footer() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const stars = [
    { id: 1, color: "text-green-600" },
    { id: 2, color: "text-green-600" },
    { id: 3, color: "text-green-600" },
    { id: 4, color: "text-green-600" },
    { id: 5, color: "text-red-400" },
  ];

  return (
    <>
      <div className="min-h-[95vh] bg-linear-120 from-[#155daf] to-[#155ae3] flex flex-col justify-between">
        
        {/* Newsletter Section */}
        <div className="bg-[#8DA9C4] px-6 py-8 md:px-20 lg:px-40 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-2 max-w-md">
            <h3 className="text-xl font-bold text-[#13315c]">
              Sign Up to our news & offers
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Be the first to know about our exclusive offers, new services, courier tools and more
            </p>
          </div>
          <div className="flex items-center justify-start md:justify-end">
            <div className="relative w-full max-w-md overflow-hidden bg-white rounded-lg border border-gray-200">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
                className="w-full py-3 pl-10 pr-24 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-[#155daf] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#155ae3] cursor-pointer active:scale-110 transition-all duration-200">
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-white px-6 py-12 gap-8 flex-grow">
          <div className="flex flex-col gap-4 items-start">
            <NavLink to="/" className="text-2xl font-extrabold tracking-tight text-white">
              Prime<span className="text-black">Pack</span>
            </NavLink>
            <div className="flex flex-col mt-2 items-start">
              <p className="text-xl font-bold text-[#13315c]">Trustpilot</p>
              <div className="flex gap-1 mt-1">
                {stars.map((star) => (
                  <div className="w-5 h-5" key={star.id}>
                    <Star className={`${star.color} fill-current`} />
                  </div>
                ))}
              </div>
              <p className="font-bold mt-2 text-sm text-white/90">4.5 reviews</p>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold border-b border-white/10 pb-2 mb-3">Company</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-200">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Reviews</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Cookie Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Acceptable use Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Sitemap</li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold border-b border-white/10 pb-2 mb-3">Shipping Services</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Ship a Package</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Track a Package</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Domestic Shipping</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Couriers</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Delivery Services</li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold border-b border-white/10 pb-2 mb-3">Customers</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Log in</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Register</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Contact</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Support Hub</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-200">Preference</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-b border-gray-500 text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 uppercase font-sans">
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <Truck className="w-10 h-10 flex-shrink-0" strokeWidth={1} />
            <div className="flex flex-col">
              <p className="text-gray-300 text-xs">Shipping to over</p>
              <p className="font-bold text-sm">35 states</p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <Shield className="w-10 h-10 flex-shrink-0" strokeWidth={1} />
            <div className="flex flex-col">
              <p className="text-gray-300 text-xs">100% Secure</p>
              <p className="font-semibold text-sm">Checkout</p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <Headset className="w-10 h-10 flex-shrink-0" strokeWidth={1} />
            <div className="flex flex-col">
              <p className="text-gray-300 text-xs">Outstanding</p>
              <p className="font-semibold text-sm">World Wide Support</p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <Star className="w-10 h-10 flex-shrink-0" strokeWidth={1} />
            <div className="flex flex-col">
              <p className="text-gray-300 text-xs">Over 4000</p>
              <p className="font-semibold text-sm">Reviews</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-5 w-full text-center text-white text-sm font-semibold flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} PrimePack. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
