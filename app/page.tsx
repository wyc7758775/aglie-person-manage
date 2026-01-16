/**
 * Glassmorphism login interface
 * Modern glass effect design, creating a light and transparent visual experience
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgButton from "@/app/ui/ag-button";
import InfoCard from "@/app/ui/info-card";
import { ToastContainer } from "@/app/ui/toast";
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronRightIcon,
} from "@/app/ui/icons";
import { useLanguage } from "@/app/lib/i18n";

// Declare global showToast method
declare global {
  interface Window {
    showToast?: (
      message: string,
      type: "success" | "error" | "info",
      duration?: number,
    ) => void;
  }
}

// Get current date info function
function getCurrentDateInfo() {
  const now = new Date();

  // Get weekday abbreviation
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekday = weekdays[now.getDay()];

  // Get date with ordinal suffix
  const day = now.getDate();
  const getDayWithSuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  return {
    weekday,
    dayWithSuffix: getDayWithSuffix(day),
  };
}

// Get IP and location info function
async function getLocationInfo() {
  // Check if it's local development environment
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0";

  if (isLocalhost) {
    return {
      city: "Local Dev",
      region: "Development",
      country: "Localhost",
      ip: "127.0.0.1",
      timezone: "Asia/Shanghai",
    };
  }

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    return {
      city: data.city || "Unknown City",
      region: data.region || "Unknown Region",
      country: data.country_name || "Unknown Country",
      ip: data.ip || "Unknown IP",
      timezone: data.timezone || "UTC",
    };
  } catch (error) {
    console.error("Failed to get location info:", error);
    return {
      city: "Local",
      region: "Local Network",
      country: "China",
      ip: "127.0.0.1",
      timezone: "Asia/Shanghai",
    };
  }
}

// Get current time info function
function getCurrentTimeInfo() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const period = hours >= 12 ? "PM" : "AM";

  return {
    time: formattedTime,
    period: period,
    displayTime: `${formattedTime} ${period}`,
  };
}

export default function Page() {
  const { t } = useLanguage();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [locationInfo, setLocationInfo] = useState({
    city: "Loading...",
    region: "Getting location",
    country: "",
    ip: "",
    timezone: "",
  });
  const router = useRouter();

  const dateInfo = getCurrentDateInfo();
  const [timeInfo, setTimeInfo] = useState(getCurrentTimeInfo());

  useEffect(() => {
    getLocationInfo().then((info) => {
      setLocationInfo(info);
    });

    const params = new URLSearchParams(window.location.search);
    const nextUrl = params.get('next');
    if (nextUrl && nextUrl.startsWith('/dashboard')) {
      showToast(t('login.guards.pleaseLogin'), 'info', 3000);
    }

    try {
      if (
        typeof window !== "undefined" &&
        window.localStorage &&
        typeof window.localStorage.getItem === "function"
      ) {
        const savedNickname = window.localStorage.getItem("lastLoginNickname");
        const savedPassword = window.localStorage.getItem("lastLoginPassword");

        if (savedNickname) {
          setNickname(savedNickname);
        }
        if (savedPassword) {
          setPassword(savedPassword);
        }
      }
    } catch (error) {
      console.log("Failed to read saved login info:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getCurrentTimeInfo());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    duration = 3000,
  ) => {
    if (window.showToast) {
      window.showToast(message, type, duration);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const loginAction = async () => {
    if (!nickname || !password) {
      showToast(t("login.errors.nicknameRequired"), "error");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Login success:", data.user);
        showToast(t("login.success.welcomeBack", { nickname: data.user.nickname }), "success");

        try {
          if (
            typeof window !== "undefined" &&
            window.localStorage &&
            typeof window.localStorage.setItem === "function"
          ) {
            window.localStorage.setItem("lastLoginNickname", nickname);
            window.localStorage.setItem("lastLoginPassword", password);
            window.localStorage.setItem("auth_access_token", "token_" + Date.now());
          }
        } catch (error) {
          console.log("Failed to save login info:", error);
        }

        const params = new URLSearchParams(window.location.search);
        const nextUrl = params.get('next') || '/dashboard/overview';

        const timer = setTimeout(() => {
          router.push(nextUrl);
          clearTimeout(timer);
        }, 200);
      } else {
        console.error("Login failed:", data.message);
        showToast(t("login.errors.loginFailed", { message: data.message }), "error");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      showToast(t("login.errors.requestFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const routerBlog = () => {
    window.open("https://wyc7758775.github.io/yoran-secret/", "_blank");
  };
  const routerJoinInProject = () => {
    window.open("https://github.com/wyc7758775/aglie-person-manage", "_blank");
  };

  const registerAction = async () => {
    if (!nickname || !password || !confirmPassword) {
      showToast(t("login.errors.allFieldsRequired"), "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast(t("login.errors.passwordMismatch"), "error");
      return;
    }

    if (password.length < 6) {
      showToast(t("login.errors.passwordTooShort"), "error");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Registration success:", data.user);
        showToast(t("login.success.registerSuccess", { nickname: data.user.nickname }), "success");

        setTimeout(() => {
          setIsSignUpMode(false);
          setConfirmPassword("");
          try {
            if (
              typeof window !== "undefined" &&
              window.localStorage &&
              typeof window.localStorage.setItem === "function"
            ) {
              window.localStorage.setItem("lastLoginNickname", nickname);
              window.localStorage.setItem("lastLoginPassword", password);
            }
          } catch (error) {
            console.log("Failed to save login info:", error);
          }
        }, 1000);
      } else {
        console.error("Registration failed:", data.message);
        showToast(t("login.errors.registerFailed", { message: data.message }), "error");
      }
    } catch (error) {
      console.error("Registration request failed:", error);
      showToast(t("login.errors.registerRequestFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogin = debounce(loginAction, 300);
  const handleRegister = debounce(registerAction, 300);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="flex items-center justify-center w-full">
          <div
            className={`flex items-center justify-center space-x-8 max-w-6xl transition-all duration-700 ease-in-out ${
              isSignUpMode ? "mb-8" : "mb-0"
            }`}
          >
            <div className="flex flex-col h-[540px]">
              <div
                className={`bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 w-80 flex-[2] mb-4 relative transition-all duration-[700ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                  isSignUpMode
                    ? "transform translate-x-[120px] translate-y-[20px] scale-108 z-40 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.2)]"
                    : "transform translate-x-0 translate-y-0 scale-100 z-30 shadow-2xl"
                }`}
                style={{
                  height: "auto",
                  minHeight: "fit-content",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-600 brand-text">
                    Agile Person Manage
                  </div>
                  <div
                    className="text-xs text-gray-600 cursor-pointer brand-text hover:text-gray-800 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/20"
                    onClick={toggleMode}
                  >
                    {isSignUpMode ? t("login.switchingToLogin") : t("login.switchingToRegister")}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 login-title whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] transform hover:scale-105 hover:text-blue-600">
                    {isSignUpMode ? t("login.registerButton") : t("login.loginButton")}
                  </h2>
                </div>

                <form
                  className="space-y-4 mb-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    isSignUpMode ? handleRegister() : handleLogin();
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("login.nickname")}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/60 focus:bg-white/70 focus:scale-[1.02] hover:shadow-lg"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/60 focus:bg-white/70 focus:scale-[1.02] hover:shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div
                    className={`transition-all duration-[600ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] overflow-hidden ${
                      isSignUpMode
                        ? "max-h-[100px] opacity-100 mb-4 transform translate-y-0 scale-100"
                        : "max-h-0 opacity-0 mb-0 transform translate-y-[-15px] scale-90"
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("login.confirmPassword")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/60 focus:bg-white/70 focus:scale-[1.02] hover:shadow-lg"
                        tabIndex={isSignUpMode ? 0 : -1}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        tabIndex={isSignUpMode ? 0 : -1}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-left mr-2">
                      <p className="text-xs text-gray-600 leading-relaxed login-hint">
                        {isSignUpMode
                          ? t("login.hints.joinUs")
                          : t("login.hints.makeFulfilling")}
                      </p>
                    </div>
                    <AgButton
                      variant="primary"
                      size="md"
                      onClick={isSignUpMode ? handleRegister : handleLogin}
                      disabled={isLoading}
                      icon={<ChevronRightIcon className="w-4 h-4" />}
                      className="whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform hover:scale-105 active:scale-95 hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)]"
                    >
                      {isLoading
                        ? isSignUpMode
                          ? t("login.loading.signingUp")
                          : t("login.loading.loggingIn")
                        : isSignUpMode
                          ? t("login.registerButton")
                          : t("login.loginButton")}
                    </AgButton>
                  </div>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-600 leading-relaxed login-hint">
                    {t("login.focus.present")}, {t("login.focus.future")} {t("login.focus.achieveBetter")}
                  </p>
                </div>
              </div>

              <div
                className={`bg-gray-900 text-white rounded-3xl p-6 w-80 shadow-2xl flex-1 flex flex-col justify-between transition-all duration-[1000ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isSignUpMode
                    ? "transform translate-x-[100px] translate-y-[-40px] scale-80 rotate-[-3deg] opacity-80"
                    : "transform translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
                }`}
                style={{
                  zIndex: isSignUpMode ? 1 : 15,
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Yoran.Wu</h3>
                    <p className="text-gray-400 text-sm">Full Stack Engineer</p>
                  </div>
                  <img
                    src="/me.png"
                    alt="me"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={routerBlog}
                    className="text-sm text-gray-300 hover:text-white transition-colors brand-text"
                  >
                    About me
                  </button>
                </div>
              </div>
            </div>

            <InfoCard
              locationInfo={locationInfo}
              dateInfo={dateInfo}
              timeInfo={timeInfo}
              isSignUpMode={isSignUpMode}
              onJoinInClick={routerJoinInProject}
            />
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}
