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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // 获取位置信息
  useEffect(() => {
    getLocationInfo().then((info) => {
      setLocationInfo(info);
    });
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

        // 延迟跳转，让用户看到成功提示
        const timer = setTimeout(() => {
          router.push("/dashboard");
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

  // 使用防抖的登录函数
  const handleLogin = debounce(loginAction, 300);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* 主要布局容器 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="flex space-x-8 max-w-5xl">
          {/* 左侧列 - 登录卡片和New in容器 */}
          <div className="flex flex-col h-[540px]">
            {/* 登录卡片 */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl w-80 flex-[2] mb-4">
              {/* 顶部标题区域 */}
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm text-gray-600 brand-text">
                  Agile Person Manage
                </div>
                <div
                  className="text-sm text-gray-600 cursor-pointer brand-text"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign up
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 login-title">
                  Log in
                </h2>
              </div>

              <form
                className="space-y-4 mb-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
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
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500"
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
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500"
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

                {/* 登录按钮 */}
                <div className="flex items-center justify-between">
                  <div className="text-left mr-2">
                    <p className="text-xs text-gray-600 leading-relaxed login-hint">
                      Make every day fulfilling and rewarding.
                    </p>
                  </div>
                  <AgButton
                    variant="primary"
                    size="md"
                    onClick={handleLogin}
                    disabled={isLoading}
                    icon={<ChevronRightIcon className="w-4 h-4" />}
                  >
                    {isLoading ? "Logging in..." : "Login"}
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

            {/* New in 容器 - 移到左侧列 */}
            <div className="bg-gray-900 text-white rounded-3xl p-6 w-80 shadow-2xl flex-1 flex flex-col justify-between">
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
          <div className="relative w-80 h-[540px]">
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

      {/* Toast容器 */}
      <ToastContainer />
    </main>
  );
}
