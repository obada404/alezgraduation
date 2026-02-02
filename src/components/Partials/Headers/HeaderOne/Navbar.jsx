import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useTranslation } from "react-i18next";
import ThinBag from "../../../Helpers/icons/ThinBag";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import WhatsApp from "../../../Helpers/icons/WhatsApp";
import { getToken, clearToken } from "../../../../api/client";
import { fetchCart } from "../../../../api/cart";

export default function Navbar({ className, type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItemsCount, setCartItemsCount] = useState(0);


  // Function to load cart count
  const loadCartCount = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        const cartData = await fetchCart();
        if (cartData && cartData.items) {
          const totalItems = cartData.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
          setCartItemsCount(totalItems);
        } else {
          setCartItemsCount(0);
        }
      } catch (err) {
        // If error is 401 (Unauthorized), token is invalid or expired
        if (err.message && (err.message.includes("401") || err.message.includes("Unauthorized"))) {
          clearToken();
        }
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




  return (
    <div
      className={`nav-widget-wrapper w-full  h-[90px] relative z-30 ${
        type === 3 ? "bg-qh3-blue" : "bg-qyellow"
      }  ${className || ""}`}
    >
      <div className="container-x mx-auto h-full">
        <div className="w-full h-full relative">
          <div className="w-full h-full flex justify-between items-center">
            <div className="category-and-nav flex xl:space-x-7 space-x-3 items-center flex-1 min-w-0">
              <div className="logo flex-shrink-0 h-full flex items-center">
                <Link to="/" className="flex items-center h-full">
                  <img
                    src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`}
                    alt="logo"
                    className="object-contain h-full max-h-[90px] w-auto max-w-[120px] sm:max-w-[100px] md:max-w-[120px]"
                    style={{ maxWidth: 'clamp(80px, 20vw, 120px)' }}
                    onError={(e) => {
                      // Fallback to logo.png if logo.jpeg fails
                      if (e.target.src !== `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`) {
                        e.target.src = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;
                      }
                    }}
                  />
                </Link>
              </div>
              <div className="nav flex-shrink-0">
                <ul className="nav-wrapper flex xl:space-x-10 space-x-5 items-center">
                  <li>
                    <Link
                      to="/"
                      className={`text-sm font-600 ml-9 transition-all duration-300 relative group px-1 py-2 rounded-md text-white hover:bg-white/20`}
                    >
                      {t("nav.home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className={`text-sm font-600 ml-4 transition-all duration-300 relative group px-1 py-2 rounded-md text-white hover:bg-white/20`}
                    >
                      منتجاتنا
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className={`text-sm font-600 transition-all duration-300 relative group px-1 py-2 rounded-md text-white hover:bg-white/20`}
                    >
                      {t("nav.about")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className={`text-sm font-600 transition-all duration-300 relative group px-1 py-2 rounded-md text-white hover:bg-white/20`}
                    >
                      {t("nav.privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/location"
                      className={`text-sm font-600 transition-all duration-300 relative group px-1 py-2 rounded-md text-white hover:bg-white/20`}
                    >
                      {t("nav.location")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <a
                  href="https://www.facebook.com/people/%D8%A7%D9%84%D8%B9%D8%B2-%D9%84%D8%A3%D8%B1%D9%88%D8%A7%D8%A8-%D9%88%D8%B7%D9%88%D8%A7%D9%82%D9%8A-%D8%A7%D9%84%D8%AA%D8%AE%D8%B1%D8%AC/100057347534627/?mibextid=wwXIfr&rdid=KT4SsD8TdujnuifW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1FJFRMBu2X%2F%3Fmibextid%3DwwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
                <a
                  href="https://www.instagram.com/alezz_graduation?igsh=bDJxNjM4dWJyajZ1&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 fill-current" />
                </a>
                <a
                  href="https://wa.me/message/Z7UQEBQW4H5ZJ1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                  aria-label="WhatsApp"
                >
                  <WhatsApp className="w-4 h-4 fill-current" />
                </a>
              </div>
              <div className="cart relative cursor-pointer flex items-center">
                <Link to="/cart" className="flex items-center  mr-4 relative">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-500/30 text-white relative">
                    <ThinBag className="text-white fill-current" />
                    {cartItemsCount > 0 && (
                      <span
                        className="min-w-[18px] h-[18px] px-1 rounded-full absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-[9px] font-bold leading-none whitespace-nowrap z-10 bg-white text-qyellow"
                      >
                        {cartItemsCount > 99 ? "99+" : cartItemsCount}
                      </span>
                    )}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
