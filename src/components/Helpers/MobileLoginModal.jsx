import { useState } from "react";
import { useTranslation } from "react-i18next";
import { loginWithMobile } from "../../api/auth";
import Spinner from "./Spinner";

export default function MobileLoginModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setMobileNumber("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!mobileNumber.trim()) {
      setError("الرجاء إدخال رقم الهاتف");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await loginWithMobile(mobileNumber);
      setMobileNumber("");
      setError("");
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (err) {
      const errorMessage = err.message || "حدث خطأ أثناء تسجيل الدخول";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-qblack">الرجاء ادخال رقم الجوال</h2>
          <button
            onClick={handleClose}
            className="text-qgray hover:text-qblack transition-colors"
            aria-label="إغلاق"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full h-[48px] px-4 bg-white border-2 border-qgray-border rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300"
              dir="ltr"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-[48px] px-4 rounded-md bg-gray-100 text-qblack font-semibold transition-all duration-300 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 h-[48px] px-4 rounded-md bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37] font-semibold transition-all duration-300 hover:bg-[#0A1F44]/90 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-[#D4AF37]" />
                  جاري التسجيل...
                </span>
              ) : (
                "موافق"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

