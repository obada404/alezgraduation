import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../../api/categories";

export default function CategoriesBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
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
  }, [searchParams, categories, location]);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      // Check if content is scrollable (with a small tolerance)
      const isScrollable = scrollWidth > clientWidth + 1;
      
      console.log('CategoriesBar checkScrollPosition:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        isScrollable,
        diff: scrollWidth - clientWidth
      });
      
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
        
        console.log('Arrow visibility:', {
          isAtStart,
          isAtEnd,
          shouldShowLeft,
          shouldShowRight
        });
      } else {
        // If content is not scrollable, hide both arrows
        setShowLeftArrow(false);
        setShowRightArrow(false);
        console.log('Content not scrollable, hiding arrows');
      }
    } else {
      console.log('Container not found!');
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

  return (
    <div className="w-full bg-white border-b border-qgray-border py-2 relative">
      {/* Right Arrow (on right side) */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-qyellow transition-all duration-300"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-qyellow transition-all duration-300"
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
                ? "bg-qyellow text-qblack"
                : "bg-gray-100 text-qblack hover:bg-qyellow hover:text-qblack"
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
                  ? "bg-qyellow text-qblack"
                  : "bg-gray-100 text-qblack hover:bg-qyellow hover:text-qblack"
              }`}
            >
              {category.name}
            </Link>
          ))}
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

