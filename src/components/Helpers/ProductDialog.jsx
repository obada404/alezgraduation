import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { addToCart } from "../../api/cart";
import { getToken } from "../../api/client";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useState } from "react";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`;

export default function ProductDialog({ product, isOpen, onClose, onAddToCart }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      // Set default size and image
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0]);
      }
      // Prevent body scroll when dialog is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await addToCart({
        productId: product.id,
        quantity: 1,
        size: selectedSize?.size || null,
      });
      if (onAddToCart) {
        onAddToCart();
      }
      onClose();
    } catch (err) {
      if (err.message?.includes("Unauthorized") || err.message?.includes("401")) {
        navigate("/login");
      }
    } finally {
      setAdding(false);
    }
  };

  const price = selectedSize?.price || product?.sizes?.[0]?.price || 0;
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;
  const currentImage = selectedImage?.url || product?.images?.[0]?.url || LOGO_URL;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-qblack">
            {product?.title || product?.name}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product?.title || product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage?.url === img.url
                          ? "border-qyellow"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img.url || LOGO_URL}
                        alt={`${product?.title || product?.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-qgray mb-2">
                  {product?.category?.name}
                </p>
                <h3 className="text-2xl font-bold text-qblack mb-4">
                  {product?.title || product?.name}
                </h3>
                <p className="text-3xl font-bold text-qyellow mb-4">
                  ₪ {price}
                </p>
              </div>

              {/* Description */}
              {product?.description && (
                <div>
                  <h4 className="text-lg font-semibold text-qblack mb-2">
                    الوصف
                  </h4>
                  <p className="text-qgray leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Note */}
              {product?.note && (
                <div>
                  <h4 className="text-lg font-semibold text-qblack mb-2">
                    ملاحظات
                  </h4>
                  <p className="text-qgray leading-relaxed whitespace-pre-line">
                    {product.note}
                  </p>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-qblack mb-3">
                    المقاسات المتاحة
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                          selectedSize?.size === size.size
                            ? "border-qyellow bg-qyellow text-white"
                            : "border-gray-300 text-qblack hover:border-qyellow"
                        }`}
                      >
                        {size.size} - ₪ {size.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="pt-4">
                {isSoldOut ? (
                  <button
                    disabled
                    className="w-full h-[50px] rounded-lg bg-gray-300 text-white font-semibold cursor-not-allowed"
                  >
                    {t("common.soldOut")}
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full h-[50px] rounded-lg bg-qyellow text-white font-semibold transition-all duration-300 hover:bg-opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {adding ? (
                      <>
                        <Spinner size="sm" />
                        <span>جاري الإضافة...</span>
                      </>
                    ) : (
                      "أضف إلى السلة"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

