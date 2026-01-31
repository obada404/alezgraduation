import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { MobileLoginProvider } from "./contexts/MobileLoginContext";
import "./index.css";
import 'react-range-slider-input/dist/style.css';
import { registerSW } from "virtual:pwa-register";
import "./i18n/config";
if (import.meta.env.MODE === "production") {
  registerSW();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MobileLoginProvider>
        <App />
      </MobileLoginProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

AOS.init();
