# i18n Setup Documentation

## Overview
This project has been set up with internationalization (i18n) support using `react-i18next` for Arabic and English languages.

## Files Structure

```
src/
  ├── i18n/
  │   └── config.js              # i18n configuration
  ├── locales/
  │   ├── common.en.js           # English translations
  │   └── common.ar.js           # Arabic translations
  └── components/
      └── Helpers/
          └── LanguageSwitcher.jsx  # Language switcher component
```

## Installation
The required packages have been installed:
- `i18next`
- `react-i18next`
- `i18next-browser-languagedetector`

## Usage

### Using Translations in Components

1. Import the `useTranslation` hook:
```jsx
import { useTranslation } from "react-i18next";
```

2. Use the hook in your component:
```jsx
function MyComponent() {
  const { t } = useTranslation();
  
  return <div>{t("common.home")}</div>;
}
```

### Translation Keys Structure

Translation keys are organized in namespaces:

- `nav.*` - Navigation items
- `categories.*` - Product categories
- `auth.*` - Authentication pages
- `cart.*` - Shopping cart
- `products.*` - Product pages
- `home.*` - Home page sections
- `wishlist.*` - Wishlist
- `profile.*` - User profile
- `pages.*` - Page titles
- `contact.*` - Contact page
- `faq.*` - FAQ page
- `common.*` - Common UI elements
- `footer.*` - Footer content
- `errors.*` - Error messages

### Adding New Translations

1. Add the English translation to `src/locales/common.en.js`:
```javascript
export default {
  // ... existing translations
  mySection: {
    myKey: "My English Text",
  },
};
```

2. Add the Arabic translation to `src/locales/common.ar.js`:
```javascript
export default {
  // ... existing translations
  mySection: {
    myKey: "نصي العربي",
  },
};
```

3. Use it in your component:
```jsx
const { t } = useTranslation();
<p>{t("mySection.myKey")}</p>
```

## Language Switcher

The `LanguageSwitcher` component has been created and integrated into the TopBar. It:
- Detects the user's browser language
- Saves the selected language to localStorage
- Automatically sets the document direction (RTL for Arabic, LTR for English)
- Sets the `lang` attribute on the HTML element

### Usage
The LanguageSwitcher is already integrated in `HeaderOne/TopBar.jsx`. To use it in other headers:

```jsx
import LanguageSwitcher from "../../../Helpers/LanguageSwitcher";

// In your component:
<LanguageSwitcher />
```

## RTL Support

When Arabic is selected:
- The document direction is automatically set to `rtl`
- The HTML `lang` attribute is set to `ar`
- You may need to add custom CSS for RTL layouts

### RTL CSS Example

Add to your CSS file:
```css
[dir="rtl"] {
  direction: rtl;
}

[dir="rtl"] .flex {
  flex-direction: row-reverse;
}

/* Add more RTL-specific styles as needed */
```

## Components Already Updated

The following components have been updated to use i18n:
- ✅ `HeaderOne/TopBar.jsx` - Navigation bar with language switcher
- ✅ `HeaderOne/Navbar.jsx` - Main navigation menu
- ✅ `Auth/Login/index.jsx` - Login page
- ✅ `CartPage/index.jsx` - Shopping cart page
- ✅ `Contact/index.jsx` - Contact page
- ✅ `Faq/index.jsx` - FAQ page

## Next Steps

To complete the i18n implementation, update the remaining components:

1. **Pages to update:**
   - About page
   - Terms & Conditions
   - Privacy Policy
   - Blogs
   - Product pages
   - Checkout page
   - Profile pages
   - Wishlist
   - All other pages

2. **Helpers/Components:**
   - PageTitle (already accepts translated strings)
   - BreadcrumbCom
   - Footer components
   - Product cards
   - Form components

3. **Tips:**
   - Always use the `t()` function for user-facing text
   - Keep translation keys organized by feature/page
   - Test both languages thoroughly
   - Consider RTL layout adjustments for Arabic

## Testing

1. Start the development server:
```bash
npm run dev
```

2. Use the language switcher in the top bar to switch between English and Arabic

3. Verify that:
   - All text changes when switching languages
   - The page direction changes for Arabic (RTL)
   - Translations are saved in localStorage
   - Page refreshes maintain the selected language

## Additional Notes

- The default language is English (`en`)
- Language preference is saved in `localStorage`
- Browser language detection is enabled
- The language switcher automatically updates the document direction

