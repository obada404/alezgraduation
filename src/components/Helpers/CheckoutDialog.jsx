import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "./Spinner";
import { getMobileNumber } from "../../api/client";

const CITIES = [
  { value: "inside48", label: "الداخل ٤٨", deliveryCost: 70 },
  { value: "westbank", label: "الضفة الغربية", deliveryCost: 20 },
  { value: "jerusalem", label: "القدس", deliveryCost: 30 },
];

export default function CheckoutDialog({ isOpen, onClose, cart, total, onSubmit }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update phone when dialog opens or cart changes
  useEffect(() => {
    if (isOpen) {
      // Priority: stored mobile from login > cart user mobileNumber > cart phone > default
      const storedMobile = getMobileNumber();
      const newPhone = storedMobile || cart?.user?.mobileNumber || cart?.user?.phone || cart?.phone || "";
      setPhone(newPhone);
    }
  }, [isOpen, cart]);

  const selectedCity = CITIES.find((c) => c.value === city);
  const deliveryCost = selectedCity ? selectedCity.deliveryCost : 0;
  const grandTotal = total + deliveryCost;

  const handleClose = () => {
    setName("");
    const storedMobile = getMobileNumber();
    const defaultPhone = storedMobile || cart?.user?.mobileNumber || cart?.user?.phone || cart?.phone || "";
    setPhone(defaultPhone);
    setCity("");
    setAddress("");
    setNotes("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("الرجاء إدخال الاسم");
      return;
    }
    if (!phone.trim()) {
      setError("الرجاء إدخال رقم الهاتف");
      return;
    }
    if (!city) {
      setError("الرجاء اختيار المدينة");
      return;
    }
    if (!address.trim()) {
      setError("الرجاء إدخال العنوان");
      return;
    }

    try {
      setLoading(true);

      // Get cart link
      const cartLink = cart?.id 
        ? `${window.location.origin}/cart?cartId=${cart.id}`
        : `${window.location.origin}/cart`;

      // Format WhatsApp message
      let message = "مرحباً، أرغب في تقديم طلب جديد:\n\n";
      
      // Customer information
      message += "معلومات العميل:\n";
      message += `الاسم: ${name}\n`;
      message += `رقم الهاتف: ${phone}\n`;
      message += `المدينة: ${selectedCity?.label || city}\n`;
      message += `العنوان: ${address}\n`;
      if (notes.trim()) {
        message += `ملاحظات: ${notes}\n`;
      }
      message += "\n";

      // Cart items
      message += "المنتجات:\n";
      cart.items.forEach((item, index) => {
        message += `${index + 1}. ${item?.product?.title || item?.product?.name || "منتج"}\n`;
        if (item?.product?.category?.name) {
          message += `   الفئة: ${item.product.category.name}\n`;
        }
        if (item?.size) {
          message += `   المقاس: ${item.size}\n`;
        }
        if (item?.color) {
          message += `   اللون: ${item.color}\n`;
        }
        message += `   الكمية: ${item.quantity}\n`;
        message += `   السعر: ₪ ${item.price || 0}\n`;
        message += `   المجموع: ₪ ${(item.price || 0) * item.quantity}\n\n`;
      });

      message += `إجمالي المنتجات: ₪ ${total.toFixed(2)}\n`;
      message += `تكلفة التوصيل: ₪ ${deliveryCost.toFixed(2)}\n`;
      message += `الإجمالي الكلي: ₪ ${grandTotal.toFixed(2)}\n\n`;
      
      // Add phone number if available
      if (cart?.user?.phone || cart?.phone) {
        message += `رقم الهاتف: ${cart.user?.phone || cart.phone}\n\n`;
      }
      
      // Add cart link
      message += `رابط السلة: ${cartLink}\n\n`;
      
      message += "شكراً لكم";

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp phone number
      const phoneNumber = "970569027059";
      
      // Open WhatsApp chat in new tab
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      if (onSubmit) {
        onSubmit();
      }
      handleClose();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-qblack">تحقق من الطلب</h2>
          <button
            onClick={handleClose}
            className="text-qgray hover:text-qblack transition-colors"
            aria-label="إغلاق"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-qblack mb-2">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] px-4 bg-white border-2 border-qgray-border rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300"
              dir="rtl"
              disabled={loading}
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-qblack mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[48px] px-4 bg-white border-2 border-qgray-border rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300"
              dir="ltr"
              placeholder="+970XXXXXXXXX"
              disabled={loading}
              required
            />
          </div>

          {/* City Dropdown */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-qblack mb-2">
              المدينة
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-[48px] px-4 bg-white border-2 border-qgray-border rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300 appearance-none cursor-pointer"
              dir="rtl"
              disabled={loading}
              required
            >
              <option value="">اختر المدينة</option>
              {CITIES.map((cityOption) => (
                <option key={cityOption.value} value={cityOption.value}>
                  {cityOption.label}
                </option>
              ))}
            </select>
            {selectedCity && (
              <p className="mt-2 text-sm text-qgray">
                تكلفة التوصيل: ₪ {deliveryCost}
              </p>
            )}
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-qblack mb-2">
              العنوان
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-[48px] px-4 bg-white border-2 border-qgray-border rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300"
              dir="rtl"
              disabled={loading}
              required
            />
          </div>

          {/* Notes Input */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-qblack mb-2">
              ملاحظات
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-qgray-border rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300 resize-none"
              dir="rtl"
              disabled={loading}
            />
          </div>

          {/* Summary */}
          {selectedCity && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-qgray">إجمالي المنتجات:</span>
                <span className="text-sm font-semibold text-qblack">₪ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-qgray">تكلفة التوصيل:</span>
                <span className="text-sm font-semibold text-qblack">₪ {deliveryCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="text-base font-bold text-qblack">الإجمالي الكلي:</span>
                <span className="text-lg font-bold text-qblack">₪ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

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
                  جاري الإرسال...
                </span>
              ) : (
                "إرسال الطلب"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

