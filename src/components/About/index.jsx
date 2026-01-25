import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchAboutUs } from "../../api/appConfig";
import Spinner from "../Helpers/Spinner";

export default function About() {
  const { t } = useTranslation();
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        setLoading(true);
        const data = await fetchAboutUs();
        // Always use the API response, even if aboutUs is null
        // API returns { aboutUs: "..." } or { aboutUs: null }
        const content = data?.aboutUs !== undefined ? data.aboutUs : (data?.content || null);
        setAboutContent(content);
      } catch (err) {
        // Silently handle errors
        setAboutContent(null);
      } finally {
        setLoading(false);
      }
    };
    loadAboutUs();
  }, []);

  // Default content if API fails or returns empty
  const defaultContent = `نحن متجر الكتروني مجموعه من المحترفين متخصصون بتفصيل وبيع مستلزمات التخرج

ولاننا نؤمن بأن لحظة التخرج تستحق عناية خاصة نعمل على ما يلي:

*تفصيل الأرواب بجودة عالية وتفصيل انيق
*توفير طواقي واوشحة متقنة تضاهي ما هو موجود باعرق جامعات العالم باحتراف ومهنية
*الاهتمام بادق التفاصيل من الداخل والخارج بدءاً من اختيار القماش حتى التسليم النهائي
*الالتزام بالمواعيد المحددة
*التجربة معنا سهلة للزبائن لاننا نعيش بروح المناسبة
*نسابق الأحداث في تصميم كل جديد وغير مسبوق

اختيارك لمنتجاتنا اختيارك الصحيح`;

  // Use API content if available (even if null), otherwise use default
  // If aboutContent is explicitly null from API, show default
  // If aboutContent is a string, use it
  const displayContent = aboutContent !== null && aboutContent !== undefined 
    ? aboutContent 
    : defaultContent;

  // Convert to string and format for display
  const formattedContent = String(displayContent || '').replace(/\n/g, '<br />');

  return (
    <Layout childrenClasses="pt-0 pb-0 bg-white">
      <div className="about-page-wrapper w-full">
        <div className="title-area w-full">
          {/* <PageTitle
            title="About Us"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "About us", path: "/about" },
            ]}
          /> */}
        </div>

        <div className="aboutus-wrapper w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
          <div className="container-x mx-auto px-4">
            <div className="w-full lg:flex lg:space-x-12 lg:space-x-reverse items-center gap-8">
              {/* Image Section */}
              <div className="lg:w-[570px] w-full lg:flex-shrink-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-qyellow/20 to-transparent rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-[500px] md:h-[560px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <img
                        src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.jpeg`}
                        alt="about"
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
                <div className="space-y-4">
                  <div className="inline-block">
                    <h1 className="text-3xl md:text-4xl font-bold text-qblack mb-2 relative">
                      <span className="relative z-10">من نحن</span>
                      <span className="absolute bottom-0 right-0 w-full h-3 bg-qyellow/30 -z-0"></span>
                    </h1>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <div 
                      className="text-base md:text-lg text-qgraytwo leading-8 whitespace-pre-line bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
                      dangerouslySetInnerHTML={{ __html: formattedContent }}
                    />
                  )}
                </div>

                <a
                  href="https://wa.me/970569027059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6"
                >
                  <span className="inline-block px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-qyellow text-white rounded">
                    تواصل معنا
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container-x mx-auto my-16 px-4">
          <div
            data-aos="fade-down"
            className="best-services w-full bg-gradient-to-r from-qyellow via-qyellow to-qyellow/90 rounded-2xl shadow-2xl flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-around lg:items-stretch px-8 lg:px-12 py-12 lg:py-8 gap-6"
          >
            <div className="item group flex-1 min-w-0">
              <div className="flex flex-col space-y-4 rtl:space-y-reverse items-start bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300 hover:scale-105 h-full">
                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-qblack"
                  >
                    <path
                      d="M1 1H5.63636V24.1818H35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M34.9982 1H11.8164V18H34.9982V1Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M11.8164 7.18164H34.9982"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg font-bold tracking-wide mb-2">
                    {t("footer.freeShipping")}
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">{t("footer.freeShippingDesc")}</p>
                </div>
              </div>
            </div>
            <div className="item group flex-1 min-w-0">
              <div className="flex flex-col space-y-4 rtl:space-y-reverse items-start bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300 hover:scale-105 h-full">
                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-qblack"
                  >
                    <path
                      d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M30.7 2L29.5 10.85L20.5 9.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg font-bold tracking-wide mb-2">
                    {t("footer.freeReturn")}
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {t("footer.freeReturnDesc")}
                  </p>
                </div>
              </div>
            </div>
            <div className="item group flex-1 min-w-0">
              <div className="flex flex-col space-y-4 rtl:space-y-reverse items-start bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300 hover:scale-105 h-full">
                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-qblack"
                  >
                    <path
                      d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg font-bold tracking-wide mb-2">
                    {t("footer.securePayment")}
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {t("footer.securePaymentDesc")}
                  </p>
                </div>
              </div>
            </div>
            <div className="item group flex-1 min-w-0">
              <div className="flex flex-col space-y-4 rtl:space-y-reverse items-start bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300 hover:scale-105 h-full">
                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-qblack"
                  >
                    <path
                      d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M16 28V22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                    <path
                      d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg font-bold tracking-wide mb-2">
                    {t("footer.onTimeDelivery")}
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {t("footer.onTimeDeliveryDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="blog-post-wrapper w-full mb-[30px]">
          <div className="container-x mx-auto">
            <div className="blog-post-title flex justify-center items-cente mb-[30px]">
              <h1 className="text-3xl font-semibold text-qblack">
                My Latest News
              </h1>
            </div>

            <div className="blogs-wrapper w-full">
              <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5">
                <DataIteration datas={blog.blogs} startLength={0} endLength={2}>
                  {({ datas }) => (
                    <div
                      data-aos="fade-up"
                      key={datas.id}
                      className="item w-full"
                    >
                      <BlogCard datas={datas} />
                    </div>
                  )}
                </DataIteration>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}
