'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardIcon,
  ProjectIcon,
  DailiesIcon,
  HabitsIcon,
  RewardIcon,
  NotificationIcon,
  SettingsIcon,
  ArrowLeftIcon,
} from '@/app/ui/icons';

interface NavMenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navMenuItems: NavMenuItem[] = [
  { name: '概览', href: '/dashboard/overview', icon: <DashboardIcon className="w-5 h-5" /> },
  { name: '项目', href: '/dashboard/project', icon: <ProjectIcon className="w-5 h-5" /> },
  { name: '奖励', href: '/dashboard/rewards', icon: <RewardIcon className="w-5 h-5" /> },
  { name: '通知', href: '/dashboard/notifications', icon: <NotificationIcon className="w-5 h-5" /> },
  { name: '习惯', href: '/dashboard/habits', icon: <HabitsIcon className="w-5 h-5" /> },
  { name: '每日', href: '/dashboard/dailies', icon: <DailiesIcon className="w-5 h-5" /> },
  { name: '设置', href: '/dashboard/setting', icon: <SettingsIcon className="w-5 h-5" /> },
];

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="fixed bottom-4 right-32 z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          bg-amber-500 border-4 border-amber-700
          shadow-xl transition-all duration-300
          hover:bg-amber-400 hover:scale-110
          ${isOpen ? 'rotate-180' : ''}
        `}
        title="展开导航菜单"
      >
        <ArrowLeftIcon className="w-8 h-8 text-white" />
      </button>

      <div
        className={`
          absolute right-14 bottom-0
          bg-gray-800 border-2 border-gray-600 rounded-lg
          shadow-xl overflow-hidden
          transition-all duration-300 ease-out
          ${isOpen
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
          }
        `}
        style={{ minWidth: '140px', marginRight: '8px' }}
      >
        <div className="py-1">
          {navMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-white hover:bg-gray-700'
                  }
                `}
              >
                <span className={isActive ? 'text-gray-900' : 'text-amber-400'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
