/**
 * 玻璃拟态风格登录界面
 * 现代玻璃效果设计，营造轻盈通透的视觉体验
 */

"use client";

import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import AgButton from "@/app/ui/ag-button";

export default function Page() {
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
                <div className="text-sm text-gray-600">Cannabis Lab</div>
                <div className="text-sm text-gray-600">Sign up</div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Log in</h2>
              </div>

              <form className="space-y-4 mb-4">
                {/* 邮箱输入框 */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="e-mail address"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500"
                  />
                </div>

                {/* 密码输入框 */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="password"
                    className="w-full pl-10 pr-20 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-gray-800 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    I forgot
                  </button>
                </div>

                {/* 登录按钮 */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Keep out of reach of children and pets. Keep out of reach
                      of children and pets.
                    </p>
                  </div>
                  <AgButton
                    variant="primary"
                    size="md"
                    onClick={() => console.log('Login clicked')}
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    }
                  >
                    Login
                  </AgButton>
                </div>
              </form>

              {/* 底部文字 */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Keep out of reach of children and pets.
                </p>
              </div>
            </div>

            {/* New in 容器 - 移到左侧列 */}
            <div className="bg-gray-900 text-white rounded-3xl p-6 w-80 shadow-2xl flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">New in</h3>
                  <p className="text-gray-400 text-sm">C.Lab Joints</p>
                </div>
              </div>

              <div className="flex items-end justify-end">
                <button className="text-sm text-gray-300 hover:text-white transition-colors">
                  Discover
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
              {/* 左上角文字 */}
              <div className="absolute top-4 left-4 text-left">
                <div className="text-gray-600 text-xs font-medium">
                  Grand opening
                </div>
                <div className="text-gray-500 text-xs">New store</div>
              </div>

              {/* 主要内容 */}
              <div className="flex flex-col h-full">
                {/* 日期部分 */}
                <div className="mb-6 mt-8">
                  <div className="text-4xl font-bold text-gray-900 leading-none">
                    Thu
                  </div>
                  <div className="text-2xl font-light text-gray-400 mt-1">
                    24th
                  </div>
                </div>

                {/* 中间空间 */}
                <div className="flex-1"></div>

                {/* 底部信息 */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-gray-700 font-medium text-sm">
                      18 PM
                    </div>
                    <div className="text-gray-600 text-xs">Kerkstraat 12B</div>
                    <div className="text-gray-600 text-xs">Amsterdam</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-600">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      C.Lab
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
                onClick={() => console.log('Join in clicked')}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                }
              >
                Join in
              </AgButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
