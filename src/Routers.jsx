import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./components/About";
import AllProductPage from "./components/AllProductPage";
import Login from "./components/Auth/Login/index";
import Signup from "./components/Auth/Signup";
import Cart from "./components/Cart";
import Home from "./components/Home";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SingleProductPage from "./components/SingleProductPage";
import Location from "./components/Location";
import AdminDashboard from "./components/AdminDashboard";
import AdminCart from "./components/AdminCart";
import AdminOrder from "./components/AdminOrder";
import NotFound from "./components/FourZeroFour";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/products", element: <AllProductPage /> },
  { path: "/products/:id", element: <SingleProductPage /> },
  { path: "/cart", element: <Cart /> },
  { path: "/about", element: <About /> },
  { path: "/location", element: <Location /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/admin/cart/:cartId", element: <AdminCart /> },
  { path: "/admin/order/:orderId", element: <AdminOrder /> },
  { path: "*", element: <NotFound /> },
]);

function Routers() {
  return <RouterProvider router={router} />;
}

export default Routers;
