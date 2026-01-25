import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import Thumbnail from "./Thumbnail";
import { signup } from "../../../api/auth";
import Spinner from "../../Helpers/Spinner";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!email.trim() || !password.trim() || !phone.trim()) {
      setError(t("auth.pleaseFillForm"));
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await signup({ email, password, mobileNumber: phone });
      navigate("/products");
    } catch (err) {
      // Don't show "email must be an email" or similar validation errors
      // Only show meaningful error messages
      const errorMessage = err.message || "";
      if (errorMessage.includes("must be an email") || errorMessage.includes("email")) {
        setError(t("auth.wrongCredentials"));
      } else {
        setError(errorMessage || "حدث خطأ أثناء إنشاء الحساب");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="signup-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              <div className="w-full">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                  <h1 className="text-[28px] font-bold leading-[44px] text-qblack">
                    {t("auth.signUpFree")}
                  </h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputCom
                    placeholder={t("auth.emailPlaceholder")}
                    label={t("auth.email") + "*"}
                    name="email"
                    type="email"
                    value={email}
                    inputHandler={(e) => setEmail(e.target.value)}
                    inputClasses="h-[50px]"
                  />
                  
                  <InputCom
                    placeholder={t("auth.passwordPlaceholder")}
                    label={t("auth.password") + "*"}
                    name="password"
                    type="password"
                    value={password}
                    inputHandler={(e) => setPassword(e.target.value)}
                    inputClasses="h-[50px]"
                  />
                  <div className="input-com w-full h-full">
                    <label className="text-qgray text-[13px] font-normal capitalize block mb-2">
                      رقم الهاتف*
                    </label>
                    <div className="input-wrapper border border-qgray-border w-full h-full overflow-hidden relative">
                      <input
                        placeholder="رقم الهاتف"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field placeholder:text-sm text-sm px-6 text-dark-gray w-full h-[25px] font-normal bg-white focus:ring-0 focus:outline-none text-right placeholder:text-right"
                        type="tel"
                        id="phone"
                        name="phone"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  {error ? (
                    <div className="text-qred text-sm bg-red-50 border border-red-100 rounded p-3">
                      {error}
                    </div>
                  ) : null}
                  <div className="signin-area">
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="black-btn mb-4 text-sm text-white w-full h-[50px] font-semibold flex justify-center items-center disabled:opacity-60"
                      >
                        {loading ? <Spinner size="sm" className="text-white" /> : <span>{t("auth.signup")}</span>}
                      </button>
                    </div>
                    <p className="text-sm text-qgraytwo font-normal text-center">
                      تملك حساب بالفعل؟ 
                      <Link to="/login" className="ml-2 text-qblack">
                        {t("auth.login")}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex-1 lg:flex hidden transform scale-90 xl:scale-100 xl:justify-center ">
              <div
                className="absolute xl:-right-20 -right-[138px]"
                style={{ top: "calc(50% - 258px)" }}
              >
                <Thumbnail />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
