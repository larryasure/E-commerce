import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import fallbackImg from "../assets/Hero banner/Fallback.jpg";
import heroImg from "../assets/Hero banner/hero img.jfif";
import HeroCarousel from "../Carousel/HeroCarousel";
import FeaturedProducts from "./FeaturedProducts";

import {
  Backpack,
  BriefcaseBusiness,
  CookingPot,
  Flame,
  Footprints,
  Gem,
  Headphones,
  Laptop,
  Mail,
  RotateCcw,
  Send,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
} from "lucide-react";

const categoryIcons = {
  "Fashion & Apparel": Shirt,
  "Office & Stationery": BriefcaseBusiness,
  Electronics: Laptop,
  "Bags and Backpacks": Backpack,
  Accessories: Gem,
  "Beauty & Care": Sparkles,
  "Home and Kitchen": CookingPot,
  Footwears: Footprints,
};

const promoBanners = [
  { title: "New Arrivals", copy: "The latest drops, restocked weekly", gradient: "from-[#13315C] to-[#155daf]" },
  { title: "Best Sellers", copy: "What everyone's adding to their cart", gradient: "from-[#155daf] to-[#2f8fd6]" },
  { title: "Clearance Deals", copy: "Last units, lowest prices", gradient: "from-[#e63946] to-[#ff7b54]" },
];

const trustPoints = [
  { icon: Truck, title: "Fast Delivery", copy: "Reliable shipping, tracked door-to-door" },
  { icon: ShieldCheck, title: "Secure Checkout", copy: "Your payment info is always protected" },
  { icon: RotateCcw, title: "Easy Returns", copy: "Changed your mind? We've got you" },
  { icon: Headphones, title: "Real Support", copy: "A human, whenever you need one" },
];

