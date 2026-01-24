import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
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
      setIsLoggedIn(!!getToken());
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
            <div className="category-and-nav flex xl:space-x-7 space-x-3 items-center">
              <div className="logo">
                <Link to="/">
                  <img
                    width="100"
                    height="90"
                    src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`}
                    alt="logo"
                    className="object-contain"
                  />
                </Link>
              </div>
              <div className="nav">
                <ul className="nav-wrapper flex xl:space-x-10 space-x-5 items-center">
                  <li>
                    <Link
                      to="/"
                      className={`text-sm font-600 ml-9 transition-all duration-300 relative group px-1 py-2 rounded-md ${
                        'hover:bg-white' 
                      }`}
                    >
                      {t("nav.home")}
                      <span className="absolute inset-0 bg-qyellow opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className={`text-sm font-600 ml-4 transition-all duration-300 relative group px-1 py-2 rounded-md ${
                        'hover:bg-white' 
                      }`}
                    >
                      منتجاتنا
                      <span className="absolute inset-0 bg-qyellow opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className={`text-sm font-600 transition-all duration-300 relative group px-1 py-2 rounded-md ${
'hover:bg-white'                       }`}
                    >
                      {t("nav.about")}
                      <span className="absolute inset-0 bg-qyellow opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className={`text-sm font-600 transition-all duration-300 relative group px-1 py-2 rounded-md ${
'hover:bg-white'                       }`}
                    >
                      {t("nav.privacy")}
                      <span className="absolute inset-0 bg-qyellow opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/location"
                      className={`text-sm font-600 transition-all duration-300 relative group px-1 py-2 rounded-md ${
'hover:bg-white'                       }`}
                    >
                      {t("nav.location")}
                      <span className="absolute inset-0 bg-qyellow opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin-dashboard"
                        className={`text-sm font-600 transition-all duration-300 relative group px-1 py-1 rounded-md ${
'hover:bg-white'                       }`}
                      >
                        لوحة التحكم
                        <span className="absolute inset-0 bg-qyellow opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="cart relative cursor-pointer flex items-center">
                <Link to="/cart" className="flex items-center ml-5 relative">
                  <span className={`flex items-center relative ${type === 3 ? "text-white" : "text-qblacktext"}`}>
                    <ThinBag />
                    {cartItemsCount > 0 && (
                      <span
                        className={`min-w-[18px] h-[18px] px-1 rounded-full absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-[9px] font-bold leading-none whitespace-nowrap z-10 ${
                          type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow text-qblack"
                        }`}
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
                  className={`flex items-center ${type === 3 ? "text-white" : "text-qblacktext"}`}
                  type="button"
                >
                  <ThinPeople />
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
                              className="w-full text-right px-4 py-2 text-sm text-qblack hover:bg-qyellow transition-colors"
                            >
                              {t("nav.logout")}
                            </button>
                          </li>
                        ) : (
                          <li>
                            <Link
                              to="/login"
                              onClick={() => setAccountDropdown(false)}
                              className="block w-full text-right px-4 py-2 text-sm text-qblack hover:bg-qyellow transition-colors"
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
