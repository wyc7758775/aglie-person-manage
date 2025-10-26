/**
 * 玻璃拟态风格登录界面
 * 现代玻璃效果设计，营造轻盈通透的视觉体验
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgButton from "@/app/ui/ag-button";
import { ToastContainer } from "@/app/ui/toast";
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronRightIcon,
  StarIcon,
} from "@/app/ui/icons";

// 声明全局showToast方法
declare global {
  interface Window {
    showToast?: (
      message: string,
      type: "success" | "error" | "info",
      duration?: number
    ) => void;
  }
}

// 获取当前日期信息的函数
function getCurrentDateInfo() {
  const now = new Date();

  // 获取星期几的缩写
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekday = weekdays[now.getDay()];

  // 获取日期并添加序数后缀
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

// 获取IP地址和位置信息的函数
async function getLocationInfo() {
  // 检查是否为本地开发环境
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0";

  if (isLocalhost) {
    // 本地环境直接返回本地IP信息
    return {
      city: "本地开发",
      region: "开发环境",
      country: "本地主机",
      ip: "127.0.0.1",
      timezone: "Asia/Shanghai",
    };
  }

  try {
    // 使用免费的IP地理位置API
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    return {
      city: data.city || "未知城市",
      region: data.region || "未知地区",
      country: data.country_name || "未知国家",
      ip: data.ip || "未知IP",
      timezone: data.timezone || "UTC",
    };
  } catch (error) {
    console.error("获取位置信息失败:", error);
    return {
      city: "本地",
      region: "本地网络",
      country: "中国",
      ip: "127.0.0.1",
      timezone: "Asia/Shanghai",
    };
  }
}

// 获取当前时间信息的函数
function getCurrentTimeInfo() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 格式化时间为 HH:MM 格式
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  // 判断上午/下午
  const period = hours >= 12 ? "PM" : "AM";

  return {
    time: formattedTime,
    period: period,
    displayTime: `${formattedTime} ${period}`,
  };
}

export default function Page() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [locationInfo, setLocationInfo] = useState({
    city: "加载中...",
    region: "获取位置信息",
    country: "",
    ip: "",
    timezone: "",
  });
  const router = useRouter();

  // 获取当前日期信息
  const dateInfo = getCurrentDateInfo();

  // 获取当前时间信息
  const [timeInfo, setTimeInfo] = useState(getCurrentTimeInfo());

  // 获取位置信息和自动填充登录信息
  useEffect(() => {
    getLocationInfo().then((info) => {
      setLocationInfo(info);
    });

    // 自动填充上次登录成功的账号密码
    try {
      const savedNickname = localStorage.getItem("lastLoginNickname");
      const savedPassword = localStorage.getItem("lastLoginPassword");

      if (savedNickname) {
        setNickname(savedNickname);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    } catch (error) {
      console.log("读取保存的登录信息失败:", error);
    }
  }, []);

  // 每分钟更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getCurrentTimeInfo());
    }, 60000); // 每60秒更新一次

    return () => clearInterval(timer);
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    duration = 3000
  ) => {
    if (window.showToast) {
      window.showToast(message, type, duration);
    }
  };

  // 防抖函数
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const loginAction = async () => {
    if (!nickname || !password) {
      showToast("请填写昵称和密码", "error");
      return;
    }

    if (isLoading) return; // 防止重复点击

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
        console.log("登录成功:", data.user);
        showToast(`欢迎回来，${data.user.nickname}！`, "success");

        // 保存登录成功的账号密码
        try {
          localStorage.setItem("lastLoginNickname", nickname);
          localStorage.setItem("lastLoginPassword", password);
        } catch (error) {
          console.log("保存登录信息失败:", error);
        }

        // 延迟跳转，让用户看到成功提示
        const timer = setTimeout(() => {
          router.push("/dashboard/overview");
          clearTimeout(timer);
        }, 200);
      } else {
        console.error("登录失败:", data.message);
        showToast(`登录失败: ${data.message}`, "error");
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      showToast("登录请求失败，请稍后重试", "error");
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
      showToast("请填写所有字段", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }

    if (password.length < 6) {
      showToast("密码长度至少6位", "error");
      return;
    }

    if (isLoading) return; // 防止重复点击

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
        console.log("注册成功:", data.user);
        showToast(`注册成功，欢迎 ${data.user.nickname}！`, "success");

        // 注册成功后自动切换到登录模式
        setTimeout(() => {
          setIsSignUpMode(false);
          setConfirmPassword("");
          // 保存注册成功的账号密码
          try {
            localStorage.setItem("lastLoginNickname", nickname);
            localStorage.setItem("lastLoginPassword", password);
          } catch (error) {
            console.log("保存登录信息失败:", error);
          }
        }, 1000);
      } else {
        console.error("注册失败:", data.message);
        showToast(`注册失败: ${data.message}`, "error");
      }
    } catch (error) {
      console.error("注册请求失败:", error);
      showToast("注册请求失败，请稍后重试", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // 使用防抖的登录函数
  const handleLogin = debounce(loginAction, 300);

  // 使用防抖的注册函数
  const handleRegister = debounce(registerAction, 300);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* 主要布局容器 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        {/* 主要内容区域 */}
        <div className="flex items-center justify-center w-full">
          {/* 水平布局容器 */}
          <div
            className={`flex items-center justify-center space-x-8 max-w-6xl transition-all duration-700 ease-in-out ${
              isSignUpMode ? "mb-8" : "mb-0"
            }`}
          >
            {/* 左侧列 - 登录卡片和个人名片 */}
            <div className="flex flex-col h-[540px]">
              {/* 登录卡片 */}
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
                {/* 顶部标题区域 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-600 brand-text">
                    Agile Person Manage
                  </div>
                  <div
                    className="text-xs text-gray-600 cursor-pointer brand-text hover:text-gray-800 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/20"
                    onClick={toggleMode}
                  >
                    {isSignUpMode ? "Log in" : "Sign up"}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 login-title whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] transform hover:scale-105 hover:text-blue-600">
                    {isSignUpMode ? "Sign up" : "Log in"}
                  </h2>
                </div>

                <form
                  className="space-y-4 mb-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    isSignUpMode ? handleRegister() : handleLogin();
                  }}
                >
                  {/* 昵称输入框 */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/60 focus:bg-white/70 focus:scale-[1.02] hover:shadow-lg"
                    />
                  </div>

                  {/* 密码输入框 */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
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

                  {/* 确认密码输入框 - 优化动画 */}
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
                        placeholder="confirm password"
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

                  {/* 登录/注册按钮 */}
                  <div className="flex items-center justify-between">
                    <div className="text-left mr-2">
                      <p className="text-xs text-gray-600 leading-relaxed login-hint">
                        {isSignUpMode
                          ? "Join us and start your journey."
                          : "Make every day fulfilling and rewarding."}
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
                          ? "Signing up..."
                          : "Logging in..."
                        : isSignUpMode
                        ? "Sign up"
                        : "Login"}
                    </AgButton>
                  </div>
                </form>

                {/* 底部文字 */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-600 leading-relaxed login-hint">
                    Focus on the present, plan for the future, achieve a better
                    you.
                  </p>
                </div>
              </div>

              {/* 个人名片 - 在左侧列 */}
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
                  {/* 放入 me.png 图片 */}
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

            {/* 右侧信息卡片 - 双层结构 */}
            <div
              className={`relative w-80 h-[540px] transition-all duration-[900ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                isSignUpMode
                  ? "transform translate-x-[-130px] translate-y-[-70px] scale-53 rotate-[7deg] opacity-70"
                  : "transform translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
              }`}
              style={{
                zIndex: isSignUpMode ? 2 : 20,
              }}
            >
              {/* 第一层：白色背景底层 */}
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl">
                {/* 橙色圆形装饰 - 居中对齐 */}
                <div className="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full">
                  {/* 内部装饰 */}
                  <div className="absolute top-6 right-6 w-6 h-6 bg-orange-200/40 rounded-full"></div>
                </div>
              </div>

              {/* 第二层：毛玻璃效果容器 - 左侧半宽 */}
              <div className="relative z-10 w-40 h-full bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
                {/*  当前地址 */}
                <div className="absolute top-4 left-4 text-left">
                  <div className="text-gray-600 text-xs font-medium">
                    {locationInfo.city}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {locationInfo.region}
                  </div>
                </div>

                {/* 主要内容 */}
                <div className="flex flex-col h-full">
                  {/* 日期部分 */}
                  <div className="mb-6 mt-8">
                    <div className="text-4xl font-bold text-gray-900 leading-none">
                      {dateInfo.weekday}
                    </div>
                    <div className="text-2xl font-light text-gray-400 mt-1">
                      {dateInfo.dayWithSuffix}
                    </div>
                  </div>

                  {/* 中间空间 */}
                  <div className="flex-1"></div>

                  {/* 底部信息 */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-gray-700 font-medium text-sm">
                        {timeInfo.displayTime}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {locationInfo.ip}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {locationInfo.country}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <StarIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 font-medium text-sm brand-text">
                        Star
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join in 按钮 - 位于第一层右下角 */}
              <div className="absolute bottom-6 right-6">
                <AgButton
                  variant="primary"
                  size="md"
                  onClick={routerJoinInProject}
                  icon={<ChevronRightIcon className="w-4 h-4" />}
                >
                  Join in
                </AgButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast容器 */}
      <ToastContainer />
    </main>
  );
}
