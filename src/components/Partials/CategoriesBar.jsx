import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../../api/categories";

export default function CategoriesBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Fetch categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        // Silently handle errors
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Update selected category based on URL query parameter
  useEffect(() => {
    const categoryId = searchParams.get("category");
    if (categoryId && categories.length > 0) {
      const category = categories.find((c) => c.id === categoryId || c.name === categoryId);
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }
    // Update search query from URL
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams, categories, location]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update URL with search parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    
    // Navigate to products page with search param
    if (location.pathname !== "/products") {
      navigate(`/products?${newSearchParams.toString()}`);
    } else {
      setSearchParams(newSearchParams);
    }
  };

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    try {
      const container = scrollContainerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        
        // Check if content is scrollable (with a small tolerance)
        const isScrollable = scrollWidth > clientWidth + 1;
        
        if (isScrollable) {
          // Calculate if we're at the start or end (with tolerance for rounding)
          const isAtStart = scrollLeft <= 10;
          const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;
          
          // Left arrow (on right side in RTL) shows when we can scroll left (not at start)
          // This allows scrolling to see more content on the left
          const shouldShowLeft = !isAtStart;
          setShowLeftArrow(shouldShowLeft);
          
          // Right arrow (on left side in RTL) shows when we can scroll right (back to start)
          // Show it whenever we're not at the start, so user can scroll back to beginning
          // Hide it only when at the start (scrollLeft === 0)
          const shouldShowRight = !isAtStart;
          setShowRightArrow(shouldShowRight);
        } else {
          // If content is not scrollable, hide both arrows
          setShowLeftArrow(false);
          setShowRightArrow(false);
        }
      }
    } catch (error) {
      // Silently handle errors - don't show console errors
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Check scroll position on mount and when categories change
  useEffect(() => {
    if (!loading && categories.length > 0) {
      // Use requestAnimationFrame and multiple timeouts to ensure DOM is fully rendered
      const checkWithDelay = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            checkScrollPosition();
          }, 0);
        });
      };
      
      const timer1 = setTimeout(checkWithDelay, 100);
      const timer2 = setTimeout(checkWithDelay, 300);
      const timer3 = setTimeout(checkWithDelay, 500);
      const timer4 = setTimeout(checkWithDelay, 1000);
      
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        
        // Also check on scroll end
        let scrollTimeout;
        const handleScroll = () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            checkScrollPosition();
          }, 150);
        };
        container.addEventListener('scroll', handleScroll);
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
          clearTimeout(scrollTimeout);
          container.removeEventListener('scroll', checkScrollPosition);
          container.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', checkScrollPosition);
        };
      }
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [categories, loading]);

  if (loading || categories.length === 0) {
    return null;
  }

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId === "all") {
      navigate("/products");
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  return (
    <div className="w-full bg-white border-b border-qgray-border py-2 relative">
      <div className="container-x mx-auto">
        {/* Mobile Layout - Show on screens smaller than large desktop */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Mobile Dropdown */}
          <div className="w-full relative">
            <select
              value={selectedCategory?.id || selectedCategory?.name || "all"}
              onChange={handleCategoryChange}
              className="w-full h-[40px] px-4 pr-10 bg-white border-2 border-qblue/30 rounded-md text-sm text-qblack focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue appearance-none cursor-pointer"
              dir="rtl"
            >
              <option value="all">{t("nav.allCategories")}</option>
              {categories.map((category) => (
                <option key={category.id || category.name} value={category.id || category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-qblue pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          
          {/* Search Input below categories on mobile */}
          <div className="w-full relative">
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-[40px] px-4 pr-10 bg-gradient-to-r from-gray-50 to-white border-2 border-qblue/30 rounded-md text-sm text-qblack placeholder:text-qgray focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300 shadow-sm hover:shadow-md"
              dir="rtl"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-qblue pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Desktop Layout - Show on large desktop screens only */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Category buttons container - Show on large screens */}
          <div className="flex-1 relative min-w-0">
          {/* Right Arrow (on right side) */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-qyellow hover:text-white transition-all duration-300"
              aria-label="Scroll right"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform scale-x-[-1]"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Left Arrow (on left side) */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-qyellow hover:text-white transition-all duration-300"
              aria-label="Scroll left"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-scroll overflow-y-hidden scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div 
              className="flex items-center gap-3 px-4" 
              style={{ 
                display: 'inline-flex',
                width: 'max-content'
              }}
            >
          {/* All Categories button */}
          <Link
            to="/products"
            className={`px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
              !selectedCategory
                ? "bg-blue-200 text-black border border-[#0A1F44]"
                : "bg-gray-50 text-qgray hover:bg-gray-200 hover:text-qblack shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 border border-gray-200"
            }`}
          >
            {t("nav.allCategories")}
          </Link>
          
          {/* Category buttons */}
          {categories.map((category) => (
            <Link
              key={category.id || category.name}
              to={`/products?category=${category.id || category.name}`}
              className={`px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                selectedCategory?.id === category.id || selectedCategory?.name === category.name
                  ? "bg-[#0A1F44] text-[#D4AF37] border border-[#D4AF37]"
                  : "bg-gray-50 text-qgray hover:bg-gray-200 hover:text-qblack shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 border border-gray-200"
              }`}
            >
              {category.name}
            </Link>
          ))}
            </div>
          </div>
          </div>
          
          {/* Search Input on the left - Desktop only */}
          <div className="relative flex-shrink-0" style={{ minWidth: '200px', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-[40px] px-4 pr-10 bg-gradient-to-r from-gray-50 to-white border-2 border-qblue/30 rounded-md text-sm text-qblack placeholder:text-qgray focus:outline-none focus:ring-2 focus:ring-qblue focus:border-qblue transition-all duration-300 shadow-sm hover:shadow-md"
              dir="rtl"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-qblue pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

