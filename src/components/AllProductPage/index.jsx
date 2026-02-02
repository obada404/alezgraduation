import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchProducts } from "../../api/products";
import SimpleSlider from "../Helpers/SliderCom";
import Spinner from "../Helpers/Spinner";
import ProductDialog from "../Helpers/ProductDialog";
import PriceDisplay from "../Helpers/PriceDisplay";

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo/jpeg`;

function ProductCard({ product, onShowDetails }) {
  const { t } = useTranslation();
  const firstSize = product?.sizes?.[0];
  const priceAfterDiscount = firstSize?.priceAfterDiscount || firstSize?.price || 0;
  const priceBeforeDiscount = firstSize?.priceBeforeDiscount;
  const imageUrl = product?.images?.[0]?.url;
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;
  
  return (
    <div 
      className="border border-qgray-border rounded-md p-4 flex flex-col space-y-3 relative group transition-all duration-300 hover:shadow-lg hover:border-qyellow"
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
            alt={product?.name || product?.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-qgray mb-1">{product?.category?.name}</p>
        <div 
          onClick={() => onShowDetails(product)}
          className="cursor-pointer"
        >
          <h3 className="text-base font-semibold text-qblack line-clamp-2 group-hover:text-qyellow transition-colors duration-300">
            {product?.title || product?.name}
          </h3>
        </div>
        <PriceDisplay 
          priceAfterDiscount={priceAfterDiscount}
          priceBeforeDiscount={priceBeforeDiscount}
          className="mt-1"
        />
      </div>
      {!isSoldOut ? (
        <button
          onClick={() => onShowDetails(product)}
          className="w-full h-[42px] rounded bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37] font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md active:scale-95"
        >
          عرض التفاصيل
        </button>
      ) : (
        <button
          disabled
          className="w-full h-[42px] rounded bg-qgray text-white font-semibold cursor-not-allowed opacity-60"
        >
          {t("common.soldOut")}
        </button>
      )}
    </div>
  );
}

function NewestProductCard({ product, onShowDetails }) {
  const { t } = useTranslation();
  const firstSize = product?.sizes?.[0];
  const priceAfterDiscount = firstSize?.priceAfterDiscount || firstSize?.price || 0;
  const priceBeforeDiscount = firstSize?.priceBeforeDiscount;
  const imageUrl = product?.images?.[0]?.url;
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;
  
  return (
    <div 
      className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] rounded-xl p-5 flex flex-col space-y-4 relative group transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-[#D4AF37]/30"
    >
      {/* New Badge */}
      <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#0A1F44] px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
        جديد
      </div>
      
      {isSoldOut && (
        <div className="absolute top-4 right-4 bg-qred text-white px-3 py-1 rounded text-xs font-semibold z-10">
          {t("common.soldOut")}
        </div>
      )}
      
      <div 
        onClick={() => onShowDetails(product)}
        className="cursor-pointer"
      >
        <div className={`w-full h-64 bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden rounded-lg relative ${isSoldOut ? 'opacity-60' : ''} border border-white/20`}>
          <img
            src={imageUrl || LOGO_URL}
            alt={product?.name || product?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
          />
        </div>
      </div>
      
      <div className="flex-1 text-right">
        <p className="text-xs text-[#D4AF37]/80 mb-2 font-semibold">{product?.category?.name}</p>
        <div 
          onClick={() => onShowDetails(product)}
          className="cursor-pointer"
        >
          <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">
            {product?.title || product?.name}
          </h3>
        </div>
        <div className="mt-2">
          <PriceDisplay 
            priceAfterDiscount={priceAfterDiscount}
            priceBeforeDiscount={priceBeforeDiscount}
            className="text-2xl"
          />
        </div>
      </div>
      
      {!isSoldOut ? (
        <button
          onClick={() => onShowDetails(product)}
          className="w-full h-[48px] rounded-lg bg-blue-200 text-black border border-[#0A1F44] font-bold transition-all duration-300 hover:bg-blue-300 hover:scale-105 shadow-lg active:scale-95"
        >
          عرض التفاصيل
        </button>
      ) : (
        <button
          disabled
          className="w-full h-[48px] rounded-lg bg-gray-500 text-white font-semibold cursor-not-allowed opacity-60"
        >
          {t("common.soldOut")}
        </button>
      )}
    </div>
  );
}

export default function AllProductPage({ className }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all products once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        const allProds = Array.isArray(data) ? data : [];
        setAllProducts(allProds);
        
        // Sort by createdAt (newest first) and get last 4
        const sortedByDate = [...allProds].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || Date.now());
          const dateB = new Date(b.createdAt || b.updatedAt || Date.now());
          return dateB - dateA; // Descending order (newest first)
        });
        
                // Get last 3 newest products, or first 3 if no dates available
                const newest = sortedByDate.length > 0 
                  ? sortedByDate.slice(0, 3) 
                  : allProds.slice(0, 3);
        setNewestProducts(newest);
      } catch (err) {
        const errorMsg = err.message || "حدث خطآ،جاري المتابعة";
        if (errorMsg.includes("Unauthorized") || errorMsg.includes("401")) {
          // Allow viewing products even if unauthorized, just show empty or handle gracefully
          setAllProducts([]);
          setNewestProducts([]);
        } else {
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on categoryId and search query
  useEffect(() => {
    let filtered = [...allProducts];
    
    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(
        (product) => product.categoryId === categoryId
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const title = (product.title || product.name || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        const categoryName = (product.category?.name || "").toLowerCase();
        return (
          title.includes(query) ||
          description.includes(query) ||
          categoryName.includes(query)
        );
      });
    }
    
    setProducts(filtered);
  }, [categoryId, allProducts, searchQuery]);

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Layout childrenClasses={className || "pt-0 pb-0"}>
      <div className="w-full bg-white py-10">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse gap-3">
              <button
                onClick={() => navigate("/cart")}
                className="h-[40px] px-4 rounded bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37] font-semibold whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {t("common.goToCart")}
              </button>
            </div>
          </div>

          {/* Newest Products Slider */}
          {!loading && !categoryId && newestProducts.length > 0 && (
            <div className="w-full mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-qblack">آخر المنتجات المضافة</h2>
              </div>
              <div className="w-full">
                <SimpleSlider
                  settings={{
                    dots: false,
                    infinite: newestProducts.length >= 3,
                    speed: 500,
                    slidesToShow: Math.min(3, newestProducts.length),
                    slidesToScroll: 1,
                    autoplay: newestProducts.length > 1,
                    autoplaySpeed: 3000,
                    pauseOnHover: true,
                    rtl: true,
                    arrows: newestProducts.length > 3,
                    responsive: [
                      {
                        breakpoint: 1024,
                        settings: {
                          slidesToShow: Math.min(3, newestProducts.length),
                          slidesToScroll: 1,
                          arrows: newestProducts.length > 3,
                        },
                      },
                      {
                        breakpoint: 768,
                        settings: {
                          slidesToShow: Math.min(2, newestProducts.length),
                          slidesToScroll: 1,
                          arrows: newestProducts.length > 2,
                        },
                      },
                      {
                        breakpoint: 640,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          arrows: newestProducts.length > 1,
                        },
                      },
                    ],
                  }}
                >
                  {newestProducts.map((product) => (
                    <div key={product.id} className="px-2">
                      <NewestProductCard
                        product={product}
                        onShowDetails={handleShowDetails}
                      />
                    </div>
                  ))}
                </SimpleSlider>
              </div>
              {/* Line after Newest Products section */}
              <div className="w-full mt-10 mb-6">
                <h2 className="text-2xl font-bold text-qblack mb-6">المنتجات</h2>
                <div className="w-full border-t border-qgray-border"></div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-10 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-qred">{error}</div>
          ) : (
            <>
              {!categoryId && newestProducts.length === 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-qblack">المنتجات</h2>
                </div>
              )}
              {categoryId && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-qblack">
                    {products.length} {t("common.items")}
                  </h2>
                </div>
              )}
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <ProductDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAddToCart={() => {
          // Optionally refresh cart count or show success message
        }}
      />
    </Layout>
  );
}
