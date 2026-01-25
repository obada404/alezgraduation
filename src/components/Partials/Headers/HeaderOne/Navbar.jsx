import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import TikTok from "../../../Helpers/icons/TikTok";
import WhatsApp from "../../../Helpers/icons/WhatsApp";
import { getToken, clearToken, getIsAdmin } from "../../../../api/client";
import { fetchCart } from "../../../../api/cart";

export default function Navbar({ className, type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is logged in and update on navigation
  useEffect(() => {
    const checkLogin = () => {
      const token = getToken();
      setIsLoggedIn(!!token);
      setIsAdmin(getIsAdmin());
    };
    checkLogin();
    // Check periodically for token changes (in case login happens in another tab/component)
    const interval = setInterval(checkLogin, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch cart items count - only when location changes, not on interval
  useEffect(() => {
    const loadCartCount = async () => {
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
          // If API call succeeds, user is logged in
          setIsLoggedIn(true);
        } catch (err) {
          // If error is 401 (Unauthorized), token is invalid or expired
          if (err.message && (err.message.includes("401") || err.message.includes("Unauthorized"))) {
            clearToken();
            setIsLoggedIn(false);
            setIsAdmin(false);
          }
          setCartItemsCount(0);
        }
      } else {
        setIsLoggedIn(false);
        setCartItemsCount(0);
      }
    };
    loadCartCount();
    // Only refresh when location changes, not on interval to avoid multiple API calls
  }, [location]);


  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAccountDropdown(false);
    navigate("/");
    window.location.reload(); // Refresh to update all components
  };


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
                    className="object-contain h-full max-h-[90px] w-auto max-w-[120px]"
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
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin-dashboard"
                        className={`text-sm font-600 transition-all duration-300 relative group px-1 py-1 rounded-md text-white hover:bg-white/20`}
                      >
                        لوحة التحكم
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 fill-current" />
                </a>
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 text-white bg-gray-500/30 hover:bg-white/20"
                  aria-label="TikTok"
                >
                  <TikTok className="w-4 h-4 fill-current" />
                </a>
                <a
                  href="https://wa.me/970569027059"
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
              <div className="account relative flex items-center">
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-500/30 text-white transition-all duration-300 hover:bg-white/20"
                  type="button"
                >
                  <ThinPeople className="text-white fill-current" />
                </button>
                {accountDropdown && (
                  <>
                    <div
                      className="fixed top-0 left-0 w-full h-full -z-10"
                      onClick={() => setAccountDropdown(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-[180px] bg-white border border-qgray-border rounded shadow-lg z-50">
                      <ul className="py-2">
                        {isLoggedIn ? (
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full text-right px-4 py-2 text-sm text-qblack hover:bg-qyellow hover:text-white transition-colors"
                            >
                              {t("nav.logout")}
                            </button>
                          </li>
                        ) : (
                          <li>
                            <Link
                              to="/login"
                              onClick={() => setAccountDropdown(false)}
                              className="block w-full text-right px-4 py-2 text-sm text-qblack hover:bg-qyellow hover:text-white transition-colors"
                            >
                              {t("nav.login")}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
