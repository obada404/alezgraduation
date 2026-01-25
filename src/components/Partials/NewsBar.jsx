import { useEffect, useState } from "react";
import { fetchActiveNews } from "../../api/news";
import { Link } from "react-router-dom";

export default function NewsBar() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchActiveNews();
        // Handle different response formats
        let newsArray = [];
        if (Array.isArray(data)) {
          newsArray = data;
        } else if (data && Array.isArray(data.news)) {
          newsArray = data.news;
        } else if (data && Array.isArray(data.data)) {
          newsArray = data.data;
        } else if (data && typeof data === 'object') {
          // If data is an object, try to find array property
          const keys = Object.keys(data);
          for (const key of keys) {
            if (Array.isArray(data[key])) {
              newsArray = data[key];
              break;
            }
          }
        }
        setNews(newsArray);
      } catch (err) {
        // Silently handle errors - don't show NewsBar if API fails
        setError(err.message);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  // Don't show NewsBar if loading
  if (loading) {
    return null;
  }
  
  // Don't show NewsBar if no news
  if (news.length === 0) {
    return null;
  }

  // Duplicate news items for seamless scrolling (LTR: left to right)
  const duplicatedNews = [...news, ...news];

  return (
    <div className="w-full bg-gradient-to-r from-qyellow via-qyellow to-qyellow/90 text-white py-3 overflow-hidden relative shadow-md">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
      
      <div className="flex items-center relative z-10">
        {/* News icon badge */}
        <div className="flex-shrink-0 px-4 flex items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <svg 
              className="w-5 h-5 text-white animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6c0 4.314 6 10 6 10s6-5.686 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider bg-white text-qyellow px-2 py-1 rounded">
              جديد
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll-ltr flex items-center">
            {duplicatedNews.map((item, index) => (
              <div 
                key={`${item.id || index}-${Math.floor(index / news.length)}`} 
                className="inline-flex items-center mx-6 group"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="text-sm font-bold text-white hover:text-white/80 transition-colors duration-300 whitespace-nowrap flex items-center space-x-2 rtl:space-x-reverse"
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                    >
                      <span className="relative">
                        {item.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-white whitespace-nowrap">{item.title}</span>
                  )}
                  {item.content && (
                    <span className="text-xs text-white/80 font-medium whitespace-nowrap hidden sm:inline">
                      - {item.content}
                    </span>
                  )}
                </div>
                <span className="text-white/50 mx-2 text-lg">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-ltr {
          animation: scroll-ltr ${Math.max(news.length * 10, 20)}s linear infinite;
        }
        .animate-scroll-ltr:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
