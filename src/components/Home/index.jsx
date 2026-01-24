import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchProducts } from "../../api/products";
import { fetchPromotions } from "../../api/promotions";
import { getToken } from "../../api/client";
import SimpleSlider from "../Helpers/SliderCom";

function PromoBanner({ promotion }) {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-qyellow text-qblack rounded-lg p-5 flex justify-between items-center">
      <div>
        {/* <p className="text-xs uppercase font-semibold">{t("common.promotion")}</p> */}
        <h3 className="text-xl font-bold">منتجات العروض الترويجية
        </h3>
        {/* <p className="text-sm text-qblack">{promotion?.description}</p> */}
      </div>
      {promotion?.discountPercent ? (
        <div className="text-3xl font-bold">{promotion.discountPercent}% OFF</div>
      ) : null}
    </div>
  );
} 

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;

function PromotionCard({ promotion }) {
  const { t } = useTranslation();
  const imageUrl = promotion?.imageUrl || LOGO_URL;
  const title = promotion?.title || "عرض ترويجي";
  const description = promotion?.description || "";
  
  return (
    <div className="border border-qgray-border rounded-md p-4 flex flex-col space-y-3 group transition-all duration-300 hover:shadow-lg hover:border-qyellow relative">
      <div className="w-full h-48 bg-primarygray flex items-center justify-center overflow-hidden rounded relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h3 className="text-base font-semibold text-qblack line-clamp-2 group-hover:text-qyellow transition-colors duration-300">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-qgray line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const imageUrl = product?.images?.[0]?.url;
  const price = product?.sizes?.[0]?.price || 0;
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;
  
  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (getToken() && !isSoldOut) {
      try {
        setAdding(true);
        const { addToCart } = await import("../../api/cart");
        await addToCart({
          productId: product.id,
          quantity: 1,
          size: product?.sizes?.[0]?.size || null,
        });
      } catch (err) {
        if (err.message?.includes("Unauthorized") || err.message?.includes("401")) {
          navigate("/login");
        }
      } finally {
        setAdding(false);
      }
    } else if (!getToken()) {
      navigate("/login");
    }
  };
  
  return (
    <div 
      className="border border-qgray-border rounded-md p-4 flex flex-col space-y-3 group transition-all duration-300 hover:shadow-lg hover:border-qyellow relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSoldOut && (
        <div className="absolute top-4 right-4 bg-qred text-white px-3 py-1 rounded text-xs font-semibold z-10">
          {t("common.soldOut")}
        </div>
      )}
      <Link to={`/products/${product.id}`}>
        <div className={`w-full h-48 bg-primarygray flex items-center justify-center overflow-hidden rounded relative ${isSoldOut ? 'opacity-60' : ''}`}>
          <img
            src={imageUrl || LOGO_URL}
            alt={product?.title || product?.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {isHovered && !isSoldOut && (
            <button
              onClick={handleHeartClick}
              disabled={adding}
              className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-red-50 hover:scale-110 z-20 disabled:opacity-60"
              aria-label="Add to cart"
            >
              <svg
                width="20"
                height="18"
                viewBox="0 0 21 18"
                fill={adding ? "red" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-qblack transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.97214 0.0251923C3.71435 0.183434 2.6616 0.701674 1.7705 1.60365C0.970091 2.41068 0.489057 3.26519 0.213053 4.37683C-0.275867 6.30342 0.0789948 8.20232 1.25398 9.98649C2.00708 11.1298 2.98097 12.1781 4.76711 13.7764C5.90266 14.7931 9.36848 17.7601 9.53802 17.859C9.69574 17.954 9.75488 17.9658 10.09 17.9658C10.4252 17.9658 10.4843 17.954 10.642 17.859C10.8116 17.7601 14.2853 14.7891 15.413 13.7764C17.207 12.1702 18.173 11.1258 18.9261 9.98649C20.1011 8.20232 20.4559 6.30342 19.967 4.37683C19.691 3.26519 19.21 2.41068 18.4096 1.60365C17.6131 0.800575 16.7614 0.337719 15.6456 0.100357C15.0857 -0.0183239 14.0526 -0.0301933 13.5637 0.0805759C12.1995 0.377279 11.1546 1.06167 10.2004 2.28013L10.09 2.41859L9.98357 2.28013C9.04122 1.08541 8.01212 0.401016 6.69913 0.100357C6.30878 0.00936699 5.4098 -0.0301933 4.97214 0.0251923ZM6.28907 1.23178C7.40885 1.42958 8.37487 2.07837 9.13979 3.15046C9.26991 3.3364 9.43156 3.55793 9.49465 3.64892C9.78643 4.06035 10.3936 4.06035 10.6854 3.64892C10.7485 3.55793 10.9102 3.3364 11.0403 3.15046C12.0851 1.68673 13.5401 0.998377 15.1251 1.21596C16.8837 1.45728 18.2558 2.69156 18.7802 4.50738C19.1942 5.94342 19.0128 7.45067 18.2597 8.80759C17.6289 9.94298 16.5761 11.1337 14.7427 12.7834C13.8555 13.5786 10.1255 16.7988 10.09 16.7988C10.0506 16.7988 6.33638 13.5904 5.4374 12.7834C2.61823 10.2476 1.50633 8.66518 1.23821 6.8098C1.06472 5.61112 1.31312 4.32145 1.91639 3.30475C2.82326 1.77376 4.58968 0.935081 6.28907 1.23178Z"
                />
              </svg>
            </button>
          )}
        </div>
      </Link>
      <p className="text-xs text-qgray">{product?.category?.name}</p>
      <Link to={`/products/${product.id}`}>
        <h3 className="text-base font-semibold text-qblack line-clamp-2 group-hover:text-qyellow transition-colors duration-300">
          {product?.title || product?.name}
        </h3>
      </Link>
      <p className="text-lg font-bold text-qblack">₪ {price}</p>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("=== Home useEffect triggered ==="); // Debug log
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("=== Home Page: Loading promotions and products... ==="); // Debug log
        
        // Fetch promotions FIRST
        let promoData = [];
        try {
          console.log("=== Calling fetchPromotions API (includeInactive=false) ==="); // Debug log
          const response = await fetchPromotions(false); // includeInactive=false
          console.log("=== Promotions API response:", response); // Debug log
          promoData = response;
        } catch (promoErr) {
          console.error("=== ERROR fetching promotions:", promoErr); // Debug log
          console.error("=== Error details:", promoErr.message, promoErr.status); // Debug log
          promoData = [];
        }
        
        // Fetch products
        let prodData = [];
        
        try {
          console.log("=== Calling fetchProducts API ==="); // Debug log
          prodData = await fetchProducts();
          console.log("=== Products API response:", prodData); // Debug log
        } catch (prodErr) {
          console.error("=== ERROR fetching products:", prodErr); // Debug log
          prodData = [];
        }
        
        const allProducts = Array.isArray(prodData) ? prodData : [];
        const promotions = Array.isArray(promoData) ? promoData : [];
        
        console.log("Promotions data:", promotions); // Debug log
        console.log("All products:", allProducts.length); // Debug log
        
        setProducts(allProducts.slice(0, 6));
        setPromotions(promotions);
        
        // We will display the promotions themselves, not products
        // So we don't need to process products for promotions section
        console.log("Active promotions count:", promotions.length); // Debug log
        console.log("Promotion details:", JSON.stringify(promotions, null, 2)); // Debug log
        setNewestProducts([]); // Clear products, we'll show promotions instead
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="container-x mx-auto py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>

          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/products")}
              className="h-[42px] px-4 rounded bg-qyellow text-qblack font-semibold"
            >
              {t("common.viewAllProducts")}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="h-[42px] px-4 rounded border border-qgray-border text-qblack font-semibold"
            >
              {t("common.login")}
            </button>
          </div>
        </div>

        {/* Promotions Banner */}
        {!loading && promotions.length > 0 && (
          <PromoBanner promotion={promotions[0]} />
        )}
        
        {!loading && promotions.length === 0 && (
          <div className="w-full bg-primarygray rounded p-5 text-qgray text-center">
            لا توجد عروض ترويجية حالياً
          </div>
        )}

        {/* Promotions Slider - Show the promotions themselves */}
        {!loading && promotions.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-qblack">  </h2>
              <Link
                to="/products"
                className="text-qyellow hover:underline font-semibold"
              >
                عرض الكل
              </Link>
            </div>
            <div className="w-full">
              {/* Always show promotions in a grid, no slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {promotions.map((promotion) => (
                  <PromotionCard key={promotion.id} promotion={promotion} />
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && newestProducts.length === 0 ? (
          <div className="text-center py-10 text-qgray">{t("common.loading")}</div>
        ) : error ? (
          <div className="text-center py-10 text-qred">{error}</div>
        ) : null}
      </div>
    </Layout>
  );
}
