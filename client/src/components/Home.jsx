import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import HeroCarousel from "../Carousel/HeroCarousel";

import fallbackImg from "../assets/Hero banner/Fallback.jpg";
import heroImg from "../assets/Hero banner/hero img.jfif";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("products/?limit=10"),
          axiosInstance.get("categories/"),
        ]);

        setFeaturedProducts(productsRes.data.slice(0, 7));
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
              {/* Left Content */}
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

              <div className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 grid">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="relative group h-44 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-[#13315c]"
                  >
                    <div className="absolute inset-0 bg-linear-t from-[#13315c] via-[#13315c]/40 to-transparent  z-10 opacity-80 group:opacity-90 transition-opacity"></div>
                    <img
                      src={category.image}
                      alt="categoryImg"
                      className="h-44 w-full object-cover transform hover:scale-110 transition-transform duration-300 "
                    />
                    <div className="p-2 z-20">
                      <h3 className="absolute left-1 top-0 mt-2 rounded-lg bg-black px-4 py-0.5 text-sm text-white">
                        <span className="inline-block transition-transform hover:translate-x-5">
                          {category.name}
                        </span>
                      </h3>

                      <span className="absolute mb-1 bottom-0 left-0 mt-1  rounded-xl bg-black px-4 py-0.5 text-xs font-medium text-sky-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Browse Collection &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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

            {loading && featuredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="h-12 w-12 border-t-3 rounded-full animate-spin border-[#13315C]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 bg-gray-50 overflow-hidden">
                      <img
                        src={product.image || fallbackImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-[#13315C] text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-md">
                        #{product.price}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 flex flex-col grow">
                      <span className="text-xs text-[#155daf] font-bold tracking-wider uppercase mb-2 block">
                        {product.category?.name || "Premium Line"}
                      </span>
                      <h3 className="text-lg font-bold text-[#13315C] mb-2 line-clamp-1 group-hover:text-[#155daf] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed grow">
                        {product.description ||
                          "Indulge in our carefully engineered premium items built for absolute comfort and longevity."}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <button
                          onClick={() => console.log(product.id)}
                          className="bg-[#155daf] hover:bg-[#13315C] text-white px-5 py-2 rounded-2xl font-semibold transition"
                        >
                          Add to Cart
                        </button>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-sm font-bold text-[#13315C] hover:text-[#155daf] transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
