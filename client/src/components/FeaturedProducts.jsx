import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function FeaturedProducts({ featuredProducts = [], cart = [] }) {
  const { addCart, increaseCart, decreaseCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <NavLink
          to="/products"
          className="inline-flex items-center gap-2 font-semibold text-[#155daf] hover:underline group"
        >
          View All Products
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </NavLink>
      </div>

      <div className="pb-10">
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          speed={800}
          grabCursor={true}
          className="h-[420px] featured-swiper"
        >
          {featuredProducts.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <SwiperSlide key={product.id} className="h-full">
                <div
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white 
                shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <NavLink to={`/products/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </NavLink>

                    {product.is_new && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                          New
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-gray-50 p-1 rounded-lg">
                      <Heart size={18} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <NavLink to={`/products/${product.id}`}>
                        <h3 className="font-bold text-[#13315C] group-hover:text-[#155daf]">
                          {product.name}
                        </h3>
                      </NavLink>

                      <span className="text-xs text-gray-500 uppercase">
                        {product.category?.name || "Uncategorized"}
                      </span>

                      <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                        {product.description || "No description available."}
                      </p>
                    </div>

                    <div className="mt-2">
                      <span className="font-medium text-sm text-[#13315C]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                      <NavLink
                        to={`/products/${product.id}`}
                        className="text-sm font-semibold text-[#13315c] hover:scale-105 active:scale-95"
                      >
                        View Details
                      </NavLink>

                      {quantity > 0 ? (
                        <div className="flex items-center rounded-xl border border-sky-200 bg-sky-50 overflow-hidden">
                          <button
                            onClick={() => decreaseCart(product.id)}
                            className="p-1.5 hover:bg-sky-100"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-2 text-sm font-bold">
                            {quantity}
                          </span>

                          <button
                            onClick={() => increaseCart(product.id)}
                            className="p-1.5 hover:bg-sky-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addCart(product)}
                          className="flex items-center gap-2 rounded-lg bg-[#13315C] px-3 py-2 text-white text-sm hover:bg-[#155daf] active:scale-95"
                        >
                          <ShoppingCart size={16} />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="swiper-button-prev text-[#13315C]! left-2!" />
        <div className="swiper-button-next text-[#13315C]! right-2!" />
      </div>
    </div>
  );
}
