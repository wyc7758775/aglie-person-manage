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
      icon: <DashboardIcon className="w-5 h-5" />,
    },
    {
      nameKey: "dashboard.nav.project",
      href: "/dashboard/project",
      icon: <ProjectIcon className="w-5 h-5" />,
    },
    {
      nameKey: "dashboard.nav.rewards",
      href: "/dashboard/rewards",
      icon: <RewardIcon className="w-5 h-5" />,
    },
  ];

  const optionsMenus = [
    {
      nameKey: "dashboard.nav.notifications",
      href: "/dashboard/notifications",
      icon: <NotificationIcon className="w-5 h-5" />,
    },
    {
      nameKey: "dashboard.nav.setting",
      href: "/dashboard/setting",
      icon: <SettingsIcon className="w-5 h-5 text-gray-500" />,
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
      // 容器padding(4px) + 导航项间距(12px space-y-3) * 索引 + 导航项高度(40px) * 索引
      const itemHeight = 40; // w-10 h-10
      const itemSpacing = 12; // space-y-3
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
        const itemHeight = 40;
        const itemSpacing = 12;
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
        <div className="mb-6">
          <Link href="/dashboard" className="flex flex-col items-center">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center mb-1">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="text-[9px] font-medium text-gray-800">Be.run</span>
          </Link>
        </div>
        {/* 导航容器 - 使用统一的指示器 */}
        <div className="relative">
          {/* 统一的滑动高亮指示器 */}
          {indicatorPosition.show && (
            <div
              className="absolute w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-xl"
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
          <div className="flex flex-col items-center rounded-full p-1 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
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
                  <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full">
                    <div
                      className={`w-5 h-5 transition-all duration-500 ease-in-out ${
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
          <div className="flex flex-col items-center rounded-full p-1 bg-white space-y-3 mt-4 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
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
                  <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full">
                    <div
                      className={`w-5 h-5 transition-all duration-500 ease-in-out ${
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
          className="w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full bg-transparent border-none cursor-pointer"
          title="退出登录"
        >
          <svg
            className="w-5 h-5 text-gray-400 opacity-60 transition-all duration-300 ease-in-out"
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
        <div className=" mt-2">
          <Link href="/dashboard/profile">
            <div className="w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ease-in-out opacity-80">
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
