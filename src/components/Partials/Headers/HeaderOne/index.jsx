import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import ThinBag from "../../../Helpers/icons/ThinBag";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import WhatsApp from "../../../Helpers/icons/WhatsApp";
import Navbar from "./Navbar";
import NewsBar from "../../NewsBar";
import CategoriesBar from "../../CategoriesBar";
import { fetchCart } from "../../../../api/cart";
import { getToken } from "../../../../api/client";

export default function HeaderOne({ className, drawerAction, type = 1, showNewsBar = false }) {
  const location = useLocation();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to load cart count
  const loadCartCount = useCallback(async () => {
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
  }, []);

  // Fetch cart items count - when location changes
  useEffect(() => {
    loadCartCount();
  }, [location, loadCartCount]);

  // Listen for cart update events
  useEffect(() => {
    window.addEventListener('cartUpdated', loadCartCount);
    return () => {
      window.removeEventListener('cartUpdated', loadCartCount);
    };
  }, [loadCartCount]);

  // Handle scroll to make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Calculate total height of navbar + categories bar for spacer
  const navbarHeight = 90; // Navbar height
  const categoriesBarHeight = 50; // Approximate categories bar height
  const stickyHeaderHeight = navbarHeight + categoriesBarHeight;

  return (
    <header className={` ${className || ""} header-section-wrapper relative`}>
      <div className="quomodo-shop-top-bar w-full h-[10px] bg-white" />
      <div className={`hidden lg:block ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'}`}>
        <Navbar type={type} className="quomodo-shop-nav-bar" />
        <CategoriesBar />
      </div>
      {isScrolled && <div className="hidden lg:block" style={{ height: `${stickyHeaderHeight}px` }} />}
      {showNewsBar && (
        <div className="hidden lg:block">
          <NewsBar />
        </div>
      )}
      <div className={`lg:hidden block w-full ${type === 3 ? "bg-qh3-blue" : "bg-qyellow"} ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'}`}>
        <div className="w-full h-[60px] flex justify-between items-center px-3 sm:px-5" dir="ltr">
          {/* Left side: Cart icon and Social Media Icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="cart relative cursor-pointer flex items-center">
              <Link to="/cart" className="flex items-center relative">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-500/30 text-white relative">
                  <ThinBag className="text-white fill-current" />
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
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.facebook.com/people/%D8%A7%D9%84%D8%B9%D8%B2-%D9%84%D8%A3%D8%B1%D9%88%D8%A7%D8%A8-%D9%88%D8%B7%D9%88%D8%A7%D9%82%D9%8A-%D8%A7%D9%84%D8%AA%D8%AE%D8%B1%D8%AC/100057347534627/?mibextid=wwXIfr&rdid=KT4SsD8TdujnuifW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1FJFRMBu2X%2F%3Fmibextid%3DwwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/alezz_graduation?igsh=bDJxNjM4dWJyajZ1&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://wa.me/message/Z7UQEBQW4H5ZJ1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                aria-label="WhatsApp"
              >
                <WhatsApp className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2">
            <Link to="/" className="flex items-center gap-2 h-full">
              <img
                className="h-14 sm:h-16 md:h-20 w-auto object-contain flex-shrink-0"
                src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`}
                alt="logo"
                style={{ maxHeight: '80px', maxWidth: '160px' }}
                onError={(e) => {
                  // Fallback to logo.png if logo.jpeg fails
                  if (e.target.src !== `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`) {
                    e.target.src = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;
                  }
                }}
              />
              <span className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
              العز لأرواب وطواقي التخرج
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div onClick={drawerAction} className="flex-shrink-0 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
          </div>
        </div>
        <CategoriesBar />
      </div>
      {showNewsBar && (
        <div className="lg:hidden block">
          <NewsBar />
        </div>
      )}
      {isScrolled && <div className="lg:hidden block" style={{ height: '140px' }} />}
    </header>
  );
}
