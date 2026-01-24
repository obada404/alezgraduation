import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchProduct } from "../../api/products";
import { addToCart } from "../../api/cart";
import { getToken } from "../../api/client";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await fetchProduct(id);
        setProduct(data);
        if (data?.sizes?.length) {
          setSelectedSize(data.sizes[0].size);
        }
        if (data?.images?.[0]?.url) {
          setSelectedImage(data.images[0].url);
        }
      } catch (err) {
        const errorMsg = err.message || "Failed to load product";
        if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
          // Allow viewing product even if unauthorized, just show error gracefully
          setError("فشل في تحميل تفاصيل المنتج");
        } else {
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!getToken()) {
      navigate("/login");
      return;
    }
    try {
      setAdding(true);
      await addToCart({
        productId: product.id,
        quantity,
        size: selectedSize || null,
      });
    } catch (err) {
      setError(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-x mx-auto py-10 text-center text-qgray">
          Loading product...
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

  if (!product) {
    return null;
  }

  const price =
    product?.sizes?.find((s) => s.size === selectedSize)?.price ||
    product?.sizes?.[0]?.price ||
    0;

  const mainImage = selectedImage || product?.images?.[0]?.url || LOGO_URL;
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;

  return (
    <Layout>
      <div className="container-x mx-auto py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative">
            {isSoldOut && (
              <div className="absolute top-4 right-4 bg-qred text-white px-4 py-2 rounded text-sm font-semibold z-10">
                {t("common.soldOut")}
              </div>
            )}
            <div className={`w-full h-[420px] bg-primarygray rounded flex items-center justify-center overflow-hidden ${isSoldOut ? 'opacity-60' : ''}`}>
              <img
                src={mainImage || LOGO_URL}
                alt={product?.title || product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product?.images?.length > 0 ? (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {product.images.map((img, imgIndex) => {
                  const handleImageClick = () => {
                    setSelectedImage(img.url || LOGO_URL);
                    // When clicking an image, select the corresponding size by index
                    if (product?.sizes && product.sizes.length > imgIndex) {
                      setSelectedSize(product.sizes[imgIndex].size);
                    }
                  };
                  return (
                    <img
                      key={img.id}
                      src={img.url || LOGO_URL}
                      alt={img.alt || product?.title}
                      onClick={handleImageClick}
                      className={`h-20 w-full object-cover rounded border cursor-pointer transition-all ${
                        (img.url || LOGO_URL) === mainImage ? "border-qyellow" : "border-transparent hover:border-qgray"
                      }`}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-qgray uppercase">
              {product?.category?.name}
            </p>
            <h1 className="text-2xl font-bold text-qblack">
              {product?.title || product?.name}
            </h1>
            <p className="text-lg font-semibold text-qblack">₪ {price}</p>
            <p className="text-qgray">{product?.description}</p>

            {product?.sizes?.length ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-qblack">القياسات</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, sizeIndex) => {
                    const handleSizeClick = () => {
                      setSelectedSize(s.size);
                      // When selecting a size, show the corresponding image by index
                      if (product?.images && product.images.length > sizeIndex) {
                        setSelectedImage(product.images[sizeIndex].url || LOGO_URL);
                      }
                    };
                    return (
                      <button
                        key={s.id}
                        onClick={handleSizeClick}
                        className={`px-3 py-1 border rounded ${
                          selectedSize === s.size
                            ? "border-qyellow bg-qyellow text-qblack"
                            : "border-qgray-border text-qblack"
                        }`}
                      >
                        {s.size} (₪ {s.price})
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-qblack">الكمية</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-20 h-[42px] border border-qgray-border rounded px-2"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              {isSoldOut ? (
                <button
                  disabled
                  className="h-[44px] px-5 rounded bg-qgray text-white font-semibold cursor-not-allowed opacity-60"
                >
                  {t("common.soldOut")}
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="h-[44px] px-5 rounded bg-qyellow text-qblack font-semibold disabled:opacity-60"
                >
                  {adding ? "Adding..." : "Add to cart"}
                </button>
              )}
              <button
                onClick={() => navigate("/cart")}
                className="h-[44px] px-5 rounded border border-qgray-border text-qblack font-semibold"
              >
                Go to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
