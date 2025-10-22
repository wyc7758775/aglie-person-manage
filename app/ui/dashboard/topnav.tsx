'use client';

import Link from 'next/link';
import HabiticaLogo from '@/app/ui/acme-logo';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

/**
 * 顶部导航组件
 * 显示应用程序的主要导航链接和用户操作
 */
export default function TopNav() {
  const pathname = usePathname();
  
  // 主导航链接
  const mainLinks = [
    { name: "Overview", href: "/dashboard/overview" },
    { name: "Project", href: "/dashboard/project" },
    { name: "Requirement", href: "/dashboard/requirement" },
    { name: "Tasks", href: "/dashboard/task" },
    { name: "Defect", href: "/dashboard/defect" },
    { name: "Reward", href: "/dashboard/reward" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#F9FFD3] to-[#EE3F4D] text-[#333] shadow-md">
      <div className="px-3 py-0.5">
        <div className="flex items-center justify-between">
          {/* Logo和品牌 */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="transform hover:scale-110 transition-transform duration-200 bg-purple-900/30 p-0.5 rounded-md shadow-sm">
                <HabiticaLogo />
              </div>
            </Link>
          </div>
          
          {/* 主导航链接 */}
          <div className="hidden md:flex space-x-1">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-[#EE3F4D]/20 hover:shadow-inner",
                  {
                    "bg-[#EE3F4D]/30 font-bold shadow-inner text-[#333]": pathname === link.href || pathname.startsWith(link.href + '/'),
                  }
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* 用户操作和图标 */}
          <div className="flex items-center space-x-2">
            {/* 宝石图标 */}
            <div className="flex items-center bg-purple-900/30 px-1.5 py-0.5 rounded-full">
              <svg className="w-3 h-3 text-teal-300 drop-shadow-glow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6-10-6-10 6z" />
              </svg>
              <span className="ml-0.5 text-xs font-medium">10</span>
            </div>
            
            {/* 金币图标 */}
            <div className="flex items-center bg-purple-900/30 px-1.5 py-0.5 rounded-full">
              <svg className="w-3 h-3 text-yellow-300 drop-shadow-glow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
              <span className="ml-0.5 text-xs font-medium">1</span>
            </div>
            
            {/* 历史图标 */}
            <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 shadow-inner">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {/* 消息图标 */}
            <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 shadow-inner">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            
            {/* 用户图标 */}
            <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 shadow-inner">
              <UserCircleIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}