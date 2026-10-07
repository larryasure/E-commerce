"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useAuthStore } from "@/lib/stores/authStore";
import { ProductSerializer } from "@/lib/types";
import { axiosInstance } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { useRouter } from "next/navigation";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-high"
  | "price-low"
  | "stock-high"
  | "stock-low";

type StockFilter = "ALL" | "IN_STOCK" | "OUT_OF_STOCK";

type ProductsResponse = {
  results?: ProductSerializer[];
  next?: string | null;
  previous?: string | null;
  count?: number;
};

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const { token } = useAuthStore();

  const [products, setProducts] = useState<ProductSerializer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [activeDeleteId, setActiveDeleteId] = useState<number | null>(null);

  const [deleting, setDeleting] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        let url: string | null = "/products/";
        let allProducts: ProductSerializer[] = [];

        while (url) {
          const response = await axiosInstance.get<
            ProductsResponse | ProductSerializer[]
          >(url);

          const data = response.data;

          if (Array.isArray(data)) {
            allProducts = [...allProducts, ...data];
            url = null;
            break;
          }

          const pageProducts = Array.isArray(data?.results) ? data.results : [];

          allProducts = [...allProducts, ...pageProducts];

          url = data?.next ?? null;
        }

        if (!cancelled) {
          setProducts(allProducts);
        }
      } catch (error) {
        console.error("Failed to load products", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllProducts();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      setDeleting(true);

      await axiosInstance.delete(`/products/${id}/`);

      setProducts((current) => current.filter((product) => product.id !== id));

      setActiveDeleteId(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const name = String(product.name ?? "").toLowerCase();

      const category = String(product.category?.name ?? "").toLowerCase();

      const matchesSearch =
        !query || name.includes(query) || category.includes(query);

      const stock = Number(product.stock ?? 0);

      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && stock > 0) ||
        (stockFilter === "OUT_OF_STOCK" && stock <= 0);

      return matchesSearch && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return String(b.name ?? "").localeCompare(String(a.name ?? ""));

        case "price-high":
          return Number(b.price ?? 0) - Number(a.price ?? 0);

        case "price-low":
          return Number(a.price ?? 0) - Number(b.price ?? 0);

        case "stock-high":
          return Number(b.stock ?? 0) - Number(a.stock ?? 0);

        case "stock-low":
          return Number(a.stock ?? 0) - Number(b.stock ?? 0);

        case "name-asc":
        default:
          return String(a.name ?? "").localeCompare(String(b.name ?? ""));
      }
    });
  }, [products, searchTerm, sortBy, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, stockFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock ?? 0),
    0,
  );

  const inStockCount = products.filter(
    (product) => Number(product.stock ?? 0) > 0,
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock ?? 0) <= 0,
  ).length;

  const totalCatalogValue = products.reduce(
    (total, product) =>
      total + Number(product.price ?? 0) * Number(product.stock ?? 0),
    0,
  );

  if (loading) {
    return <ProductsSkeleton />;
  }

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Package className="h-6 w-6 text-blue-800" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Sign in required
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign in to manage your store products.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Catalog management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage your product catalog, pricing, inventory, and product
            information.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Products"
          value={products.length}
          icon={<Package className="h-5 w-5" />}
          description="Catalog products"
        />

        <SummaryCard
          label="In stock"
          value={inStockCount}
          icon={<ShoppingBag className="h-5 w-5" />}
          description={`${totalStock} units available`}
        />

        <SummaryCard
          label="Out of stock"
          value={outOfStockCount}
          icon={<Package className="h-5 w-5" />}
          description="Needs restocking"
        />

        <SummaryCard
          label="Catalog value"
          value={formatCurrency(totalCatalogValue)}
          icon={<Package className="h-5 w-5" />}
          description="Current stock value"
        />
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-lg">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products or categories..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100 sm:w-52"
              >
                <option value="name-asc">Name: A to Z</option>

                <option value="name-desc">Name: Z to A</option>

                <option value="price-high">Price: High to Low</option>

                <option value="price-low">Price: Low to High</option>

                <option value="stock-high">Stock: High to Low</option>

                <option value="stock-low">Stock: Low to High</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Stock filters */}
          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max gap-1">
              <FilterButton
                active={stockFilter === "ALL"}
                onClick={() => setStockFilter("ALL")}
              >
                All products
                <FilterCount
                  count={products.length}
                  active={stockFilter === "ALL"}
                />
              </FilterButton>

              <FilterButton
                active={stockFilter === "IN_STOCK"}
                onClick={() => setStockFilter("IN_STOCK")}
              >
                In stock
                <FilterCount
                  count={inStockCount}
                  active={stockFilter === "IN_STOCK"}
                />
              </FilterButton>

              <FilterButton
                active={stockFilter === "OUT_OF_STOCK"}
                onClick={() => setStockFilter("OUT_OF_STOCK")}
              >
                Out of stock
                <FilterCount
                  count={outOfStockCount}
                  active={stockFilter === "OUT_OF_STOCK"}
                />
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-5">
          <p className="text-sm text-gray-500">
            {filteredProducts.length === 0
              ? "No products found"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredProducts.length,
                )} of ${filteredProducts.length} products`}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onDelete={() => setActiveDeleteId(product.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {paginatedProducts.map((product) => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  onDelete={() => setActiveDeleteId(product.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyProducts
            hasSearch={Boolean(searchTerm)}
            hasFilter={stockFilter !== "ALL"}
            onClear={() => {
              setSearchTerm("");
              setStockFilter("ALL");
            }}
            onAdd={() => router.push("/admin/products/new")}
          />
        )}
      </div>

      {/* Delete modal */}
      <ConfirmDeleteModal
        open={activeDeleteId !== null}
        title="Delete product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => {
          if (!deleting) {
            setActiveDeleteId(null);
          }
        }}
        onConfirm={() => {
          if (activeDeleteId !== null && !deleting) {
            handleDelete(activeDeleteId);
          }
        }}
      />
    </div>
  );
}


function ProductRow({
  product,
  onDelete,
}: {
  product: ProductSerializer;
  onDelete: () => void;
}) {
  const stock = Number(product.stock ?? 0);

  return (
    <tr className="group transition hover:bg-gray-50/70">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ProductIcon />

          <div className="min-w-0">
            <p className="max-w-[280px] truncate text-sm font-semibold text-gray-900">
              {product.name}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Product ID: {product.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
          {product.category?.name || "Uncategorized"}
        </span>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-bold text-gray-900">
          {formatCurrency(Number(product.price ?? 0))}
        </p>
      </td>

      <td className="px-6 py-4">
        <StockBadge stock={stock} />
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </Link>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}


function MobileProductCard({
  product,
  onDelete,
}: {
  product: ProductSerializer;
  onDelete: () => void;
}) {
  const stock = Number(product.stock ?? 0);

  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <ProductIcon />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {product.name}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {product.category?.name || "Uncategorized"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Price</p>

          <p className="mt-1 text-sm font-bold text-gray-900">
            {formatCurrency(Number(product.price ?? 0))}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Stock</p>

          <div className="mt-1">
            <StockBadge stock={stock} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/admin/products/${product.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </Link>

        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}


function ProductIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
      <Package className="h-4 w-4 text-blue-800" />
    </div>
  );
}


function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        Out of stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        {stock} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
      {stock} in stock
    </span>
  );
}


function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-800 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function FilterCount({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
        active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500"
      }`}
    >
      {count}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyProducts({
  hasSearch,
  hasFilter,
  onClear,
  onAdd,
}: {
  hasSearch: boolean;
  hasFilter: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Package className="h-6 w-6 text-gray-400" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {hasSearch || hasFilter ? "No matching products" : "No products yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch || hasFilter
          ? "Try changing your search or inventory filter."
          : "Add your first product to start building your store catalog."}
      </p>

      {hasSearch || hasFilter ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      )}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-7">
      <div className="animate-pulse border-b border-gray-200 pb-6">
        <div className="h-4 w-36 rounded bg-gray-200" />
        <div className="mt-3 h-8 w-40 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex justify-between">
              <div>
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="mt-3 h-7 w-16 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-28 rounded bg-gray-200" />
              </div>

              <div className="h-10 w-10 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="animate-pulse border-b border-gray-200 p-5">
          <div className="h-11 max-w-lg rounded-lg bg-gray-200" />
          <div className="mt-5 h-9 w-full max-w-lg rounded-lg bg-gray-200" />
        </div>

        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />

                <div>
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-24 rounded bg-gray-200" />
                </div>
              </div>

              <div className="hidden h-7 w-20 rounded-full bg-gray-200 md:block" />

              <div className="hidden h-7 w-20 rounded bg-gray-200 md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
