"use client";

import { axiosInstance } from "@/lib/api/client";
import { CategorySerializer, ProductSerializer } from "@/lib/types";
import { ArrowRight, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import hero from "../../../public/Home and decor.jpg";
import FeaturedProducts from "../products/(featuredProducts)/page";

type CategoryListResponse =
  | CategorySerializer[]
  | {
      results?: CategorySerializer[];
      next?: string | null;
    };

type ProductListResponse =
  | ProductSerializer[]
  | {
      results?: ProductSerializer[];
      next?: string | null;
    };

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse bg-white p-5">
          <div className="h-3 w-20 rounded bg-gray-200" />
          <div className="mt-4 h-4 w-32 rounded bg-gray-100" />
          <div className="mt-3 h-3 w-20 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden border border-gray-200 bg-white"
        >
          <div className="aspect-square animate-pulse bg-gray-200" />

          <div className="space-y-3 p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <h3 className="text-base font-semibold text-[#13315c]">
        Nothing to show yet
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Browse the store to see what is available.
      </p>

      <Link
        href="/products"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#155daf] hover:underline"
      >
        Browse products
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<CategorySerializer[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<
    ProductSerializer[]
  >([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList: CategorySerializer[] = [];

        let nextUrl: string | null = "/categories/";

        while (nextUrl) {
          const response =
            await axiosInstance.get<CategoryListResponse>(nextUrl);

          const data = response.data;

          if (Array.isArray(data)) {
            categoriesList.push(...data);
            break;
          }

          if (Array.isArray(data.results)) {
            categoriesList.push(...data.results);
          }

          nextUrl = data.next ?? null;
        }

        setCategories(categoriesList);
      } catch (error) {
        console.error("Failed to fetch homepage categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const productsList: ProductSerializer[] = [];

        let nextUrl: string | null = "/products/?featured=true";

        while (nextUrl && productsList.length < 10) {
          const response =
            await axiosInstance.get<ProductListResponse>(nextUrl);

          const data = response.data;

          if (Array.isArray(data)) {
            productsList.push(...data);
            break;
          }

          if (Array.isArray(data.results)) {
            productsList.push(...data.results);
          }

          nextUrl = data.next ?? null;
        }

        setFeaturedProducts(productsList.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const visibleCategories = useMemo(
    () => categories.slice(0, 8),
    [categories],
  );

  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="grid overflow-hidden border border-gray-200 bg-[#f5f7fa] lg:grid-cols-[0.9fr_1.1fr]">
            {/* Hero content */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#155daf]">
                Welcome to Prime Park
              </p>

              <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#13315c] sm:text-4xl lg:text-5xl">
                Everything you need,
                <span className="block">all in one place.</span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
                Shop everyday essentials, electronics, fashion, accessories,
                home products and more from one convenient online store.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#155daf] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#13315c]"
                >
                  Shop now
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-[#13315c] transition-colors hover:border-[#155daf] hover:text-[#155daf]"
                >
                  View products
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={16} className="text-[#155daf]" />
                  Reliable delivery
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck size={16} className="text-[#155daf]" />
                  Secure checkout
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[500px]">
              <Image
                src={hero}
                alt="Prime Park products"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              <div className="absolute bottom-5 left-5 bg-white px-5 py-4 shadow-md">
                <p className="text-xs text-gray-500">Prime Park</p>

                <p className="mt-1 text-sm font-bold text-[#13315c]">
                  Shop with confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#155daf]">
                Browse the store
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#13315c]">
                Shop by category
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Find products by category.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-[#155daf] hover:underline sm:flex"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          {categoriesLoading ? (
            <CategorySkeleton />
          ) : visibleCategories.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {visibleCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group relative bg-white px-5 py-6 transition-colors hover:bg-[#f8fafc]"
                  >
                    <div className="absolute left-0 top-0 h-0.5 w-0 bg-[#155daf] transition-all duration-200 group-hover:w-full" />

                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Category
                    </p>

                    <h3 className="mt-4 min-h-[40px] text-sm font-bold leading-5 text-[#13315c] group-hover:text-[#155daf]">
                      {category.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-500">
                        {category.stock}{" "}
                        {category.stock === 1 ? "item" : "items"}
                      </span>

                      <ChevronRight
                        size={15}
                        className="text-gray-300 transition-colors group-hover:text-[#155daf]"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {categories.length > 8 && (
                <div className="mt-5 text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#13315c] hover:border-[#155daf] hover:text-[#155daf]"
                  >
                    View all categories
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================
          FEATURED / POPULAR PRODUCTS
      ========================================================= */}
      <section className="bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#155daf]">
                Customer favourites
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#13315c]">
                Featured products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Popular picks from the Prime Park store.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-[#155daf] hover:underline sm:flex"
            >
              View all products
              <ArrowRight size={15} />
            </Link>
          </div>

          {productsLoading ? (
            <FeaturedProductsSkeleton />
          ) : featuredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <FeaturedProducts featuredProducts={featuredProducts} />
          )}
        </div>
      </section>

      {/* =========================================================
          PROMOTIONAL BANNER
      ========================================================= */}
      <section className="border-y border-gray-200 bg-gray-50 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden border border-gray-200 bg-[#13315c] lg:grid-cols-[1fr_0.7fr]">
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">
                Prime Park shopping
              </p>

              <h2 className="mt-2 max-w-lg text-2xl font-bold text-white sm:text-3xl">
                Find everyday products without the hassle.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                Browse our growing collection and discover products for work,
                home, lifestyle and everyday use.
              </p>

              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#13315c] transition-colors hover:bg-gray-100"
                >
                  Start shopping
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[220px] lg:min-h-[280px]">
              <Image
                src={hero}
                alt="Shop Prime Park"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-[#13315c]/20" />
            </div>
          </div>
        </div>
      </section>


      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-gray-200 lg:grid-cols-4 lg:divide-y-0">
          <div className="px-5 py-7 sm:px-7">
            <h3 className="text-sm font-bold text-[#13315c]">
              Reliable delivery
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Get your orders delivered conveniently and keep track of your
              purchase.
            </p>
          </div>

          <div className="px-5 py-7 sm:px-7">
            <h3 className="text-sm font-bold text-[#13315c]">
              Secure payments
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Complete your checkout through a secure payment process.
            </p>
          </div>

          <div className="px-5 py-7 sm:px-7">
            <h3 className="text-sm font-bold text-[#13315c]">
              Easy shopping
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Browse products, add what you need and check out with ease.
            </p>
          </div>

          <div className="px-5 py-7 sm:px-7">
            <h3 className="text-sm font-bold text-[#13315c]">
              Customer support
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              We are here to help whenever you need assistance with an order.
            </p>
          </div>
        </div>
      </section>


      <div className="border-t border-gray-200 bg-gray-50 px-4 py-6 sm:hidden">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 bg-[#155daf] px-5 py-3 text-sm font-bold text-white"
        >
          Browse all products
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}