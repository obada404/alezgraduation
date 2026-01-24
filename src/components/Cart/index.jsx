import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchCart, updateCartItem, removeCartItem, clearCart } from "../../api/cart";
import { getToken } from "../../api/client";
import { Link, useNavigate } from "react-router-dom";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      const errorMsg = err.message || "Failed to load cart";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        setError("يجب تسجيل الدخول للمتابعة");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      setError("يجب تسجيل الدخول للمتابعة");
    } else {
      loadCart();
    }
  }, []);

  const handleQtyChange = async (itemId, qty) => {
    try {
      setUpdatingId(itemId);
      await updateCartItem(itemId, { quantity: qty });
      await loadCart();
    } catch (err) {
      const errorMsg = err.message || "Failed to update quantity";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        setError("يجب تسجيل الدخول للمتابعة");
      } else {
        setError(errorMsg);
      }
    } finally {
      setUpdatingId("");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setUpdatingId(itemId);
      await removeCartItem(itemId);
      await loadCart();
    } catch (err) {
      const errorMsg = err.message || "Failed to remove item";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        setError("يجب تسجيل الدخول للمتابعة");
      } else {
        setError(errorMsg);
      }
    } finally {
      setUpdatingId("");
    }
  };

  const handleClear = async () => {
    try {
      setUpdatingId("clear");
      await clearCart();
      await loadCart();
    } catch (err) {
      const errorMsg = err.message || "Failed to clear cart";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        setError("يجب تسجيل الدخول للمتابعة");
      } else {
        setError(errorMsg);
      }
    } finally {
      setUpdatingId("");
    }
  };

  const total =
    cart?.items?.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    ) || 0;

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      return;
    }

    // Format WhatsApp message
    let message = "مرحباً، أرغب في تقديم طلب جديد:\n\n";
    
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

    message += `الإجمالي الكلي: ₪ ${total.toFixed(2)}\n\n`;
    
    // Add phone number if available
    if (cart?.user?.phone || cart?.phone) {
      message += `رقم الهاتف: ${cart.user?.phone || cart.phone}\n\n`;
    }
    
    message += "شكراً لكم";

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp phone number (remove leading zeros and use + sign)
    const phoneNumber = "970569027059"; // Remove 00 and use country code directly
    
    // Open WhatsApp chat in new tab
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Layout>
      <div className="container-x mx-auto py-4 sm:py-6 md:py-10 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-qblack">{t("cart.yourCart")}</h1>
            <p className="text-xs sm:text-sm text-qgray">
              {cart?.items?.length || 0} {t("cart.itemsInCart")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              to="/products"
              className="h-[32px] sm:h-[40px] px-3 sm:px-4 rounded border border-qgray-border text-qblack text-xs sm:text-sm font-semibold inline-flex items-center justify-center"
            >
              {t("cart.continueShopping")}
            </Link>
            <button
              onClick={handleClear}
              disabled={updatingId === "clear"}
              className="h-[32px] sm:h-[40px] px-3 sm:px-4 rounded bg-qyellow text-qblack text-xs sm:text-sm font-semibold disabled:opacity-60"
            >
              {updatingId === "clear" ? t("cart.clearing") : t("cart.clearCart")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 sm:py-10 text-qgray text-sm sm:text-base">{t("cart.loading")}</div>
        ) : error ? (
          <div className="text-center py-6 sm:py-10 text-qred text-sm sm:text-base">{error}</div>
        ) : cart?.items?.length ? (
          <div className="space-y-3 sm:space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-qgray-border rounded p-3 sm:p-4 gap-3 sm:gap-0"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primarygray rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={item?.product?.images?.[0]?.url || LOGO_URL}
                      alt={item?.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-qgray">
                      {item?.product?.category?.name}
                    </p>
                    <h3 className="text-sm sm:text-base font-semibold text-qblack truncate">
                      {item?.product?.title || item?.product?.name}
                    </h3>
                    {item?.size ? (
                      <p className="text-xs text-qgray">{t("cart.size")}: {item.size}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4 gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQtyChange(item.id, Number(e.target.value) || 1)
                    }
                    className="w-16 sm:w-20 h-[32px] sm:h-[40px] border border-qgray-border rounded px-2 text-xs sm:text-sm"
                  />
                  <p className="text-sm sm:text-lg font-semibold text-qblack whitespace-nowrap">
                  ₪ {(item.price || 0) * item.quantity}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={updatingId === item.id}
                    className="h-[32px] sm:h-[40px] px-2 sm:px-3 rounded border border-qgray-border text-qblack text-xs sm:text-sm font-semibold disabled:opacity-60 whitespace-nowrap"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 sm:pt-4 border-t border-qgray-border gap-3 sm:gap-0">
              <p className="text-base sm:text-xl font-bold text-qblack">{t("cart.total")}: ₪ {total}</p>
              <button
                onClick={handleCheckout}
                className="h-[36px] sm:h-[44px] px-4 sm:px-6 rounded bg-qyellow text-qblack text-sm sm:text-base font-semibold w-full sm:w-auto"
              >
                {t("cart.checkout")}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-10 text-qgray text-sm sm:text-base">
            {t("cart.emptyCart")}{" "}
            <Link className="text-qyellow font-semibold" to="/products">
              {t("cart.browseProducts")}
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
