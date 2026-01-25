import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="terms-condition-page w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-16">
        <div className="aboutus-wrapper w-full py-16">
          <div className="container-x mx-auto px-4">
            <div className="w-full lg:flex lg:space-x-12 lg:space-x-reverse items-center gap-8">
              {/* Image Section */}
              <div className="lg:w-[570px] w-full lg:flex-shrink-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-qyellow/20 to-transparent rounded-2xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-[500px] md:h-[560px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <img
                        src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`}
                        alt="privacy"
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          if (e.target.src !== `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`) {
                            e.target.src = `${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="content flex-1 space-y-6">
                <div className="space-y-6">
                  <div className="inline-block">
                    <h1 className="text-3xl md:text-4xl font-bold text-qblack mb-2 relative">
                      <span className="relative z-10">سياسة المتجر</span>
                      <span className="absolute bottom-0 right-0 w-full h-3 bg-qyellow/30 -z-0"></span>
                    </h1>
                    <p className="text-lg text-qgraytwo mt-4 mb-6 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
                      {t("footer.privacyPolicy")}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
                    <ul className="text-base md:text-lg text-qgraytwo leading-8 space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-qyellow rounded-full flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>جودة القماش عالية والتفصيل دقيق</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-qyellow rounded-full flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>دقّة في المقاسات والألوان حسب طلب الزبون</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-qyellow rounded-full flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>المواعيد لدينا مقدّسة والتسليم بسرعة الديجيتال</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-qyellow rounded-full flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>عناية فائقة لارضاء العميل ومشاركته الفرح والسعادة لاننا نبيع ثقة قبل أن نبيع اقمشة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-qyellow rounded-full flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>نضمن بضاعتنا لآخر المشوار</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
