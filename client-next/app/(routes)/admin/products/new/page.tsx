"use client";

import { axiosInstance } from "@/lib/api/client";
import { CategorySerializer } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/authStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Package,
  Save,
  Star,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [categories, setCategories] = useState<CategorySerializer[]>([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        let url: string | null = "/categories/";
        let allCategories: CategorySerializer[] = [];

        while (url) {
          const response = await axiosInstance.get<any>(url);

          const data = response.data;

          if (Array.isArray(data)) {
            allCategories = [...allCategories, ...data];
            url = null;
            break;
          }

          const pageCategories = Array.isArray(data?.results)
            ? data.results
            : [];

          allCategories = [...allCategories, ...pageCategories];

          url = data?.next ?? null;
        }

        setCategories(allCategories);
      } catch (error) {
        console.error("Failed to load categories", error);

        toast.error("Unable to load product categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    setErrors((current) => ({
      ...current,
      image: "",
    }));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!description.trim()) {
      nextErrors.description = "Product description is required.";
    }

    const priceValue = Number(price);

    if (!price.trim()) {
      nextErrors.price = "Price is required.";
    } else if (Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = "Enter a valid price greater than 0.";
    }

    if (originalPrice.trim()) {
      const originalPriceValue = Number(originalPrice);

      if (Number.isNaN(originalPriceValue) || originalPriceValue < 0) {
        nextErrors.originalPrice = "Enter a valid original price.";
      }
    }

    const stockValue = Number(stock);

    if (!stock.trim()) {
      nextErrors.stock = "Stock quantity is required.";
    } else if (Number.isNaN(stockValue) || stockValue < 0) {
      nextErrors.stock = "Stock cannot be negative.";
    }

    if (!categoryId) {
      nextErrors.category = "Please select a category.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create a product.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("original_price", originalPrice || price);
      formData.append("stock", stock);
      formData.append("category_id", categoryId);
      formData.append("is_active", String(isActive));
      formData.append("featured", String(featured));

      if (image) {
        formData.append("image", image);
      }

      await axiosInstance.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully.");

      router.push("/admin/products");
    } catch (error: any) {
      console.error("CREATE PRODUCT ERROR:", error?.response?.data);

      const responseData = error?.response?.data;

      if (responseData && typeof responseData === "object") {
        const nextErrors: Record<string, string> = {};

        Object.entries(responseData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            nextErrors[key] = value.join(" ");
          } else if (typeof value === "string") {
            nextErrors[key] = value;
          }
        });

        setErrors(nextErrors);

        const message =
          responseData.detail ||
          responseData.message ||
          "Failed to create product.";

        toast.error(
          typeof message === "string" ? message : "Failed to create product.",
        );
      } else {
        toast.error("Failed to create product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = Number(price || 0);
  const displayOriginalPrice = Number(originalPrice || price || 0);

  const hasDiscount =
    displayOriginalPrice > displayPrice && displayOriginalPrice > 0;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100,
      )
    : 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </button>

          <p className="text-sm font-medium text-gray-500">
            Catalog management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Add product
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Add a new product to your Prime Park catalog.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        {/* Main form */}
        <div className="space-y-6">
          {/* Basic information */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <h2 className="text-base font-bold text-gray-900">
                Product information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information customers will see.
              </p>
            </div>

            <div className="space-y-5 px-5 py-6 sm:px-6">
              <FormField label="Product name" required error={errors.name}>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className={inputClass(Boolean(errors.name))}
                />
              </FormField>

              <FormField
                label="Description"
                required
                error={errors.description}
              >
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the product, its features and what makes it useful..."
                  rows={7}
                  className={`${inputClass(
                    Boolean(errors.description),
                  )} resize-y py-3`}
                />
              </FormField>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <h2 className="text-base font-bold text-gray-900">Pricing</h2>

              <p className="mt-1 text-sm text-gray-500">
                Set the selling price and original price.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
              <FormField label="Selling price" required error={errors.price}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="0.00"
                    className={`${inputClass(Boolean(errors.price))} pl-9`}
                  />
                </div>
              </FormField>

              <FormField label="Original price" error={errors.originalPrice}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={originalPrice}
                    onChange={(event) => setOriginalPrice(event.target.value)}
                    placeholder="0.00"
                    className={`${inputClass(
                      Boolean(errors.originalPrice),
                    )} pl-9`}
                  />
                </div>
              </FormField>
            </div>
          </section>

          {/* Inventory */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <h2 className="text-base font-bold text-gray-900">Inventory</h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage stock and product category.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
              <FormField label="Stock quantity" required error={errors.stock}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="0"
                  className={inputClass(Boolean(errors.stock))}
                />
              </FormField>

              <FormField label="Category" required error={errors.category}>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  disabled={categoriesLoading}
                  className={inputClass(Boolean(errors.category))}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Product image */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <h2 className="text-base font-bold text-gray-900">
                Product image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload a clear product image. Maximum size is 5MB.
              </p>
            </div>

            <div className="px-5 py-6 sm:px-6">
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex min-h-[280px] items-center justify-center p-6">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="max-h-[280px] max-w-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {image?.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {image ? formatFileSize(image.size) : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="ml-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="group flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleImageChange}
                    className="sr-only"
                  />

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800 transition group-hover:bg-blue-100">
                    <ImagePlus className="h-6 w-6" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    Click to upload product image
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG or WEBP up to 5MB
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm">
                    <Upload className="h-3.5 w-3.5" />
                    Choose image
                  </span>
                </label>
              )}

              {errors.image && (
                <p className="mt-2 text-xs text-red-600">{errors.image}</p>
              )}
            </div>
          </section>

          {/* Visibility */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <h2 className="text-base font-bold text-gray-900">
                Product settings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Control how this product appears in your store.
              </p>
            </div>

            <div className="space-y-4 px-5 py-6 sm:px-6">
              <ToggleRow
                checked={isActive}
                onChange={setIsActive}
                title="Active product"
                description="Customers can view and purchase this product."
              />

              <ToggleRow
                checked={featured}
                onChange={setFeatured}
                title="Featured product"
                description="Highlight this product in featured areas of the store."
                icon={<Star className="h-4 w-4" />}
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Preview */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-6">
            <div className="border-b border-gray-200 px-5 py-5">
              <h2 className="text-base font-bold text-gray-900">
                Product preview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Preview how your product information looks.
              </p>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex h-56 items-center justify-center bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-full w-full object-contain p-5"
                    />
                  ) : (
                    <div className="text-center">
                      <Package className="mx-auto h-10 w-10 text-gray-300" />

                      <p className="mt-2 text-xs text-gray-400">
                        Product image
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="line-clamp-2 min-h-[40px] text-sm font-semibold text-gray-900">
                    {name || "Your product name"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {categories.find(
                      (category) => String(category.id) === categoryId,
                    )?.name || "Product category"}
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {displayPrice > 0
                        ? formatCurrency(displayPrice)
                        : "₦0.00"}
                    </span>

                    {hasDiscount && (
                      <span className="pb-0.5 text-xs text-gray-400 line-through">
                        {formatCurrency(displayOriginalPrice)}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <span className="mt-2 inline-flex rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">
                      {discountPercentage}% off
                    </span>
                  )}

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">
                      {stock
                        ? `${stock} units available`
                        : "Stock quantity not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Publish */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg  text-blue-800">
                <Save className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Ready to add?
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Review your product details before creating it.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating product...
                </>
              ) : (
                <>
                  Create product
                </>
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => router.push("/admin/products")}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}



function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}



function inputClass(hasError: boolean) {
  return `h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-gray-300 focus:border-blue-800 focus:ring-blue-100"
  }`;
}

/* -------------------------------------------------------------------------- */
/* Toggle                                                                      */
/* -------------------------------------------------------------------------- */

function ToggleRow({
  checked,
  onChange,
  title,
  description,
  icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-gray-400">{icon}</div>}

        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>

          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-800" : "bg-gray-300"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="sr-only"
        />

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </div>
    </label>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
