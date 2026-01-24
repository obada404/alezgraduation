import { useEffect } from "react";
import Routers from "./Routers";

function App() {
  useEffect(() => {
    // Ensure document is RTL and Arabic
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }, []);

  return <Routers />;
}

export default App;
