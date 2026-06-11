import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosConfig";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axiosInstance.get("/products/");
        setFeaturedProducts(response.data.slice(0, 6)); // Get first 6 products
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-regal-navy-500 to-oxford-navy-500 text-white py-20 rounded-lg mb-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to PrimePack</h1>
          <p className="text-xl mb-6">
            Premium logistics and e-commerce solutions
          </p>
          <Link
            to="/products"
            className="bg-mint-cream-500 text-regal-navy-900 px-6 py-3 rounded-lg font-semibold hover:bg-mint-cream-600"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-regal-navy-900">
          Featured Products
        </h2>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-regal-navy-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-powder-blue-600 mb-2">
                    {product.category.name}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-mint-cream-600">
                      ${product.price}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-regal-navy-500 text-white px-4 py-2 rounded hover:bg-regal-navy-600"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && featuredProducts.length === 0 && (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-powder-blue-100 rounded-lg p-12 text-center mt-12">
        <h2 className="text-3xl font-bold text-regal-navy-900 mb-4">
          Ready to get started?
        </h2>
        <p className="text-regal-navy-700 mb-6">
          {isAuthenticated
            ? "Browse our full product catalog"
            : "Create an account to start shopping"}
        </p>
        <Link
          to="/products"
          className="bg-regal-navy-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-regal-navy-600"
        >
          Browse Products
        </Link>
      </section>
    </div>
  );
}