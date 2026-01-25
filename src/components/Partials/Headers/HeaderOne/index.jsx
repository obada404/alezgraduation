import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ThinBag from "../../../Helpers/icons/ThinBag";
import Middlebar from "./Middlebar";
import Navbar from "./Navbar";
import NewsBar from "../../NewsBar";
import CategoriesBar from "../../CategoriesBar";
import { fetchCart } from "../../../../api/cart";
import { getToken } from "../../../../api/client";

export default function HeaderOne({ className, drawerAction, type = 1, showNewsBar = false }) {
  const location = useLocation();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Fetch cart items count - only when location changes, not on interval
  useEffect(() => {
    const loadCartCount = async () => {
      if (getToken()) {
        try {
          const cartData = await fetchCart();
          if (cartData && cartData.items) {
            const totalItems = cartData.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
          } else {
            setCartItemsCount(0);
          }
        } catch (err) {
          // If error (e.g., unauthorized), set count to 0
          setCartItemsCount(0);
        }
      } else {
        setCartItemsCount(0);
      }
    };
    loadCartCount();
    // Only refresh when location changes, not on interval to avoid multiple API calls
  }, [location]);


  return (
    <header className={` ${className || ""} header-section-wrapper relative`}>
      <div className="quomodo-shop-top-bar w-full h-[10px] bg-white" />
      <Navbar type={type} className="quomodo-shop-nav-bar lg:block hidden" />
      <div className="lg:block hidden">
        <CategoriesBar />
      </div>
      {showNewsBar && (
        <div className="lg:block hidden">
          <NewsBar />
        </div>
      )}
      <Middlebar
        type={type}
        className=" quomodo-shop-middle-bar lg:block hidden"
      />
      <div className="quomodo-shop-drawer lg:hidden block w-full bg-white">
        <div className="w-full h-[60px] flex justify-between items-center px-3 sm:px-5">
          <div onClick={drawerAction} className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <div className="flex-1 flex items-center justify-center px-2">
            <Link to="/" className="flex items-center justify-center h-full">
              <img
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`}
                alt="logo"
                style={{ maxHeight: '56px', maxWidth: '120px' }}
                onError={(e) => {
                  // Fallback to logo.png if logo.jpeg fails
                  if (e.target.src !== `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`) {
                    e.target.src = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;
                  }
                }}
              />
            </Link>
          </div>
          <div className="cart relative cursor-pointer flex items-center flex-shrink-0">
            <Link to="/cart" className="flex items-center relative">
              <span className="flex items-center relative">
                <ThinBag />
                {cartItemsCount > 0 && (
                  <span
                    className={`min-w-[18px] h-[18px] px-1 rounded-full absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-[9px] font-bold leading-none whitespace-nowrap z-10 ${
                      type === 3 ? "bg-qh3-blue text-white" : "bg-white text-qyellow"
                    }`}
                  >
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
        <CategoriesBar />
        {showNewsBar && <NewsBar />}
      </div>
    </header>
  );
}
