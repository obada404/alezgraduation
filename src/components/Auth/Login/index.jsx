import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import Thumbnail from "./Thumbnail";
import { login } from "../../../api/auth";
import { getToken } from "../../../api/client";
import Spinner from "../../Helpers/Spinner";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!email.trim() || !password.trim()) {
      setError(t("auth.pleaseFillForm"));
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/products");
    } catch (err) {
      // Check if error is 401 Unauthorized
      if (err.status === 401 || err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        setError(t("auth.wrongCredentials"));
      } else {
        // Don't show "email must be an email" or similar validation errors
        // Only show meaningful error messages
        const errorMessage = err.message || "";
        if (errorMessage.includes("must be an email") || errorMessage.includes("email")) {
          setError(t("auth.wrongCredentials"));
        } else {
          setError(errorMessage || "حدث خطأ أثناء تسجيل الدخول");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const alreadyLoggedIn = getToken();

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              <div className="w-full">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                  <h1 className="text-[28px] font-bold leading-[44px] text-qblack">
                    {t("auth.login")}
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
                  {error ? (
                    <div className="text-qred text-sm bg-red-50 border border-red-100 rounded p-3">
                      {error}
                    </div>
                  ) : null}
                  {alreadyLoggedIn ? (
                    <div className="text-sm text-qgreen">
                      You are already logged in. You can continue to the shop.
                    </div>
                  ) : null}
                  <div className="signin-area">
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="black-btn mb-4 text-sm text-white w-full h-[50px] font-semibold flex justify-center items-center disabled:opacity-60"
                      >
                        {loading ? <Spinner size="sm" className="text-white" /> : <span>{t("auth.login")}</span>}
                      </button>
                    </div>
                    <p className="text-sm text-qgraytwo font-normal text-center">
                      {t("auth.dontHaveAccount")}
                      <Link to="/signup" className="ml-2 text-qblack">
                        {t("auth.signUpFree")}
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
