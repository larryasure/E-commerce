import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./components/Cart.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Products from "./components/Products.jsx";
import Register from "./components/Register.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import Profile from "./dashboard/Profile.jsx";
import "./index.css";
import ProtectedRoutes from "./protectionRoutes/ProtectedRoutes.jsx";
import RootLayout from "./root/RootLayout.jsx";
import Orders from "./dashboard/Orders.jsx";
import WishList from "./components/WishList.jsx";
import Checkout from "./dashboard/Checkout.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <AuthProvider>
      <ToastContainer position="top-center " autoClose={ 3000}  />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);