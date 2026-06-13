import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import HeroCarousel from "../hooks/HeroCarousel";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesRes, featuredRes] = await Promise.all([
          axiosInstance.get("products/"),
          axiosInstance.get("categories/"),
        ]);
        setFeaturedProducts(featuredRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load homepage", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const fallback = (
    <div className="w-full h-full flex items-center justify-center">
      <p>Fall back Image</p>
    </div>
    
  );


  return (
    <>
      <div className="shadow min-h-screen">
        {/* Hero Banner Sec */}
        <section>
          <HeroCarousel />
        </section>

        {/* Hero texts */}
        <section className="relative px-4 py-20 lg:py-28 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="inline-block bg-[#155daf]/10 text-[#155daf] text-sm font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
                    New Season Arrived
                  </span>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#13315C] tracking-tight leading-none">
                    Premium <br />
                    <span className="text-[#155daf]">E-Commerce</span>
                  </h1>
                  <p className="text-gray-600 text-lg sm:text-xl max-w-xl leading-relaxed pt-2">
                    Discover our curated collection of premium products. Fast
                    shipping, secure payments, and exceptional service
                    guaranteed.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/products"
                    className="bg-[#13315C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#155daf] transition-all duration-300 shadow-lg shadow-[#13315C]/20 hover:shadow-xl active:scale-95 text-center min-w-[160px]"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/products"
                    className="border-2 border-[#13315C] text-[#13315C] px-8 py-4 rounded-xl font-bold hover:bg-[#13315C] hover:text-white transition-all duration-300 text-center min-w-[160px]"
                  >
                    Explore All
                  </Link>
                </div>

                <div className="flex gap-12 pt-6 border-t border-gray-200/60 max-w-md">
                  <div>
                    <p className="text-3xl font-black text-[#13315C]">10K+</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#13315C]">50K+</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="hidden lg:block lg:col-span-5 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#13315C]/20 to-transparent rounded-3xl filter blur-2xl -z-10 transform scale-95 translate-y-4"></div>
                <div className="bg-gradient-to-br from-[#13315C] to-[#155daf] rounded-3xl p-4 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                  <img
                    src={featuredProducts.title}
                    alt={featuredProducts.image}
                    className="w-full h-full object-cover rounded-2xl mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                    onError={(e) => {
                      e.target.src = { fallback };
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
