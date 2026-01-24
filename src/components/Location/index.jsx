import Layout from "../Partials/Layout";
import { useTranslation } from "react-i18next";

export default function Location() {
  const { t } = useTranslation();
  
  const locationLat = 32.464757;
  const locationLng = 35.304241;

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="location-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="w-full">
            <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
              <h1 className="text-[28px] font-bold leading-[44px] text-qblack">
                {t("location.title") || "Our Location"}
              </h1>
              <p className="text-qgraytwo mt-2">
                {t("location.subtitle") || "Jenin, Palestine"}
              </p>
            </div>
            
            <div className="map-container w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-qgray-border">
              <iframe
                src={`https://www.google.com/maps?q=${locationLat},${locationLng}&hl=en&z=14&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>

            <div className="location-info mt-8 text-center">
              <div className="bg-white border border-qgray-border rounded-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-qblack mb-4">
                  {t("location.addressTitle") || "Address"}
                </h2>
                <p className="text-qgraytwo mb-2">
                شارع الناصرة، قرب دوار الحثناوي                </p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

