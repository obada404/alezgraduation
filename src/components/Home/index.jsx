import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchProducts } from "../../api/products";
import { fetchPromotions } from "../../api/promotions";
import { getToken } from "../../api/client";
import SimpleSlider from "../Helpers/SliderCom";
import Spinner from "../Helpers/Spinner";
import ProductDialog from "../Helpers/ProductDialog";

function PromoBanner({ promotion }) {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-qyellow text-white rounded-lg p-5 flex justify-between items-center shadow-2xl hover:shadow-[0_0_30px_rgba(2,24,56,0.6)] transition-all duration-300 transform hover:scale-[1.02] border-2 border-white/30 relative overflow-hidden group">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-lg"></div>
      
      <div className="relative z-10">
        {/* <p className="text-xs uppercase font-semibold">{t("common.promotion")}</p> */}
        <h3 className="text-xl font-bold drop-shadow-lg text-white brightness-110">عروضنا
        </h3>
        {/* <p className="text-sm text-qblack">{promotion?.description}</p> */}
      </div>
      {promotion?.discountPercent ? (
        <div className="text-3xl font-bold drop-shadow-2xl animate-pulse brightness-110 relative z-10 text-white">{promotion.discountPercent}% OFF</div>
      ) : null}
    </div>
  );
} 

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`;

function PromotionCard({ promotion }) {
  const { t } = useTranslation();
  // Try multiple possible image fields from API
  const imageUrl = promotion?.imageUrl || promotion?.image?.url || promotion?.image || null;
  const title = promotion?.title || "عرض ترويجي";
  const description = promotion?.description || "";
  
  return (
    <div className="w-full border-2 border-qgray-border rounded-xl p-6 sm:p-8 flex flex-col space-y-4 group transition-all duration-300 hover:shadow-2xl hover:border-qyellow relative bg-white">
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden rounded-lg relative shadow-lg">
        <img
          src={imageUrl || LOGO_URL}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            // Fallback to logo if image fails
            if (e.target.src !== LOGO_URL) {
              e.target.src = LOGO_URL;
            }
          }}
        />
      </div>
      <div className="space-y-3 text-right">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-qblack group-hover:text-qyellow transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-base sm:text-lg text-qgray leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onShowDetails }) {
  const { t } = useTranslation();
  const imageUrl = product?.images?.[0]?.url;
  const price = product?.sizes?.[0]?.price || 0;
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;
  
  return (
    <div 
      className="border border-qgray-border rounded-md p-4 flex flex-col space-y-3 group transition-all duration-300 hover:shadow-lg hover:border-qyellow relative"
    >
      {isSoldOut && (
        <div className="absolute top-4 right-4 bg-qred text-white px-3 py-1 rounded text-xs font-semibold z-10">
          {t("common.soldOut")}
        </div>
      )}
      <div 
        onClick={() => onShowDetails(product)}
        className="cursor-pointer"
      >
        <div className={`w-full h-48 bg-primarygray flex items-center justify-center overflow-hidden rounded relative ${isSoldOut ? 'opacity-60' : ''}`}>
          <img
            src={imageUrl || LOGO_URL}
            alt={product?.title || product?.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
      <p className="text-xs text-qgray">{product?.category?.name}</p>
      <div 
        onClick={() => onShowDetails(product)}
        className="cursor-pointer"
      >
        <h3 className="text-base font-semibold text-qblack line-clamp-2 group-hover:text-qyellow transition-colors duration-300">
          {product?.title || product?.name}
        </h3>
      </div>
      <p className="text-lg font-bold text-qblack">₪ {price}</p>
      {!isSoldOut && (
        <button
          onClick={() => onShowDetails(product)}
          className="w-full h-[42px] rounded bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37] font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md active:scale-95"
        >
          عرض التفاصيل
        </button>
      )}
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch promotions FIRST
        let promoData = [];
        try {
          const response = await fetchPromotions(false); // includeInactive=false
          promoData = response;
        } catch (promoErr) {
          promoData = [];
        }
        
        // Fetch products
        let prodData = [];
        
        try {
          prodData = await fetchProducts();
        } catch (prodErr) {
          prodData = [];
        }
        
        const allProducts = Array.isArray(prodData) ? prodData : [];
        const promotions = Array.isArray(promoData) ? promoData : [];
        
        // Debug: Log promotions to see their structure
        if (promotions.length > 0) {
          console.log("Promotions data:", promotions);
          console.log("First promotion:", promotions[0]);
          console.log("First promotion imageUrl:", promotions[0]?.imageUrl);
        }
        
        setProducts(allProducts.slice(0, 6));
        setPromotions(promotions);
        
        // We will display the promotions themselves, not products
        // So we don't need to process products for promotions section
        setNewestProducts([]); // Clear products, we'll show promotions instead
      } catch (err) {
        setError(err.message || "حدث خطآ،جاري المتابعة");
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
              className="h-[42px] px-4 rounded bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37] font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {t("common.viewAllProducts")}
            </button>
            {!getToken() && (
              <button
                onClick={() => navigate("/login")}
                className="h-[42px] px-4 rounded border border-qgray-border text-qblack font-semibold"
              >
                {t("common.login")}
              </button>
            )}
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
            <div className="w-full">
              <SimpleSlider
                settings={{
                  dots: true,
                  infinite: promotions.length > 1,
                  speed: 600,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: promotions.length > 1,
                  autoplaySpeed: 4000,
                  pauseOnHover: true,
                  rtl: true,
                  arrows: promotions.length > 1,
                  fade: false,
                  cssEase: 'linear',
                }}
              >
                {promotions.map((promotion) => (
                  <div key={promotion.id} className="px-2" style={{ width: '100%' }}>
                    <PromotionCard promotion={promotion} />
                  </div>
                ))}
              </SimpleSlider>
            </div>
          </div>
        )}

        {loading && newestProducts.length === 0 ? (
          <div className="text-center py-10 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-qred">{error}</div>
        ) : null}
      </div>
      <ProductDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={() => {
          // Optionally refresh cart count or show success message
        }}
      />
    </Layout>
  );
}
