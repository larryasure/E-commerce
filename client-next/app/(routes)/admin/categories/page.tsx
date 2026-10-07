"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FolderOpen,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { axiosInstance } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import { CategorySerializer } from "@/lib/types";

type SortOption = "name-asc" | "name-desc" | "stock-high" | "stock-low";

const ITEMS_PER_PAGE = 10;

export default function AdminCategoriesPage() {
  const { token } = useAuthStore();

  const [categories, setCategories] = useState<CategorySerializer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get<any>("/categories/");

        const data = response.data;

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data?.results)) {
          setCategories(data.results);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );

    return [...filtered].sort((a, b) => {
      const stockA = Number(a.stock ?? 0);
      const stockB = Number(b.stock ?? 0);

      switch (sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name);

        case "stock-high":
          return stockB - stockA;

        case "stock-low":
          return stockA - stockB;

        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [categories, searchTerm, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE),
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalProducts = categories.reduce(
    (total, category) => total + Number(category.stock ?? 0),
    0,
  );

  const averageProducts =
    categories.length > 0 ? Math.round(totalProducts / categories.length) : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      stock: 0,
    });
    setErrors({});
    setSaving(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();

    setErrors({});

    if (!name) {
      setErrors({
        name: "Category name is required.",
      });
      return;
    }

    if (formData.stock < 0) {
      setErrors({
        stock: "Stock cannot be negative.",
      });
      return;
    }

    if (!token) {
      setErrors({
        submit: "You must be logged in to continue.",
      });
      return;
    }

    try {
      setSaving(true);

      if (editingId !== null) {
        const response = await axiosInstance.patch<CategorySerializer>(
          `/categories/${editingId}/`,
          {
            name,
            stock: formData.stock,
          },
        );

        setCategories((current) =>
          current.map((category) =>
            category.id === editingId ? response.data : category,
          ),
        );
      } else {
        const response = await axiosInstance.post<CategorySerializer>(
          "/categories/",
          {
            name,
            stock: formData.stock,
          },
        );

        setCategories((current) => [...current, response.data]);
      }

      resetForm();
    } catch (error: any) {
      console.error("Failed to save category", error);

      const apiErrors = error?.response?.data;

      if (apiErrors && typeof apiErrors === "object") {
        const parsedErrors: Record<string, string> = {};

        Object.entries(apiErrors).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            parsedErrors[key] = value.join(" ");
          } else if (typeof value === "string") {
            parsedErrors[key] = value;
          }
        });

        if (Object.keys(parsedErrors).length > 0) {
          setErrors(parsedErrors);
        } else {
          setErrors({
            submit: error?.response?.data?.detail || "Failed to save category.",
          });
        }
      } else {
        setErrors({
          submit: "Failed to save category. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: CategorySerializer) => {
    setEditingId(category.id ?? null);

    setFormData({
      name: category.name,
      stock: Number(category.stock ?? 0),
    });

    setErrors({});
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId || !token) return;

    try {
      setDeleting(true);

      await axiosInstance.delete(`/categories/${deleteId}/`);

      setCategories((current) =>
        current.filter((category) => category.id !== deleteId),
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete category", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <CategoriesSkeleton />;
  }

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <FolderOpen className="h-6 w-6 text-blue-800" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Sign in required
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign in to manage your store categories.
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
            Categories
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Organize your store products into clear, easy-to-browse categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              stock: 0,
            });
            setErrors({});
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total categories"
          value={categories.length}
          icon={<FolderOpen className="h-5 w-5" />}
          description="Active catalog groups"
        />

        <SummaryCard
          label="Products"
          value={totalProducts}
          icon={<Package className="h-5 w-5" />}
          description="Products across categories"
        />

        <SummaryCard
          label="Average products"
          value={averageProducts}
          icon={<Package className="h-5 w-5" />}
          description="Per category"
        />
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
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
                <option value="stock-high">Products: High to Low</option>
                <option value="stock-low">Products: Low to High</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Results information */}
        <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-gray-500">
            {filteredCategories.length === 0
              ? "No categories found"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredCategories.length,
                )} of ${filteredCategories.length} categories`}
          </p>

          {searchTerm && (
            <p className="text-xs font-medium text-blue-800">
              Searching for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Empty state */}
        {filteredCategories.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(searchTerm)}
            onClear={() => setSearchTerm("")}
            onAdd={() => {
              setEditingId(null);
              setFormData({
                name: "",
                stock: 0,
              });
              setErrors({});
              setShowForm(true);
            }}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Products
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="group transition hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                            <FolderOpen className="h-4 w-4 text-blue-800" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Category
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {Number(category.stock ?? 0)}
                          </span>

                          <span className="text-xs text-gray-500">
                            products
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(category.id ?? null)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {paginatedCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 transition hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                        <FolderOpen className="h-4 w-4 text-blue-800" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {category.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {Number(category.stock ?? 0)} products
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteId(category.id ?? null)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${category.name}`}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(category.id ?? null)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
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
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              resetForm();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId !== null ? "Edit category" : "Add category"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingId !== null
                    ? "Update the category information."
                    : "Create a new product category."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-6">
                {errors.submit && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors.submit}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Category name
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g. Electronics"
                    className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                      errors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-800 focus:ring-blue-100"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category-stock"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Product count
                  </label>

                  <input
                    id="category-stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((current) => ({
                        ...current,
                        stock: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                      errors.stock
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-800 focus:ring-blue-100"
                    }`}
                  />

                  {errors.stock && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.stock}
                    </p>
                  )}

                  <p className="mt-1.5 text-xs leading-5 text-gray-400">
                    This uses the existing category stock field from your
                    current API.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save changes"
                      : "Create category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setDeleteId(null);
            }
          }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">
                Delete category?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                This action cannot be undone. Products assigned to this category
                may be affected.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
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

function EmptyState({
  hasSearch,
  onClear,
  onAdd,
}: {
  hasSearch: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        {hasSearch ? (
          <Search className="h-6 w-6 text-gray-400" />
        ) : (
          <FolderOpen className="h-6 w-6 text-gray-400" />
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {hasSearch ? "No categories found" : "No categories yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch
          ? "Try searching with a different category name."
          : "Create your first category to start organizing your store catalog."}
      </p>

      {hasSearch ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Clear search
        </button>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      )}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-7">
      <div className="animate-pulse border-b border-gray-200 pb-6">
        <div className="h-4 w-36 rounded bg-gray-200" />
        <div className="mt-3 h-8 w-48 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex justify-between">
              <div>
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="mt-3 h-7 w-16 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-32 rounded bg-gray-200" />
              </div>

              <div className="h-10 w-10 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="animate-pulse border-b border-gray-200 p-5">
          <div className="h-11 max-w-md rounded-lg bg-gray-200" />
        </div>

        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />

                <div>
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-20 rounded bg-gray-200" />
                </div>
              </div>

              <div className="h-9 w-24 rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
