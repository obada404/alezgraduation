export default function PriceDisplay({ priceAfterDiscount, priceBeforeDiscount, className = "" }) {
  const hasDiscount = priceBeforeDiscount && priceBeforeDiscount > priceAfterDiscount;
  const displayPrice = priceAfterDiscount || 0;

  // Extract text size from className if present, but always use yellow color
  const textSizeMatch = className.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/);
  const priceTextSize = textSizeMatch ? textSizeMatch[0] : 'text-lg';
  const oldPriceTextSize = textSizeMatch && textSizeMatch[1] !== 'xs' ? 'text-sm' : 'text-xs';
  
  // Remove text size classes from className to avoid conflicts
  const otherClasses = className.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/g, '').trim();

  if (hasDiscount) {
    return (
      <div className={`flex items-center gap-2 ${otherClasses}`}>
        <span className={`${oldPriceTextSize} font-medium text-qgray line-through`}>
          ₪ {priceBeforeDiscount.toFixed(2)}
        </span>
        <span className={`${priceTextSize} font-bold text-qyellow`} style={{ color: '#D4AF37' }}>
          ₪ {displayPrice.toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <span className={`${priceTextSize} font-bold text-qyellow ${otherClasses}`} style={{ color: '#D4AF37' }}>
      ₪ {displayPrice.toFixed(2)}
    </span>
  );
}

