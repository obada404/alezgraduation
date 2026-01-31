import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getToken, clearToken, getIsAdmin } from "../../../api/client";

export default function Drawer({ className, open, action }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!getToken());
      setIsAdmin(getIsAdmin());
    };
    checkLogin();
    // Check periodically for token changes (in case login happens in another tab/component)
    const interval = setInterval(checkLogin, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    action(); // Close drawer
    navigate("/");
    window.location.reload(); // Refresh to update all components
  };
  return (
    <>
      <div
        className={`drawer-wrapper w-full  h-full relative block lg:hidden  ${
          className || ""
        }`}
      >
        {open && (
          <div
            onClick={action}
            className="w-full h-screen bg-black bg-opacity-40 z-[55] right-0 top-0 fixed"
          ></div>
        )}
        <div
          className={`w-[280px] transition-all duration-300 ease-in-out h-screen overflow-y-auto overflow-x-hidden overflow-style-none bg-white fixed top-0 z-[60] ${
            open ? "right-0" : "-right-[280px]"
          }`}
        >
          <div className="w-full px-5 mt-5 mb-4">
            <div className="flex justify-start items-center">
              <button onClick={action} type="button">
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
              </button>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="w-full mt-5 px-5 mb-3">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  منتجاتنا
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  {t("nav.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/location"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  {t("nav.location")}
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin-dashboard"
                    onClick={action}
                    className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                  >
                    {t("nav.adminDashboard")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Account Section - At the end */}
          <div className="w-full mt-5 px-5 mb-5 border-t border-qgray-border pt-5">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/signup"
                  onClick={action}
                  className="block w-full text-right text-sm font-semibold text-qblack hover:text-qyellow transition-colors py-2 mt-2"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
