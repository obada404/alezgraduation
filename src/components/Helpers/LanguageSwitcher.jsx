import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    // Update document direction for RTL languages
    if (langCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  };

  // Set initial direction
  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [i18n.language]);

  return (
    <div className={`language-select relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 cursor-pointer"
      >
        <span className="text-xs leading-6 text-qblack font-500">
          {currentLanguage.nativeName}
        </span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
            fill="#222222"
          />
        </svg>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-1 bg-white border border-qgray-border shadow-lg z-20 min-w-[120px]">
            <ul className="py-1">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-qyellow transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-qyellow font-semibold'
                        : 'text-qblack'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

