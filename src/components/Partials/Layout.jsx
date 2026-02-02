import { useState } from "react";
import { useLocation } from "react-router-dom";
import Drawer from "../Mobile/Drawer";
import Footer from "./Footers/Footer";
import Header from "./Headers/HeaderOne";
import NewsBar from "./NewsBar";

export default function Layout({ children, childrenClasses }) {
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  
  // Show NewsBar only on Home (/) and Products (/products) pages
  const showNewsBar = location.pathname === "/" || location.pathname === "/products";
  
  return (
    <>
      <Drawer open={drawer} action={() => setDrawer(!drawer)} type={1} />
      <div className="w-full overflow-x-hidden">
        <Header drawerAction={() => setDrawer(!drawer)} showNewsBar={showNewsBar} />
        <div className={`w-full  ${childrenClasses || "pt-[30px] pb-[60px]"}`}>
          {children && children}
        </div>
        <Footer />
      </div>
    </>
  );
}
