'use client';

/**
 * BreadcrumbNav 组件 - 项目详情页面的面包屑导航
 * 
 * 设计特点：
 * - 简洁的路径式面包屑设计（项目 > 项目名）
 * - 减少左侧视觉重量，平衡整体布局
 * - 项目名称下拉选择器支持展开/收起动画
 * - 响应式布局适配移动端
 */

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Project } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';

interface BreadcrumbNavProps {
  currentProject: Project;
  projects: Project[];
  currentTab: string;
}

export default function BreadcrumbNav({
  currentProject,
  projects,
  currentTab,
}: BreadcrumbNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤掉当前项目，限制显示 10 个
  const otherProjects = projects
    .filter((p) => p.id !== currentProject.id)
    .slice(0, 10);

  return (
    <div className="flex items-center gap-2">
      {/* 项目列表入口 - 简洁文字链接 */}
      <Link
        href="/dashboard/project"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        title={t('projectDetail.folderIconTitle')}
      >
        {t('dashboard.nav.project')}
      </Link>

      {/* 分隔符 - 细箭头 */}
      <ChevronRightIcon className="w-4 h-4 text-gray-400" />

      {/* 项目名称下拉选择器 */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-white shadow-sm border border-gray-100
            transition-all duration-300 ease-out
            hover:shadow-md hover:border-gray-200
            ${dropdownOpen ? 'shadow-md border-gray-200' : ''}
          `}
        >
          <span className="font-semibold text-gray-800 text-sm">
            {currentProject.name}
          </span>
          <ChevronDownIcon 
            className={`
              w-4 h-4 text-gray-500 transition-transform duration-300
              ${dropdownOpen ? 'rotate-180' : ''}
            `} 
          />
        </button>

        {/* 下拉菜单 */}
        <div
          className={`
            absolute left-0 top-full mt-2 z-50
            bg-white rounded-xl shadow-xl border border-gray-100
            min-w-[220px] py-1.5
            transition-all duration-200 ease-out origin-top-left
            ${dropdownOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }
          `}
        >
          {/* 当前项目（不可点击） */}
          <div className="px-3 py-1.5 border-b border-gray-100">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {t('projectDetail.dropdown.currentProject')}
            </span>
            <div className="font-medium text-gray-900 mt-1 truncate">
              {currentProject.name}
            </div>
          </div>

          {/* 其他项目列表 */}
          {otherProjects.length > 0 && (
            <div className="py-1">
              <span className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wider block">
                {t('projectDetail.dropdown.otherProjects')}
              </span>
              {otherProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/project/${project.id}?tab=${currentTab}`}
                  className="
                    block px-3 py-1.5 mx-1 rounded-lg
                    text-sm text-gray-700
                    transition-colors duration-200
                    hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50
                    hover:text-gray-900
                    truncate
                  "
                  onClick={() => setDropdownOpen(false)}
                >
                  {project.name}
                </Link>
              ))}
            </div>
          )}

          {/* 返回项目列表 */}
          <div className="border-t border-gray-100 mt-1 pt-1 px-1">
            <Link
              href="/dashboard/project"
              className="
                flex items-center gap-2 px-2.5 py-1.5 mx-1 rounded-lg
                text-sm text-pink-500 font-medium
                transition-all duration-200
                hover:bg-pink-50 hover:text-pink-600
              "
              onClick={() => setDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('projectDetail.dropdown.backToProjectList')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
