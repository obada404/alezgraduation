import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../Partials/Layout";
import { fetchAboutUs } from "../../api/appConfig";

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
        console.error("Failed to load About Us content:", err);
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

        <div className="aboutus-wrapper w-full">
          <div className="container-x mx-auto">
            <div className="w-full min-h-[665px] lg:flex lg:space-x-12 items-center pb-10 lg:pb-0">
              <div className="md:w-[570px] w-full md:h-[560px] h-auto rounded overflow-hidden my-5 lg:my-0">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL || ''}/assets/images/logo.png`}
                  alt="about"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="content flex-1">
                <h1 className="text-[18px] font-medium text-qblack mb-2.5">
                  من نحن
                </h1>
                {loading ? (
                  <p className="text-[15px] text-qgraytwo leading-7">جاري التحميل...</p>
                ) : (
                  <div 
                    className="text-[15px] text-qgraytwo leading-7 mb-2.5 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                )}

                <Link to="/contact">
                  <div className="w-[121px] h-10 mt-5">
                    <span className="yellow-btn">تواصل معنا</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container-x mx-auto my-[60px]">
          <div
            data-aos="fade-down"
            className="best-services w-full bg-qyellow flex flex-col space-y-10 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center lg:h-[110px] px-10 lg:py-0 py-10"
          >
            <div className="item">
              <div className="flex space-x-5 items-center">
                <div className="ml-2">
                  <span>
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1H5.63636V24.1818H35"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M34.9982 1H11.8164V18H34.9982V1Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M11.8164 7.18164H34.9982"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-black text-[15px] font-700 tracking-wide mb-1 uppercase">
                    {t("footer.freeShipping")}
                  </p>
                  <p className="text-sm text-qblack">{t("footer.freeShippingDesc")}</p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="flex space-x-5 items-center">
                <div className="ml-2">
                  <span>
                    <svg
                      width="32"
                      height="34"
                      viewBox="0 0 32 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M30.7 2L29.5 10.85L20.5 9.65"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-black text-[15px] font-700 tracking-wide mb-1 uppercase">
                    {t("footer.freeReturn")}
                  </p>
                  <p className="text-sm text-qblack">
                    {t("footer.freeReturnDesc")}
                  </p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="flex space-x-5 items-center">
                <div className="ml-2">
                  <span>
                    <svg
                      width="32"
                      height="38"
                      viewBox="0 0 32 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-black text-[15px] font-700 tracking-wide mb-1 uppercase">
                    {t("footer.securePayment")}
                  </p>
                  <p className="text-sm text-qblack">
                    {t("footer.securePaymentDesc")}
                  </p>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="flex space-x-5 items-center">
                <div className="ml-2">
                  <span>
                    <svg
                      width="32"
                      height="35"
                      viewBox="0 0 32 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M16 28V22"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                      <path
                        d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
                        stroke="#222222"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-black text-[15px] font-700 tracking-wide mb-1 uppercase">
                    {t("footer.onTimeDelivery")}
                  </p>
                  <p className="text-sm text-qblack">
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
