"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CornerDownLeft, Lock, Van, Minus, Plus } from "lucide-react";
import { axiosInstance } from "@/lib/api/client";
import { ProductSerializer } from "@/lib/types/api";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Image from "next/image";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductSerializer | null>(null);
  const [loading, setLoading] = useState(true);

  const { cart, addItem, increaseQuantity, decreaseQuantity } = useCartStore();
  const { token } = useAuthStore();
  const stock = product?.stock ?? 0;
  const cartItem =
    product && cart?.items
      ? cart.items.find((item) => item.product?.id === product.id)
      : undefined;

  const quantity = cartItem?.quantity ?? 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get<ProductSerializer>(
          `/products/${id}/`,
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-16">
        <div className="loading loading-infinity loading-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#13315C] mb-3">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you are looking for does not exist.
          </p>
          <Link
            href="/products"
            className="bg-[#155daf] text-white px-6 py-3 rounded font-semibold hover:bg-[#13315C] transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const productId = Number(product.id);

    if (!productId || Number.isNaN(productId)) {
      return;
    }

    await addItem(productId, 1);
  };
  return (
    <div className="min-h-screen mt-16 mb-10">
      <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="text-[#155daf] text-sm hover:underline"
          >
            ← Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-8 items-start">
            <div className="flex flex-col gap-3">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white flex items-center justify-center aspect-square">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    sizes="(max-width: 400px) 30vw, (max-width: 600px) 14vw, 15vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] rounded-lg h-full w-full"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-gray-400">Product Image</p>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#155daf] font-semibold uppercase tracking-widest">
                {product.category?.name || "Premium Collection"}
              </p>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <span className="text-yellow-400 text-sm leading-none">
                  ★★★★★
                </span>
                <span className="text-sm text-[#155daf] hover:underline cursor-pointer">
                  {product.rating_count} ratings
                </span>
              </div>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  FREE delivery on orders above ₦150,000
                </p>
              </div>

              <p
                className={`text-sm font-semibold ${stock > 0 ? "text-[#007600]" : "text-red-600"}`}
              >
                {stock} {stock > 0 ? "In stock" : "Out of stock"}
              </p>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  About this item
                </p>
                <p className="text-sm text-gray-600 leading-7">
                  {product.description ||
                    "Crafted with premium materials and designed for exceptional durability, comfort, and everyday performance."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { icon: Van, text: "Nationwide delivery available" },
                  { icon: Lock, text: "Secure & protected checkout" },
                  { icon: CornerDownLeft, text: "30-day hassle-free returns" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="text-[#155daf] shrink-0">
                      <Icon size={16} />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {stock > 0 && (
            <div className="lg:sticky lg:top-6">
              <div className="border border-gray-200 bg-white/80 rounded-lg p-6 flex flex-col gap-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>

                <p className="text-sm text-gray-600">
                  FREE delivery on orders above{" "}
                  <span className="font-semibold text-gray-900">₦150,000</span>
                </p>

                <p className="text-base font-semibold text-[#007600]">
                  {stock} {stock > 0 ? "In stock" : "Out of stock"}
                </p>

                {quantity > 0 ? (
                  <div className="flex h-11 w-full items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => {
                        if (cartItem?.id) {
                          decreaseQuantity(cartItem.id);
                        }
                      }}
                      className="flex h-full w-12 items-center justify-center text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Minus size={17} />
                    </button>

                    <span className="flex-1 text-center text-sm font-bold text-gray-900">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (cartItem?.id) {
                          increaseQuantity(cartItem.id);
                        }
                      }}
                      className="flex h-full w-12 items-center justify-center text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full rounded-full bg-[#155daf] py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#13315C] active:scale-[0.98]"
                  >
                    Add to Cart
                  </button>
                )}

                <Link
                  href="/cart"
                  className="w-full bg-[#13315C] hover:bg-[#0d2240] text-white py-2.5 rounded-full font-semibold text-sm text-center transition-all duration-200"
                >
                  Go to Cart
                </Link>

                <div className="flex items-center flex-col justify-center gap-1.5 text-xs text-gray-400 pt-1">
                  <Lock size={11} />
                  <span>Secure transaction</span>
                  <span className="text-gray-700">30-day return policy</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
