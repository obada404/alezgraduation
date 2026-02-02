import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getIsAdmin } from "../../../api/client";

export default function Drawer({ className, open, action, type = 1 }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(getIsAdmin());
    };
    checkAdmin();
    // Check periodically for admin status changes
    const interval = setInterval(checkAdmin, 1000);
    return () => clearInterval(interval);
  }, [location]);
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
          className={`w-[300px] transition-all duration-300 ease-in-out h-screen overflow-y-auto overflow-x-hidden ${
            type === 3 ? "bg-qh3-blue" : "bg-qyellow"
          } fixed top-0 z-[60] shadow-2xl ${
            open ? "right-0" : "-right-[300px]"
          }`}
        >
          {/* Header with close button */}
          <div className={`w-full px-6 py-6 border-b ${
            type === 3 ? "border-qh3-blue/30" : "border-qyellow/30"
          } ${type === 3 ? "bg-qh3-blue" : "bg-qyellow"}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`}
                  alt="logo"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    if (e.target.src !== `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`) {
                      e.target.src = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;
                    }
                  }}
                />
                <span className="text-white text-sm font-bold">العز لارواب وطواقي التخرج</span>
              </div>
              <button 
                onClick={action} 
                type="button"
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="w-full py-4 px-2">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  onClick={action}
                  className="flex items-center gap-3 w-full text-right px-4 py-3 text-base font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  onClick={action}
                  className="flex items-center gap-3 w-full text-right px-4 py-3 text-base font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  منتجاتنا
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={action}
                  className="flex items-center gap-3 w-full text-right px-4 py-3 text-base font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  onClick={action}
                  className="flex items-center gap-3 w-full text-right px-4 py-3 text-base font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t("nav.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/location"
                  onClick={action}
                  className="flex items-center gap-3 w-full text-right px-4 py-3 text-base font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t("nav.location")}
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin-dashboard"
                    onClick={action}
                    className="flex items-center gap-3 w-full text-right px-4 py-3 text-base font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t("nav.adminDashboard")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