// Counts down to end of day. Swap getTarget() for a backend `sale_ends_at`
// timestamp once flash sales are modeled server-side.
function useCountdown() {
  const getTarget = () => {
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    return midnight.getTime();
  };

  const [msLeft, setMsLeft] = useState(getTarget() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setMsLeft(Math.max(0, getTarget() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.max(0, msLeft);
  return {
    hours: Math.floor(total / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
  };
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 min-w-[52px] text-center">
        <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-white/70 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

function DealCountdown() {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <section className="px-4 sm:px-6 lg:px-8 -mt-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-linear-to-r from-[#e63946] to-[#ff7b54] rounded-2xl px-6 py-5 sm:px-10 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-[#e63946]/30">
          <div className="flex items-center gap-3 text-white">
            <Flame size={28} className="shrink-0" />
            <div>
              <p className="font-black text-lg sm:text-xl leading-tight">Flash Deals — Today Only</p>
              <p className="text-white/80 text-sm">Prices this good disappear at midnight</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TimeBox value={hours} label="Hrs" />
            <span className="text-white font-black text-xl -mt-4">:</span>
            <TimeBox value={minutes} label="Min" />
            <span className="text-white font-black text-xl -mt-4">:</span>
            <TimeBox value={seconds} label="Sec" />

            <Link
              to="/products"
              className="ml-2 bg-white text-[#e63946] font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform duration-200 whitespace-nowrap"
            >
              Shop Deals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-t-lg" />
          <div className="bg-white rounded-b-lg pt-6 pb-4 px-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("products/?featured=true&limit=10"),
          axiosInstance.get("categories/"),
        ]);
        setFeaturedProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data.results);
      } catch (error) {
        console.error("Failed to fetch Homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to a real newsletter endpoint once one exists.
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen">
      <section>
        <HeroCarousel />
      </section>

      <section className="relative px-4 py-12 lg:py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="inline-block text-sky-700 bg-[#155daf]/10 text-sm font-semibold tracking-wider uppercase px-4 py-1 rounded-xl">
                  New Season Arrived
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#13315C] tracking-tight leading-none">
                  Premium Products <br />
                  <span className="text-[#155daf]">at PrimePack</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg max-w-xl leading-relaxed pt-2">
                  Upgrade your lifestyle with top-tier products you can trust.
                  Benefit from ultra-fast delivery, worry-free checkout, and
                  our 100% satisfaction guarantee.
                </p>
              </div>

              <div className="flex flex-wrap gap-7">
                <Link
                  to="/products"
                  className="bg-[#13315C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#155daf] transition-all duration-300 shadow-lg shadow-[#13315C]/70 hover:shadow-xl active:scale-95 text-center min-w-[160px]"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-[#13315C] text-[#13315C] px-5 py-3 rounded-xl font-bold hover:bg-[#13315C] hover:text-white transition-all duration-300 text-center min-w-40"
                >
                  Explore All
                </Link>
              </div>

              <div className="flex gap-12 pt-6 border-t border-gray-200/60 max-w-md">
                <div>
                  <p className="text-3xl font-black text-[#13315C]">10K+</p>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#13315C]">50K+</p>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customers</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="absolute inset-0 bg-linear-to-tr from-[#13315C]/20 to-transparent rounded-3xl filter blur-2xl -z-10 transform scale-95 translate-y-4" />
              <div className="bg-linear-to-br from-[#13315C] to-[#155daf] rounded-3xl p-4 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={heroImg}
                  alt="heroImg"
                  className="w-full h-full object-cover cursor-pointer rounded-2xl mix-blend-luminosity hover:mix-blend-normal transition-all opacity-70 duration-700 hover:scale-110"
                  onError={(e) => {
                    e.target.src = fallbackImg;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <DealCountdown />

      {(loading || categories.length > 0) && (
        <section className="py-16 sm:px-6 px-4 lg:px-8 bg-white/60 backdrop-blur-sm border-y border-gray-100 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-[#13315c] tracking-tight">Shop Category</h2>
              <p className="text-gray-500 mt-3">Find exactly what you need across specialized lines</p>
            </div>

            {loading ? (
              <CategorySkeleton />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.name];

                  return (
                    <div key={category.id} className="rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <div className="overflow-hidden rounded-t-lg h-40 bg-gray-100">
                          {category.image ? (
                            <img
                              loading="lazy"
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#13315C] to-[#155daf]">
                              {Icon && <Icon size={36} className="text-white/80" />}
                            </div>
                          )}
                        </div>

                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-sky-100 border border-[#155daf] shadow-lg flex items-center justify-center">
                          {Icon && <Icon size={18} className="text-[#13315c]" />}
                        </div>
                      </div>

                      <div className="bg-white rounded-b-lg pt-6 pb-3 flex flex-col items-center text-center px-4">
                        <h3 className="font-semibold text-lg text-[#13315c]">{category.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {category.stock} {category.stock === 1 ? "item" : "items"}
                        </p>
                        <NavLink
                          to="/products"
                          className="mt-1 text-[#13315c] text-sm hover:translate-x-1.5 transition-all duration-300 active:scale-110 font-medium hover:underline"
                        >
                          Shop Now &#10137;
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {promoBanners.map((banner) => (
            <Link
              key={banner.title}
              to="/products"
              className={`group relative rounded-2xl p-6 h-40 flex flex-col justify-end overflow-hidden bg-linear-to-br ${banner.gradient} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
              <h3 className="text-white font-black text-xl relative">{banner.title}</h3>
              <p className="text-white/80 text-sm relative mt-1">{banner.copy}</p>
              <span className="text-white text-sm font-semibold relative mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Shop now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {(loading || featuredProducts.length > 0) && (
        <section className="py-8">
          {loading ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-8 bg-gray-200 rounded w-56 mb-8 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[420px] bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <FeaturedProducts featuredProducts={featuredProducts} />
          )}
        </section>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/60 border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#155daf]/10 flex items-center justify-center">
                <Icon size={22} className="text-[#13315c]" />
              </div>
              <h3 className="font-bold text-[#13315c] text-sm sm:text-base">{title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-linear-to-br from-[#13315C] to-[#155daf] rounded-3xl px-6 py-10 sm:px-12 sm:py-14 text-center relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5" />
          <Mail size={32} className="text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">Get deals before everyone else</h2>
          <p className="text-white/70 mt-2 max-w-md mx-auto">
            Join our list for early access to flash sales and new arrivals.
          </p>

          {subscribed ? (
            <p className="mt-6 text-white font-semibold">You're in — check your inbox to confirm 🎉</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-xl px-4 py-3 text-sm text-[#13315c] focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="submit"
                className="bg-white text-[#13315C] font-bold px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}