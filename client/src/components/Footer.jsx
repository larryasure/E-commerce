import { Mail, Star } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const stars = [
    {
      id: 1,
      star: Star,
      color: "text-[#13315c]",
    },

    {
      id: 1,
      star: Star,
      color: "text-[#13315c]",
    },
    {
      id: 1,
      star: Star,
      color: "text-[#13315c]",
    },

    {
      id: 1,
      star: Star,
      color: "text-[#13315c]",
    },
    {
      id: 1,
      star: Star,
      color: "text-amber-300",
    },
  ];

  return (
    <>
      <div className="min-h-[95vh] bg-linear-120 from-[#155daf] to-[#155ae3]">
        <div className="bg-[#8DA9C4] h-28  px-40 grid grid-cols-2 gap-8 py-4">
          <div className="flex flex-col gap-2 max-w-xs">
            <h3 className="text-xl font-bold text-[#13315c]">
              Sign Up to our news & offers
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Be the first to know about our exclusive offers, new services,
              couriers tools and more
            </p>
          </div>

          <div className="grid-cols-1 flex items-center justify-center ">
            <div className="relative w-full max-w-xs overflow-hidden bg-white rounded-lg border border-gray-200">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="email@gmail.com"
                className="w-full py-3 pl-10 pr-24 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />

              <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-[#155daf] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#155ae3] cursor-pointer active:scale-110 transition-all duration-200">
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-4  h-40  text-white  px-6 py-7 ">
          {/* Logo PArt */}

          <div className="grid-cols-1 flex flex-col gap-6 items-start  ">
            <NavLink
              to="/"
              className="text-2xl font-extrabold tracking-tight text-white"
            >
              Prime<span className="text-black">Pack</span>
            </NavLink>

            <div className="flex flex-col justify-center mt-10 items-start ">
              <p className="text-xl font-bold text-[#13315c]">Trustpilot</p>

              <div className="flex gap-1 mt-2 ">
                {stars.map((star) => (
                  <div className="w-5 h-5 " key={star.id}>
                    <Star className={`${star.color}  fill-sky-600`} />
                  </div>
                ))}
              </div>
              <p className="font-bold mt-0.5 ">4.5. reviews</p>
            </div>
          </div>

          <div className="grid-cols-2 flex flex-col ">
            <h3 className=" font-bold ">Company</h3>

            <ul className="flex flex-col gap-2 mt-3">
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                About Us
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Reviews
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Privacy Policy
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Cookie Policy
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Terms & Conditions
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Acceptable use Policy
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Sitemap
              </li>
            </ul>
          </div>

          <div className="grid-cols-3 flex flex-col ">
            <h3 className=" font-bold ">Shipping Services</h3>

            <ul className="flex flex-col gap-2 mt-3">
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Ship a Package
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Track a Package
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Domestic Shipping
              </li>

              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Couriers
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Delivery Services
              </li>
            </ul>
          </div>

          <div className="grid-cols-4 flex flex-col ">
            <h3 className=" font-bold ">Customers </h3>

            <ul className="flex flex-col gap-2 mt-3">
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Log in
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Register
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Contact
              </li>

              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Support Hub
              </li>
              <li className="text-white/70 hover:text-white cursor-pointer transition-all duration-300 text-sm">
                Preference
              </li>
            </ul>
          </div>

        </div>

        
      </div>
    </>
  );
}
