"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DashboardIcon,
  ProjectIcon,
  NotificationIcon,
  SettingsIcon,
  RewardIcon,
} from "@/app/ui/icons";
import { useLanguage } from "@/app/lib/i18n";
import { useAuth } from "@/app/lib/hooks/useAuth";

export default function SideNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [indicatorPosition, setIndicatorPosition] = useState({
    top: 0,
    show: false,
  });

  const [isMoving, setIsMoving] = useState(false);

  const mainLinks = [
    {
      nameKey: "dashboard.nav.overview",
      href: "/dashboard/overview",
      icon: <DashboardIcon className="w-4 h-4" />,
    },
    {
      nameKey: "dashboard.nav.project",
      href: "/dashboard/project",
      icon: <ProjectIcon className="w-4 h-4" />,
    },
    {
      nameKey: "dashboard.nav.rewards",
      href: "/dashboard/rewards",
      icon: <RewardIcon className="w-4 h-4" />,
    },
  ];

  const optionsMenus = [
    {
      nameKey: "dashboard.nav.notifications",
      href: "/dashboard/notifications",
      icon: <NotificationIcon className="w-4 h-4" />,
    },
    {
      nameKey: "dashboard.nav.setting",
      href: "/dashboard/setting",
      icon: <SettingsIcon className="w-4 h-4 text-gray-500" />,
    },
  ];

  // 跟踪当前激活的导航项并计算指示器位置
  useEffect(() => {
    // 检查主导航
    const mainIndex = mainLinks.findIndex(
      (link) => pathname === link.href || pathname.startsWith(link.href + "/"),
    );

    if (mainIndex !== -1) {
      // 主导航区域的位置计算
      // 容器padding(4px) + 导航项间距(8px space-y-2) * 索引 + 导航项高度(32px) * 索引
      const itemHeight = 32; // w-8 h-8
      const itemSpacing = 8; // space-y-2
      const containerPadding = 4; // p-1
      const topPosition =
        containerPadding + mainIndex * (itemHeight + itemSpacing);

      // 触发移动状态
      if (indicatorPosition.top !== topPosition && indicatorPosition.show) {
        setIsMoving(true);
        // 分阶段动画：先拉伸，然后移动，最后恢复
        setTimeout(() => setIsMoving(false), 600); // 总动画持续600ms
      }

      setIndicatorPosition({ top: topPosition, show: true });
    } else {
      // 检查选项菜单
      const optionsIndex = optionsMenus.findIndex(
        (link) =>
          pathname === link.href || pathname.startsWith(link.href + "/"),
      );

      if (optionsIndex !== -1) {
        // 选项菜单区域的位置计算
        const itemHeight = 32;
        const itemSpacing = 8;
        const containerPadding = 4;

        // 主导航区域的总高度
        const mainNavTotalHeight =
          containerPadding * 2 +
          mainLinks.length * itemHeight +
          (mainLinks.length - 1) * itemSpacing;
        const spacingBetweenSections = 16; // mt-4

        // 选项菜单中的位置
        const optionsTopPosition =
          containerPadding + optionsIndex * (itemHeight + itemSpacing);

        // 最终位置 = 主导航高度 + 间距 + 选项菜单内位置
        const topPosition =
          mainNavTotalHeight + spacingBetweenSections + optionsTopPosition;

        // 触发移动状态
        if (indicatorPosition.top !== topPosition && indicatorPosition.show) {
          setIsMoving(true);
          // 分阶段动画：先拉伸，然后移动，最后恢复
          setTimeout(() => setIsMoving(false), 600); // 总动画持续600ms
        }

        setIndicatorPosition({ top: topPosition, show: true });
      } else {
        setIndicatorPosition({ top: 0, show: false });
      }
    }
  }, [pathname, indicatorPosition.top, indicatorPosition.show]);

  return (
    <div className="fixed  h-full flex flex-col items-center justify-between py-8 ml-4">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mb-3">
          <Link href="/dashboard" className="flex flex-col items-center group">
            {/* 可爱活泼 Logo */}
            <div className="relative w-8 h-8 mb-1">
              <svg
                className="w-full h-full"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* 糖果色渐变 */}
                  <linearGradient id="candyGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B9D" />
                    <stop offset="100%" stopColor="#FF8FB0" />
                  </linearGradient>

                  <linearGradient id="candyGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#D8B4FE" />
                  </linearGradient>

                  <linearGradient id="candyGradient3" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#93C5FD" />
                  </linearGradient>

                  {/* 高光滤镜 */}
                  <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* 可爱动画 */}
                  <style>{`
                    @keyframes bounce {
                      0%, 100% { transform: translateY(0) scale(1); }
                      50% { transform: translateY(-2px) scale(1.15); }
                    }
                    @keyframes wiggle {
                      0%, 100% { transform: rotate(-3deg); }
                      50% { transform: rotate(3deg); }
                    }
                    @keyframes twinkle {
                      0%, 100% { opacity: 0.4; transform: scale(0.8); }
                      50% { opacity: 1; transform: scale(1.2); }
                    }
                    @keyframes float {
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(-1px); }
                    }
                    .dot1 { animation: bounce 2s ease-in-out infinite; transform-origin: 10px 30px; }
                    .dot2 { animation: bounce 2s ease-in-out infinite 0.3s; transform-origin: 20px 20px; }
                    .dot3 { animation: bounce 2s ease-in-out infinite 0.6s; transform-origin: 30px 10px; }
                    .connector { animation: wiggle 3s ease-in-out infinite; transform-origin: center; }
                    .star1 { animation: twinkle 1.5s ease-in-out infinite; }
                    .star2 { animation: twinkle 1.5s ease-in-out infinite 0.5s; }
                    .star3 { animation: twinkle 1.5s ease-in-out infinite 1s; }
                  `}</style>
                </defs>

                {/* 连接线 - 粗圆润曲线 */}
                <path
                  d="M 10 30 Q 15 24 20 19 Q 25 14 30 9"
                  fill="none"
                  stroke="url(#candyGradient2)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="connector"
                  opacity="0.7"
                />

                {/* 底部圆点 - 大号糖果粉 */}
                <circle
                  cx="10"
                  cy="30"
                  r="5"
                  fill="url(#candyGradient1)"
                  className="dot1"
                  filter="url(#softGlow)"
                />
                {/* 圆点高光 */}
                <ellipse cx="8.5" cy="28" rx="1.5" ry="1" fill="white" opacity="0.6" className="dot1" />

                {/* 中间圆点 - 中号糖果紫 */}
                <circle
                  cx="20"
                  cy="19"
                  r="5"
                  fill="url(#candyGradient2)"
                  className="dot2"
                  filter="url(#softGlow)"
                />
                {/* 圆点高光 */}
                <ellipse cx="18.5" cy="17" rx="1.5" ry="1" fill="white" opacity="0.6" className="dot2" />

                {/* 顶部圆点 - 小号糖果蓝 */}
                <circle
                  cx="30"
                  cy="9"
                  r="5"
                  fill="url(#candyGradient3)"
                  className="dot3"
                  filter="url(#softGlow)"
                />
                {/* 圆点高光 */}
                <ellipse cx="28.5" cy="7" rx="1.5" ry="1" fill="white" opacity="0.6" className="dot3" />

                {/* 小星星装饰 */}
                <path
                  d="M 6 8 L 7 11 L 10 11 L 7.5 13 L 8.5 16 L 6 14 L 3.5 16 L 4.5 13 L 2 11 L 5 11 Z"
                  fill="#FCD34D"
                  className="star1"
                  opacity="0.8"
                />
                <path
                  d="M 33 18 L 33.8 20 L 36 20 L 34.2 21.2 L 34.8 23.5 L 33 22.2 L 31.2 23.5 L 31.8 21.2 L 30 20 L 32.2 20 Z"
                  fill="#F472B6"
                  className="star2"
                  opacity="0.8"
                />
                <circle cx="35" cy="6" r="1.5" fill="#60A5FA" className="star3" opacity="0.7" />
              </svg>
            </div>

            {/* 品牌文字 */}
            <div className="flex flex-col items-center">
              <span
                className="text-[9px] font-bold tracking-wider text-gray-700 leading-tight"
                style={{ fontFamily: 'Quicksand, Nunito, system-ui, sans-serif' }}
              >
                AGILE
              </span>
              <span
                className="text-[5px] tracking-[0.15em] text-gray-500 mt-0.5 uppercase leading-tight"
                style={{ fontFamily: 'Quicksand, Nunito, system-ui, sans-serif' }}
              >
                ✨ Life Flow
              </span>
            </div>
          </Link>
        </div>
        {/* 导航容器 - 使用统一的指示器 */}
        <div className="relative">
          {/* 统一的滑动高亮指示器 */}
          {indicatorPosition.show && (
            <div
              className="absolute w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-xl"
              style={{
                transform: `translateY(${
                  indicatorPosition.top
                }px) scale(1.08) ${isMoving ? "scaleY(1.2) scaleX(0.9)" : ""}`,
                left: "4px",
                zIndex: 1,
                transition: isMoving
                  ? "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease-out"
                  : "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: isMoving
                  ? "0 15px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)"
                  : "0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                borderRadius: isMoving ? "50% / 40%" : "50%",
              }}
            />
          )}

          {/* 主导航链接 */}
          <div className="flex flex-col items-center rounded-full p-1 bg-white space-y-2 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
            {mainLinks.map((link, index) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.nameKey}
                  href={link.href}
                  className="group relative z-10"
                  title={t(link.nameKey)}
                >
                  <div className="w-8 h-8 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full">
                    <div
                      className={`w-4 h-4 transition-all duration-500 ease-in-out ${
                        isActive
                          ? "text-yellow-400 scale-110"
                          : "text-gray-400 opacity-60"
                      }`}
                    >
                      {link.icon}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 选项菜单 */}
          <div className="flex flex-col items-center rounded-full p-1 bg-white space-y-2 mt-4 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
            {optionsMenus.map((link, index) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.nameKey}
                  href={link.href}
                  className="group relative z-10"
                  title={t(link.nameKey)}
                >
                  <div className="w-8 h-8 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full">
                    <div
                      className={`w-4 h-4 transition-all duration-500 ease-in-out ${
                        isActive
                          ? "text-yellow-400 scale-110"
                          : "text-gray-400 opacity-60"
                      }`}
                    >
                      {link.icon}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center rounded-full p-1 bg-white shadow-sm transition-shadow duration-300 ease-in-out">
        {/* 退出登录图标 */}
        <button
          onClick={logout}
          className="w-8 h-8 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full bg-transparent border-none cursor-pointer"
          title="退出登录"
        >
          <svg
            className="w-4 h-4 text-gray-400 opacity-60 transition-all duration-300 ease-in-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
        {/* 底部用户头像 */}
        <div className="mt-2">
          <Link href="/dashboard/profile">
            <div className="w-8 h-8 rounded-full overflow-hidden transition-all duration-300 ease-in-out opacity-80">
              <img
                src="/me.png"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
