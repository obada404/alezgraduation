import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchProducts } from "../../api/products";
import { addToCart } from "../../api/cart";
import { getToken } from "../../api/client";
import SimpleSlider from "../Helpers/SliderCom";

const priceFromProduct = (product) => {
  if (product?.sizes?.length) {
    return product.sizes[0].price;
  }
  return 0;
};

const LOGO_URL = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;

function ProductCard({ product, onAdd, adding }) {
  const { t } = useTranslation();
  const price = priceFromProduct(product);
  const imageUrl = product?.images?.[0]?.url;
  const isSoldOut = product?.soldOut || product?.isSoldOut || false;
  const [isHovered, setIsHovered] = useState(false);
  
  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAdd && !isSoldOut) {
      onAdd(product);
    }
  };
  
  return (
    <div 
      className="border border-qgray-border rounded-md p-4 flex flex-col space-y-3 relative group transition-all duration-300 hover:shadow-lg hover:border-qyellow"
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
            alt={product?.name || product?.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {isHovered && !isSoldOut && onAdd && (
            <button
              onClick={handleHeartClick}
              className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-red-50 hover:scale-110 z-20"
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
      <div className="flex-1">
        <p className="text-xs text-qgray mb-1">{product?.category?.name}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-qblack line-clamp-2 group-hover:text-qyellow transition-colors duration-300">
            {product?.title || product?.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-qblack mt-1">₪ {price}</p>
      </div>
      {onAdd && !isSoldOut ? (
        <button
          onClick={() => onAdd(product)}
          disabled={adding}
          className="w-full h-[42px] rounded bg-qyellow text-qblack font-semibold transition-all duration-300 hover:bg-opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {adding ? t("common.loading") : t("common.addToCart")}
        </button>
      ) : isSoldOut ? (
        <button
          disabled
          className="w-full h-[42px] rounded bg-qgray text-white font-semibold cursor-not-allowed opacity-60"
        >
          {t("common.soldOut")}
        </button>
      ) : null}
    </div>
  );
}

export default function AllProductPage({ className }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);

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
        
        // Get last 4 newest products, or first 4 if no dates available
        const newest = sortedByDate.length > 0 
          ? sortedByDate.slice(0, 4) 
          : allProds.slice(0, 4);
        setNewestProducts(newest);
      } catch (err) {
        const errorMsg = err.message || "Failed to load products";
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

  // Filter products based on categoryId
  useEffect(() => {
    if (categoryId) {
      const filtered = allProducts.filter(
        (product) => product.categoryId === categoryId
      );
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
  }, [categoryId, allProducts]);

  const handleAdd = async (product) => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    try {
      setAddingId(product.id);
      const size = product?.sizes?.[0]?.size || null;
      await addToCart({
        productId: product.id,
        quantity: 1,
        size,
      });
    } catch (err) {
      setError(err.message || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Layout childrenClasses={className || "pt-0 pb-0"}>
      <div className="w-full bg-white py-10">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-qblack">{t("common.products")}</h1>
              <p className="text-sm text-qgray mt-1">
              </p>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => navigate("/cart")}
                className="h-[40px] px-4 rounded bg-qyellow text-qblack font-semibold"
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
                    infinite: newestProducts.length >= 4,
                    speed: 500,
                    slidesToShow: Math.min(4, newestProducts.length),
                    slidesToScroll: 1,
                    autoplay: newestProducts.length > 1,
                    autoplaySpeed: 3000,
                    pauseOnHover: true,
                    rtl: true,
                    arrows: newestProducts.length > 4,
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
                      <ProductCard
                        product={product}
                        onAdd={handleAdd}
                        adding={addingId === product.id}
                      />
                    </div>
                  ))}
                </SimpleSlider>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-10 text-qgray">{t("common.loadingProducts")}</div>
          ) : error ? (
            <div className="text-center py-10 text-qred">{error}</div>
          ) : (
            <>
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
                    onAdd={handleAdd}
                    adding={addingId === product.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
