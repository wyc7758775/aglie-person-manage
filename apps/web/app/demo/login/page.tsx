"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoLoginPage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!nickname || !password) {
      alert("请输入昵称和密码");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard/overview");
      } else {
        alert(data.message || "登录失败");
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      alert("登录请求失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* 左侧品牌区域 - 60% 宽度，青色背景 */}
      <section 
        className="hidden lg:flex lg:w-[60%] flex-col justify-center px-20"
        style={{ backgroundColor: "#0D6E6E" }}
      >
        {/* Logo 区域 */}
        <div className="flex items-center gap-4 mb-12">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0D6E6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#0D6E6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0D6E6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span 
            className="text-2xl font-medium"
            style={{ 
              color: "#FFFFFF",
              fontFamily: "Newsreader, Georgia, serif"
            }}
          >
            Agile Person
          </span>
        </div>

        {/* 主标题 */}
        <h1 
          className="text-5xl font-medium mb-6 leading-tight"
          style={{ 
            color: "#FFFFFF",
            fontFamily: "Newsreader, Georgia, serif",
            lineHeight: 1.1
          }}
        >
          人人都是产品经理
        </h1>

        {/* 副标题 */}
        <p 
          className="text-lg mb-16 max-w-lg"
          style={{ 
            color: "#FFFFFFCC",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.5
          }}
        >
          将生活中所有事务产品化管理，让每一天都充满效率与成就感
        </p>

        {/* 特性列表 */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#E07B54" }}
            />
            <span 
              className="text-sm"
              style={{ 
                color: "#FFFFFF",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
            >
              任务管理：习惯、日常、待办三合一
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#E07B54" }}
            />
            <span 
              className="text-sm"
              style={{ 
                color: "#FFFFFF",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
            >
              项目管理：Sprint 与慢燃两种模式
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#E07B54" }}
            />
            <span 
              className="text-sm"
              style={{ 
                color: "#FFFFFF",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
            >
              奖励机制：积分、徽章、等级激励
            </span>
          </div>
        </div>
      </section>

      {/* 右侧表单区域 - 40% 宽度，白色背景 */}
      <section 
        className="w-full lg:w-[40%] flex flex-col justify-center px-12 lg:px-16"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* 移动端 Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#0D6E6E" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span 
            className="text-xl font-medium"
            style={{ 
              color: "#1A1A1A",
              fontFamily: "Newsreader, Georgia, serif"
            }}
          >
            Agile Person
          </span>
        </div>

        {/* 表单标题 */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-medium mb-2"
            style={{ 
              color: "#1A1A1A",
              fontFamily: "Newsreader, Georgia, serif"
            }}
          >
            欢迎回来
          </h2>
          <p 
            className="text-sm"
            style={{ 
              color: "#666666",
              fontFamily: "Inter, system-ui, sans-serif"
            }}
          >
            登录您的 Agile Person 账户
          </p>
        </div>

        {/* 表单 */}
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          {/* 昵称输入 */}
          <div>
            <label 
              className="block text-xs font-semibold mb-2 uppercase tracking-widest"
              style={{ 
                color: "#888888",
                fontFamily: "JetBrains Mono, monospace"
              }}
            >
              昵称
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入您的昵称"
              className="w-full h-12 px-4 rounded-lg border text-sm transition-all duration-200 focus:outline-none"
              style={{ 
                backgroundColor: "#FAFAFA",
                borderColor: "#E5E5E5",
                color: "#1A1A1A",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0D6E6E"}
              onBlur={(e) => e.target.style.borderColor = "#E5E5E5"}
            />
          </div>

          {/* 密码输入 */}
          <div>
            <label 
              className="block text-xs font-semibold mb-2 uppercase tracking-widest"
              style={{ 
                color: "#888888",
                fontFamily: "JetBrains Mono, monospace"
              }}
            >
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入您的密码"
              className="w-full h-12 px-4 rounded-lg border text-sm transition-all duration-200 focus:outline-none"
              style={{ 
                backgroundColor: "#FAFAFA",
                borderColor: "#E5E5E5",
                color: "#1A1A1A",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0D6E6E"}
              onBlur={(e) => e.target.style.borderColor = "#E5E5E5"}
            />
          </div>

          {/* 选项行 */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: "#0D6E6E" }}
              />
              <span 
                className="text-sm"
                style={{ 
                  color: "#666666",
                  fontFamily: "Inter, system-ui, sans-serif"
                }}
              >
                记住我
              </span>
            </label>
            <button
              type="button"
              className="text-sm hover:underline transition-all"
              style={{ 
                color: "#0D6E6E",
                fontFamily: "Inter, system-ui, sans-serif"
              }}
            >
              忘记密码？
            </button>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: "#0D6E6E",
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "1px"
            }}
          >
            {isLoading ? "登录中..." : "登录"}
          </button>
        </form>

        {/* 分隔线 */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E5E5" }} />
          <span 
            className="text-xs"
            style={{ 
              color: "#888888",
              fontFamily: "Inter, system-ui, sans-serif"
            }}
          >
            或者
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E5E5" }} />
        </div>

        {/* 注册链接 */}
        <div className="text-center">
          <span 
            className="text-sm"
            style={{ 
              color: "#666666",
              fontFamily: "Inter, system-ui, sans-serif"
            }}
          >
            还没有账户？{" "}
          </span>
          <button
            type="button"
            className="text-sm font-medium hover:underline transition-all"
            style={{ 
              color: "#0D6E6E",
              fontFamily: "Inter, system-ui, sans-serif"
            }}
          >
            立即注册
          </button>
        </div>
      </section>
    </main>
  );
}
