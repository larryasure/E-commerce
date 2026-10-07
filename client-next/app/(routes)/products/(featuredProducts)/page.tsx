import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Link from "next/link";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

type Product = {
  id: string | number;
  image: string;
  name: string;
  price: number;
  stock: number;
  is_new?: boolean;
  description?: string;
  category?: { name?: string };
};

type CartItem = {
  id: string | number;
  quantity: number;
  product?: { id: string | number };
};

type FeaturedProductsProps = {
  featuredProducts?: Product[];
  cart?: { items?: CartItem[] };
  increaseQuantity?: (id: string | number) => void;
  decreaseQuantity?: (id: string | number) => void;
  addCart?: (id: string | number) => void;
};

export default function FeaturedProducts({
  featuredProducts = [],
  cart = {},
  increaseQuantity,
  decreaseQuantity,
  addCart,
}: FeaturedProductsProps) {
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set());

  const toggleWishlist = (id: string | number) => {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isWishlisted = (id: string | number) => wishlist.has(id);

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8  ">
      <div className="flex flex-col sm:flex-row sm:items-end  gap-4 mb-8  ">
        <Link
          href={"/products"}
          className="inline-flex items-center gap-2 font-medium hover:underline-offset-1 group text-[#155daf]"
        >
          View All Products
        </Link>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
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
            const cartItem = cart?.items?.find(
              (item) => item.product?.id === product.id,
            );
            const quantity = cartItem?.quantity || 0;

            return (
              <SwiperSlide key={product.id} className="h-full">
                <div
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white 
                shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {product.is_new && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                          New
                        </span>
                      </div>
                    )}

                    <div
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 bg-gray-50 p-1 rounded-lg"
                    >
                      <Heart
                        size={18}
                        strokeWidth={0.5}
                        fill={isWishlisted(product.id) ? "#ef4544" : "none"}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-[#13315C] group-hover:text-[#155daf]">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-2 ">
                        <span className="text-xs text-gray-500 uppercase">
                          {product.category?.name || "Uncategorized"}
                        </span>

                        <p className="flex items-center justify-center rounded-lg text-white p-1 bg-[#13315c]  ">
                          <span className="text-xs ">
                            {product.stock} in stock
                          </span>
                        </p>
                      </div>
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
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-semibold text-[#13315c] hover:scale-105 active:scale-95"
                      >
                        View Details
                      </Link>

                      {quantity > 0 ? (
                        <div className="flex items-center rounded-xl  border border-sky-200 bg-sky-50 overflow-hidden">
                          <button
                            onClick={() =>
                              cartItem && decreaseQuantity?.(cartItem.id)
                            }
                            className="p-2 hover:bg-sky-100"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-2 text-sm font-bold">
                            {quantity}
                          </span>

                          <button
                            onClick={() =>
                              cartItem && increaseQuantity?.(cartItem.id)
                            }
                            className="p-2 hover:bg-sky-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addCart?.(product.id)}
                          className="flex items-center gap-2 rounded-lg bg px-3 py-1.5 text-sm bg-[#155daf] text-white hover:bg-[#13315C] hover:scale-105 cursor-pointer"
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
