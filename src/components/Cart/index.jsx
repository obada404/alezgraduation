import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Layout from "../Partials/Layout";
import { fetchCart, fetchCartById, updateCartItem, removeCartItem, clearCart } from "../../api/cart";
import { getToken, getIsAdmin } from "../../api/client";
import Spinner from "../Helpers/Spinner";
import { Link, useNavigate } from "react-router-dom";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo/jpeg`;

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartId = searchParams.get("cartId");
  const orderId = searchParams.get("orderId");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({}); // Local state for quantity inputs
  const isViewOnly = !!(cartId || orderId); // If cartId or orderId is provided, it's view-only mode

  // Redirect admin to admin order page if orderId is provided
  useEffect(() => {
    if (orderId && getIsAdmin()) {
      navigate(`/admin/order/${orderId}`, { replace: true });
    }
  }, [orderId, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      let data;
      // If cartId is provided in query params, fetch that specific cart (admin view)
      if (cartId) {
        data = await fetchCartById(cartId);
      } else {
        // Otherwise, fetch current user's cart
        if (!getToken()) {
          setLoading(false);
          setError("يجب تسجيل الدخول للمتابعة");
          return;
        }
        data = await fetchCart();
      }
      setCart(data);
    } catch (err) {
      let errorMsg = err.message || "حدث خطآ،جاري المتابعة";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        errorMsg = "يجب تسجيل الدخول للمتابعة";
      } else if (errorMsg.includes("Insufficient") || errorMsg.includes("quantity")) {
        errorMsg = "الكمية المتاحة غير كافية";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [cartId]);

  const handleQtyInputChange = (itemId, value) => {
    // Allow empty value or any numeric string for manual input
    setQuantityInputs((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleQtyBlur = async (itemId, currentValue) => {
    // Get the value from local state or use current value
    const inputValue = quantityInputs[itemId] !== undefined ? quantityInputs[itemId] : currentValue;
    const finalQty = inputValue === "" || inputValue === null || inputValue === undefined || inputValue < 1 ? 1 : inputValue;
    
    // Only update if different from current quantity
    if (finalQty !== currentValue) {
      await handleQtyChange(itemId, finalQty);
    }
    
    // Clear local state
    setQuantityInputs((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  const handleQtyKeyPress = async (e, itemId, currentValue) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleQtyBlur(itemId, currentValue);
    }
  };

  const handleQtyChange = async (itemId, qty) => {
    try {
      setUpdatingId(itemId);
      await updateCartItem(itemId, { quantity: qty });
      await loadCart();
    } catch (err) {
      let errorMsg = err.message || "حدث خطآ،جاري المتابعة";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        errorMsg = "يجب تسجيل الدخول للمتابعة";
      } else if (errorMsg.includes("Insufficient") || errorMsg.includes("quantity")) {
        errorMsg = "الكمية المتاحة غير كافية";
      }
      setError(errorMsg);
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
      let errorMsg = err.message || "حدث خطآ،جاري المتابعة";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        errorMsg = "يجب تسجيل الدخول للمتابعة";
      } else if (errorMsg.includes("Insufficient") || errorMsg.includes("quantity")) {
        errorMsg = "الكمية المتاحة غير كافية";
      }
      setError(errorMsg);
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
      let errorMsg = err.message || "حدث خطآ،جاري المتابعة";
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
        errorMsg = "يجب تسجيل الدخول للمتابعة";
      } else if (errorMsg.includes("Insufficient") || errorMsg.includes("quantity")) {
        errorMsg = "الكمية المتاحة غير كافية";
      }
      setError(errorMsg);
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

    // Get cart link
    const cartLink = cart?.id 
      ? `${window.location.origin}/cart?cartId=${cart.id}`
      : `${window.location.origin}/cart`;

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
    
    // Add cart link
    message += `رابط السلة: ${cartLink}\n\n`;
    
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
      <div className="container-x mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-qblack mb-2">
                {t("cart.yourCart")}
              </h1>
              <p className="text-sm sm:text-base text-qgray flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{cart?.items?.length || 0} {t("cart.itemsInCart")}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/products"
                className="h-[44px] px-6 rounded-lg border-2 border-qgray-border text-qblack text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50 hover:border-qyellow hover:text-qyellow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("cart.continueShopping")}
              </Link>
              {!isViewOnly && cart?.items?.length > 0 && (
                <button
                  onClick={handleClear}
                  disabled={updatingId === "clear"}
                  className="h-[44px] px-6 rounded-lg bg-red-50 border-2 border-red-200 text-red-600 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 hover:bg-red-100 hover:border-red-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updatingId === "clear" ? (
                    <>
                      <Spinner size="sm" />
                      <span>{t("cart.clearing")}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>{t("cart.clearCart")}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 sm:py-20 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-red-50 rounded-lg border-2 border-red-200">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-base sm:text-lg font-semibold">{error}</p>
            </div>
          </div>
        ) : cart?.items?.length ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Cart Items */}
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="group bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-qyellow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/products/${item?.product?.id}`}
                    className="w-full sm:w-32 h-32 sm:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={item?.product?.images?.[0]?.url || LOGO_URL}
                      alt={item?.product?.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {item?.product?.category?.name}
                      </span>
                    </div>
                    <Link to={`/products/${item?.product?.id}`}>
                      <h3 className="text-lg sm:text-xl font-bold text-qblack mb-2 group-hover:text-qyellow transition-colors duration-300">
                        {item?.product?.title || item?.product?.name}
                      </h3>
                    </Link>
                    {item?.size && (
                      <p className="text-sm text-qgray flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        <span>{t("cart.size")}: <strong>{item.size}</strong></span>
                      </p>
                    )}
                    {item?.color && (
                      <p className="text-sm text-qgray flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span>اللون: <strong>{item.color}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* Quantity, Price, and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Quantity Control */}
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-xs text-qgray font-medium">الكمية</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQtyChange(item.id, Math.max(1, item.quantity - 1))}
                          disabled={updatingId === item.id || isViewOnly || item.quantity <= 1}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-qyellow hover:text-qyellow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={quantityInputs[item.id] !== undefined ? (quantityInputs[item.id] === "" ? "" : quantityInputs[item.id]) : item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d+$/.test(value)) {
                              handleQtyInputChange(item.id, value);
                            }
                          }}
                          onBlur={() => handleQtyBlur(item.id, item.quantity)}
                          onKeyPress={(e) => handleQtyKeyPress(e, item.id, item.quantity)}
                          disabled={updatingId === item.id || isViewOnly}
                          className="w-16 h-10 border-2 border-gray-300 rounded-lg px-2 text-center text-sm font-semibold text-qblack disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-qyellow focus:border-qyellow transition-all duration-300"
                          placeholder="1"
                          style={{ 
                            WebkitAppearance: 'none', 
                            MozAppearance: 'textfield',
                            appearance: 'none'
                          }}
                        />
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id || isViewOnly}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-qyellow hover:text-qyellow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-center sm:items-end gap-1">
                      <span className="text-xs text-qgray">السعر</span>
                      <p className="text-xl sm:text-2xl font-bold text-qyellow">
                        ₪ {((item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-qgray">
                          ₪ {item.price || 0} × {item.quantity}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    {!isViewOnly && (
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={updatingId === item.id}
                        className="w-10 h-10 rounded-lg bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center hover:bg-red-100 hover:border-red-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t("cart.remove")}
                      >
                        {updatingId === item.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Summary Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 sm:p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-qyellow rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-qgray mb-1">الإجمالي الكلي</p>
                    <p className="text-3xl sm:text-4xl font-bold text-qblack">
                      ₪ {total.toFixed(2)}
                    </p>
                  </div>
                </div>
                {!isViewOnly && (
                  <button
                    onClick={handleCheckout}
                    className="h-[56px] px-8 rounded-xl bg-qyellow text-white text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {t("cart.checkout")}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex flex-col items-center gap-6 p-12 bg-gray-50 rounded-2xl border-2 border-gray-200 max-w-md">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-qblack mb-2">{t("cart.emptyCart")}</h3>
                <p className="text-qgray mb-6">ابدأ التسوق الآن!</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 h-[48px] px-8 rounded-xl bg-qyellow text-white text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {t("cart.browseProducts")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
