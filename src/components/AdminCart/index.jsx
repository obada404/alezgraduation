import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchCartById } from "../../api/cart";
import { getToken } from "../../api/client";
import { createOrderFromCart } from "../../api/orders";
import Spinner from "../Helpers/Spinner";
import { QRCodeSVG } from "qrcode.react";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`;

export default function AdminCart() {
  const { t } = useTranslation();
  const { cartId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [success, setSuccess] = useState("");
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      if (!getToken()) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await fetchCartById(cartId);
        setCart(data);
        // Set QR code data after cart is loaded - link to cart page with cartId
        if (data?.id) {
          const origin = window.location.origin;
          setQrData(`${origin}/cart?cartId=${data.id}`);
        }
      } catch (err) {
        const errorMsg = err.message || "حدث خطآ،جاري المتابعة";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (cartId) {
      loadCart();
    }
  }, [cartId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
  };


  const handleCreateOrder = async () => {
    if (!cart?.id) {
      setError("لا يمكن إنشاء طلب بدون معرف السلة");
      return;
    }

    try {
      setCreatingOrder(true);
      setError("");
      setSuccess("");
      const order = await createOrderFromCart({ cartId: cart.id });
      setSuccess(`تم إنشاء الطلب بنجاح! رقم الطلب: ${order.id || order.orderId || "غير متوفر"}`);
      // Optionally refresh cart data
      const updatedCart = await fetchCartById(cartId);
      setCart(updatedCart);
    } catch (err) {
      const errorMsg = err.message || "حدث خطآ،جاري المتابعة";
      setError(errorMsg);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-x mx-auto py-10 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container-x mx-auto py-10 text-center text-qred">
          {error}
        </div>
      </Layout>
    );
  }

  if (!cart) {
    return (
      <Layout>
        <div className="container-x mx-auto py-10 text-center text-qgray">
          السلة غير موجودة
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-x mx-auto py-10">
        {/* Print button - hidden when printing */}
        <div className="mb-6 print:hidden flex gap-4 flex-wrap">
          <button
            onClick={handleCreateOrder}
            disabled={creatingOrder || !cart?.id}
            className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {creatingOrder ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>جاري إنشاء الطلب...</span>
              </>
            ) : (
              "إنشاء طلب"
            )}
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-qyellow text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors"
          >
            طباعة الفاتورة
          </button>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-6 py-3 bg-gray-200 text-qblack rounded-md font-semibold hover:bg-gray-300 transition-colors"
          >
            العودة للوحة التحكم
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            {error}
          </div>
        )}

        {/* Bill Content - visible when printing */}
        <div className="bg-white border border-qgray-border rounded-lg p-6 print:border-0 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 print:mb-6">
            <img
              src={LOGO_URL}
              alt="Logo"
              className="mx-auto mb-4 h-20 print:h-16"
              onError={(e) => {
                // Fallback to logo.png if logo.jpeg fails
                if (e.target.src !== `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`) {
                  e.target.src = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;
                }
              }}
            />
            <h1 className="text-2xl font-bold text-qblack mb-2">فاتورة</h1>
            <p className="text-qgray">رقم الفاتورة: {cart.id}</p>
            {cart.user && (
              <div className="mt-4 text-right">
                <p className="text-sm text-qblack">
                  <span className="font-semibold">العميل:</span> {cart.user.email}
                </p>
                {cart.user.mobileNumber && (
                  <p className="text-sm text-qblack">
                    <span className="font-semibold">رقم الهاتف:</span> {cart.user.mobileNumber}
                  </p>
                )}
                {cart.phone && (
                  <p className="text-sm text-qblack">
                    <span className="font-semibold">رقم الهاتف:</span> {cart.phone}
                  </p>
                )}
              </div>
            )}
            {cart.createdAt && (
              <p className="text-sm text-qgray mt-2">
                التاريخ: {new Date(cart.createdAt).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {/* QR Code */}
          {qrData && (
            <div className="flex justify-center mb-6 print:mb-4">
              <div className="bg-white p-4 border border-qgray-border rounded-md">
                <QRCodeSVG value={qrData} size={120} level="H" />
                {/* <p className="text-xs text-center text-qgray mt-2">رمز الاستجابة السريعة</p> */}
                {/* <p className="text-xs text-center text-qgray mt-1 break-all max-w-[200px] mx-auto">{qrData}</p> */}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 print:bg-gray-100">
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    #
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    الصورة
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    المنتج
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    الفئة
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    المقاس
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    اللون
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    الكمية
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    السعر
                  </th>
                  <th className="border border-qgray-border px-4 py-3 text-right text-sm font-semibold text-qblack">
                    المجموع
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item, index) => {
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    const productImage = item.product?.images?.[0]?.url || 
                                       item.product?.imageUrl || 
                                       LOGO_URL;
                    return (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          {index + 1}
                        </td>
                        <td className="border border-qgray-border px-4 py-3">
                          <img
                            src={productImage}
                            alt={item.product?.title || item.product?.name || "منتج"}
                            className="w-16 h-16 object-cover rounded-md mx-auto"
                          />
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          {item.product?.title || item.product?.name || "منتج"}
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          {item.product?.category?.name || "-"}
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          {item.size || "-"}
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          {item.color || "-"}
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          {item.quantity || 1}
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack">
                          ₪ {item.price || 0}
                        </td>
                        <td className="border border-qgray-border px-4 py-3 text-sm text-qblack font-semibold">
                          ₪ {itemTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="border border-qgray-border px-4 py-8 text-center text-qgray">
                      لا توجد منتجات في السلة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-6">
            <div className="w-full md:w-1/3 border-t-2 border-qgray-border pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-qblack">الإجمالي:</span>
                <span className="text-xl font-bold text-qblack">₪ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-qgray border-t border-qgray-border pt-4 print:pt-2">
            <p>شكراً لكم على اختياركم</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container-x, .container-x * {
            visibility: visible;
          }
          .container-x {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          .print\\:h-16 {
            height: 4rem !important;
          }
          .print\\:pt-2 {
            padding-top: 0.5rem !important;
          }
        }
      `}</style>
    </Layout>
  );
}

