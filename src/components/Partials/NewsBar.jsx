import { useEffect, useState } from "react";
import { fetchActiveNews } from "../../api/news";
import { Link } from "react-router-dom";

export default function NewsBar() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveNews();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  if (loading || news.length === 0) {
    return null;
  }

  // Duplicate news items for seamless scrolling (RTL: right to left)
  const duplicatedNews = [...news, ...news];

  return (
    <div className="w-full bg-qyellow text-qblack py-2 overflow-hidden relative">
      <div className="flex items-center">
        <div className="whitespace-nowrap animate-scroll-rtl flex items-center">
          {duplicatedNews.map((item, index) => (
            <div key={`${item.id || index}-${Math.floor(index / news.length)}`} className="inline-flex items-center mx-8">
              {item.link ? (
                <Link
                  to={item.link}
                  className="text-sm font-semibold hover:underline whitespace-nowrap"
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-sm font-semibold whitespace-nowrap">{item.title}</span>
              )}
              {item.content && (
                <span className="text-xs text-qblack/80 mr-2 whitespace-nowrap">- {item.content}</span>
              )}
              <span className="text-qblack/50 mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-rtl {
          animation: scroll-rtl ${Math.max(news.length * 10, 20)}s linear infinite;
        }
        .animate-scroll-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
