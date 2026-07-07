import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminCategories from "./components/admin/AdminCategories.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminOrderDetail from "./components/admin/AdminOrderDetail.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import AdminProductForm from "./components/admin/AdminProductForm.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import Cart from "./components/Cart.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Products from "./components/Products.jsx";
import Register from "./components/Register.jsx";
import WishList from "./components/WishList.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import Checkout from "./dashboard/Checkout.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import Orders from "./dashboard/Orders.jsx";
import Profile from "./dashboard/Profile.jsx";
import "./index.css";
import AdminProtectedRoutes from "./protectionRoutes/AdminProtectedRoutes.jsx";
import ProtectedRoutes from "./protectionRoutes/ProtectedRoutes.jsx";
import RootLayout from "./root/RootLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <WishList /> },

      // Protected routes
      {
        path: "checkout",
        element: (
          <ProtectedRoutes>
            <Checkout />
          </ProtectedRoutes>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoutes>
            <Orders />
          </ProtectedRoutes>
        ),
      },

      {
        path: "admin",
        element: (
          <AdminProtectedRoutes>
            <AdminLayout />
          </AdminProtectedRoutes>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "categories", element: <AdminCategories /> },
          { path: "products", element: <AdminProducts /> },
          { path: "products/:id", element: <AdminProductForm /> },
          { path: "products/new", element: <AdminProductForm /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "orders/:id", element: <AdminOrderDetail /> },
          { path: "users", element: <AdminUsers /> },
        ],
      },

      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
        <WishlistProvider>
      <CartProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-center" autoClose={2000} theme="dark" />
      </CartProvider>
        </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
);
