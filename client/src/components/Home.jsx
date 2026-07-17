import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import fallbackImg from "../assets/Hero banner/Fallback.jpg";
import heroImg from "../assets/Hero banner/hero img.jfif";
import HeroCarousel from "../Carousel/HeroCarousel";
import { useCart } from "../context/CartContext";

import {
  Backpack,
  BriefcaseBusiness,
  CookingPot,
  Footprints,
  Gem,
  Laptop,
  Shirt,
  Sparkles,
} from "lucide-react";
import FeaturedProducts from "./FeaturedProducts";

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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { cart, addCart, decreaseCart, increaseCart } = useCart();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("products/?featured=true&limit=10"),
          axiosInstance.get("categories/"),
        ]);
        setFeaturedProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch Homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <>
      <div className="shadow min-h-screen">
        <section>
          <HeroCarousel />
        </section>

        <section className="relative px-4 py-12 lg:py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="inline-block text-sky-700 bg-[#155daf]/10   text-sm font-semibold tracking-wider uppercase px-4 py-1 rounded-xl">
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
                    className="bg-[#13315C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#155daf] transition-all duration-300 shadow-lg shadow-[#13315C]/70  hover:shadow-xl active:scale-95 text-center min-w-[160px]"
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

              <div className="hidden lg:block lg:col-span-5 relative">
                <div className="absolute inset-0 bg-linear-to-tr from-[#13315C]/20 to-transparent rounded-3xl filter blur-2xl -z-10 transform scale-95 translate-y-4"></div>
                <div className="bg-linear-to-br from-[#13315C] to-[#155daf] rounded-3xl p-4 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                  <img
                    src={heroImg}
                    alt="heroImg"
                    className="w-full h-full object-cover  cursor-pointer rounded-2xl mix-blend-luminosity hover:mix-blend-normal transition-all opacity-70 duration-700 hover:scale-110"
                    onError={(e) => {
                      e.target.src = fallbackImg;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="py-16 sm:px-6 px-4 lg:px-8 bg-white/60 backdrop-blur-sm border-y border-gray-100">
            <div className="max-w-7xl mx-auto ">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-[#13315c] tracking-tight">
                  Shop Category
                </h2>
                <p className="text-gray-500 mt-3 ">
                  Find exactly what you need accross a specialized lines
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.name];

                  return (
                    <div
                      key={category.key}
                      className=" rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <div className="overflow-hidden rounded-t-lg h-40">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover  hover:scale-110 transition-all duration-300"
                          />
                        </div>

                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-sky-100 border border-[#155daf] shadow-lg flex items-center justify-center">
                          {Icon && (
                            <Icon size={18} className="text-[#13315c]" />
                          )}
                        </div>
                      </div>

                      <div className=" bg-white rounded-xl pt-6 pb-3 flex flex-col items-center text-center px-4">
                        <h3 className="font-semibold text-lg text-[#13315c]">
                          {category.name}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {category.stock}{" "}
                          {category.stock > 1 ? "items" : "item"}
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
            </div>
          </section>
        )}

        <section className="py-20  px-4 ">
          <div className="max-w-7xl mx-auto ">
            <div className="text-center mb-16">
              <span className="text-sm font-bold text-[#155daf] uppercase tracking-widest">
                Our Picks
              </span>
              <h2 className="text-4xl font-black text-[#13315C] mt-2 tracking-tight">
                Featured Products
              </h2>
              <p className="text-gray-500 text-lg mt-3 max-w-md mx-auto">
                Handpicked selections of premium quality items just for you
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-12 w-12 border-4 border-gray-200 border-t-[#13315C] rounded-full animate-spin"></div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <FeaturedProducts
                featuredProducts={featuredProducts}
                cart={cart}
                addCart={addCart}
                increaseCart={increaseCart}
                decreaseCart={decreaseCart}
              />
            ) : (
              <div className="py-20 text-center">
                <h3 className="text-xl font-semibold text-gray-700">
                  No featured products available.
                </h3>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
