import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";

export default function Footer({ type }) {
  const { t } = useTranslation();
  return (
    <footer className="footer-section-wrapper bg-white print:hidden">
      <div className="container-x block mx-auto pt-[56px]">
        <div className="w-full flex flex-col items-center mb-[50px]">
          {/* logo area */}
          <div className="mb-[40px]">
            {type === 3 ? (
              <Link to="/">
                <img
                  width="200"
                  height="50"
                  src={`${
                    import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/logo-3.svg`}
                  alt="logo"
                />
              </Link>
            ) : (
              <Link to="/">
                <img
                  width="152"
                  height="36"
                  src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`}
                  alt="logo"
                />
              </Link>
            )}
          </div>
          <div className="w-full h-[1px] bg-[#E9E9E9]"></div>
        </div>
        <div className="flex flex-col items-center justify-center mb-[50px]">
          <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
            <Link to="/about">
              <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                {t("footer.aboutUs")}
              </span>
            </Link>
            <Link to="/privacy-policy">
              <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                {t("footer.privacyPolicy")}
              </span>
            </Link>
            <Link to="/location">
              <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                {t("nav.location")}
              </span>
            </Link>
          </div>
          <div className="flex space-x-5 items-center">
            <a href="#" aria-label="Facebook">
              <Facebook className="fill-current text-qgray hover:text-qblack" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="fill-current text-qgray hover:text-qblack" />
            </a>
          </div>
        </div>
        <div className="bottom-bar border-t border-qgray-border lg:h-[82px] lg:flex justify-center items-center">
          <div className="text-center">
            <span className="sm:text-base text-[10px] text-qgray font-300">
              {t("footer.allRightsReserved")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
