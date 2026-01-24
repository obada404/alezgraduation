import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="terms-condition-page w-full bg-white pb-[30px]">
        <div className="aboutus-wrapper w-full">
          <div className="container-x mx-auto">
            <div className="w-full min-h-[665px] lg:flex lg:space-x-12 items-center pb-10 lg:pb-0">
              <div className="md:w-[570px] w-full md:h-[560px] h-auto rounded overflow-hidden my-5 lg:my-0">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`}
                  alt="privacy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="content flex-1">
                <h1 className="text-[18px] font-medium text-qblack mb-2.5">
                  سياسة المتجر
                </h1>
                <p className="text-[15px] text-qgraytwo leading-7 mb-5">
                  {t("footer.privacyPolicy")}
                </p>
                <ul className="text-[15px] text-qgraytwo leading-7 list-disc ml-5 mb-5 space-y-2">
                  <li>جودة القماش عالية والتفصيل دقيق</li>
                  <li>دقّة في المقاسات والألوان حسب طلب الزبون</li>
                  <li>المواعيد لدينا مقدّسة والتسليم بسرعة الديجيتال</li>
                  <li>عناية فائقة لارضاء العميل ومشاركته الفرح والسعادة لاننا نبيع ثقة قبل أن نبيع اقمشة</li>
                  <li>نضمن بضاعتنا لآخر المشوار</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
