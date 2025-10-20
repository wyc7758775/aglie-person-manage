import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import Image from "next/image";
import CatAnimation from "@/app/ui/cat-animation";

/**
 * 首页组件 - 酷炫登录界面
 * 使用现代设计风格，包含动画效果和响应式布局
 */
export default function Page() {
  return (
    <main className="w-full min-h-screen bg-black overflow-hidden relative">
      {/* 背景动画效果 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-black opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
        </div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 z-0 opacity-20 bg-grid-pattern"></div>
      
      {/* 小猫咪动画 */}
       <CatAnimation />

      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen p-4">
        {/* Logo和标题 */}
        <div className="flex items-center mb-8 animate-fade-in-down">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-glow">
            <AcmeLogo />
          </div>
          <h1 className="ml-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            敏捷个人管理系统
          </h1>
        </div>

        {/* 主卡片 */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
          {/* 登录卡片 */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-glow border border-white/20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">登录您的账户</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">用户名</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="输入您的用户名"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">密码</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="输入您的密码"
                />
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-4 text-sm font-medium text-white transition-all hover:from-cyan-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span className="text-base">立即登录</span> <ArrowRightIcon className="w-5" />
            </Link>
            
            <div className="mt-6 flex items-center justify-between">
              <button className="text-sm text-gray-400 hover:text-white transition-colors">忘记密码?</button>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">注册账户</button>
            </div>
          </div>
          
          {/* 特性展示 */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 特性卡片 1 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">习惯养成</h3>
              <p className="text-gray-300">
                通过视觉化追踪和智能提醒，帮助你培养良好习惯，改变生活方式。
              </p>
            </div>
            
            {/* 特性卡片 2 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">日常任务</h3>
              <p className="text-gray-300">
                每日任务清单和智能提醒，帮助你保持规律生活，提高完成率。
              </p>
            </div>
            
            {/* 特性卡片 3 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">待办管理</h3>
              <p className="text-gray-300">
                高效的待办事项管理系统，帮助你分类整理任务，提高工作效率。
              </p>
            </div>
            
            {/* 特性卡片 4 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">数据分析</h3>
              <p className="text-gray-300">
                直观的数据分析和报告，帮助你了解自己的进步和成长轨迹。
              </p>
            </div>
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className="mt-12 text-center text-gray-400 text-sm animate-fade-in-up">
          <p>© 2023 敏捷个人管理系统 | 隐私政策 | 使用条款</p>
        </div>
      </div>
    </main>
  );
}
