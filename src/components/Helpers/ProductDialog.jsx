import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { addToCart } from "../../api/cart";
import { getToken } from "../../api/client";
import { useMobileLogin } from "../../contexts/MobileLoginContext";
import Spinner from "./Spinner";
import { useState } from "react";
import PriceDisplay from "./PriceDisplay";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`;

export default function ProductDialog({ product, isOpen, onClose, onAddToCart }) {
  const { t } = useTranslation();
  const { showMobileLogin } = useMobileLogin();
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product) {
      // Set default size and image
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0]);
      }
      // Reset quantity to 1 when dialog opens
      setQuantity(1);
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
      showMobileLogin(() => {
        // After successful login, retry adding to cart
        handleAddToCart();
      });
      return;
    }

    try {
      setAdding(true);
      await addToCart({
        productId: product.id,
        quantity: quantity > 0 ? quantity : 1,
        size: selectedSize?.size || null,
      });
      // Dispatch event to update cart count in header
      window.dispatchEvent(new Event('cartUpdated'));
      if (onAddToCart) {
        onAddToCart();
      }
      onClose();
    } catch (err) {
      if (err.message?.includes("Unauthorized") || err.message?.includes("401")) {
        showMobileLogin(() => {
          // After successful login, retry adding to cart
          handleAddToCart();
        });
      }
    } finally {
      setAdding(false);
    }
  };

  const selectedSizeData = selectedSize || product?.sizes?.[0];
  const priceAfterDiscount = selectedSizeData?.priceAfterDiscount || selectedSizeData?.price || 0;
  const priceBeforeDiscount = selectedSizeData?.priceBeforeDiscount;
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
                <div className="mb-4">
                  <PriceDisplay 
                    priceAfterDiscount={priceAfterDiscount}
                    priceBeforeDiscount={priceBeforeDiscount}
                    className="text-3xl"
                  />
                </div>
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
                            ? "border-[#D4AF37] bg-[#0A1F44] text-[#D4AF37] shadow-md"
                            : "border-gray-300 text-qblack hover:border-[#D4AF37]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{size.size}</span>
                          <span className="h-4 w-px bg-gray-400"></span>
                          <PriceDisplay 
                            priceAfterDiscount={size.priceAfterDiscount || size.price}
                            priceBeforeDiscount={size.priceBeforeDiscount}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <label className="text-sm font-semibold text-qblack">الكمية</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity > 0 ? quantity : 1}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuantity(val >= 1 ? val : 1);
                    }}
                    onBlur={(e) => {
                      if (!e.target.value || Number(e.target.value) < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="w-16 h-10 border-2 border-gray-300 rounded-lg px-2 text-center text-sm font-semibold text-qblack focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 bg-white"
                    placeholder="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

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
                    className="w-full h-[50px] rounded-lg bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37] font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md"
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


