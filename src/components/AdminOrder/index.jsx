import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchOrderById } from "../../api/orders";
import { getToken, getIsAdmin } from "../../api/client";
import Spinner from "../Helpers/Spinner";
import { QRCodeSVG } from "qrcode.react";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`;

export default function AdminOrder() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!getToken()) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await fetchOrderById(orderId);
        setOrder(data);
        // Set QR code data after order is loaded
        // QR Code should always point to cart page, and the cart page will check if user is admin
        if (data?.id) {
          const origin = window.location.origin;
          // Check if order has cartId or cart property
          const cartId = data?.cartId || data?.cart?.id;
          if (cartId) {
            // Always link to cart page with cartId
            // The cart page will redirect admin to admin/order if needed
            setQrData(`${origin}/cart?cartId=${cartId}&orderId=${data.id}`);
          } else {
            // Fallback: if no cartId, use orderId (though this shouldn't happen)
            setQrData(`${origin}/cart?orderId=${data.id}`);
          }
        }
      } catch (err) {
        const errorMsg = err.message || "حدث خطآ،جاري المتابعة";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
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

  if (!order) {
    return (
      <Layout>
        <div className="container-x mx-auto py-10 text-center text-qgray">
          الطلب غير موجود
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
            <p className="text-qgray">رقم الطلب: {order.id}</p>
            {order.user && (
              <div className="mt-4 text-right">
                <p className="text-sm text-qblack">
                  <span className="font-semibold">العميل:</span> {order.user.email}
                </p>
                {order.user.mobileNumber && (
                  <p className="text-sm text-qblack">
                    <span className="font-semibold">رقم الهاتف:</span> {order.user.mobileNumber}
                  </p>
                )}
              </div>
            )}
            {order.createdAt && (
              <p className="text-sm text-qgray mt-2">
                التاريخ: {new Date(order.createdAt).toLocaleDateString("ar-SA", {
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
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => {
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
                      لا توجد منتجات في الطلب
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
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
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

