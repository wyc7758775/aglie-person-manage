'use client';

import { useState } from 'react';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  settings: Setting[];
}

interface Setting {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'password';
  value: any;
  options?: { label: string; value: string }[];
}

const generateSettingSections = (): SettingSection[] => [
  {
    id: 'profile',
    title: '个人资料',
    description: '管理您的个人信息和偏好设置',
    icon: UserIcon,
    settings: [
      {
        id: 'username',
        label: '用户名',
        type: 'input',
        value: 'john_doe'
      },
      {
        id: 'email',
        label: '邮箱地址',
        type: 'input',
        value: 'john.doe@example.com'
      },
      {
        id: 'language',
        label: '语言',
        description: '选择界面显示语言',
        type: 'select',
        value: 'zh-CN',
        options: [
          { label: '中文', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
          { label: '日本語', value: 'ja-JP' }
        ]
      },
      {
        id: 'timezone',
        label: '时区',
        type: 'select',
        value: 'Asia/Shanghai',
        options: [
          { label: '北京时间 (UTC+8)', value: 'Asia/Shanghai' },
          { label: '东京时间 (UTC+9)', value: 'Asia/Tokyo' },
          { label: '纽约时间 (UTC-5)', value: 'America/New_York' }
        ]
      }
    ]
  },
  {
    id: 'notifications',
    title: '通知设置',
    description: '管理您的通知偏好',
    icon: BellIcon,
    settings: [
      {
        id: 'email_notifications',
        label: '邮件通知',
        description: '接收重要更新的邮件通知',
        type: 'toggle',
        value: true
      },
      {
        id: 'push_notifications',
        label: '推送通知',
        description: '接收浏览器推送通知',
        type: 'toggle',
        value: false
      },
      {
        id: 'task_reminders',
        label: '任务提醒',
        description: '任务截止日期前的提醒',
        type: 'toggle',
        value: true
      },
      {
        id: 'daily_summary',
        label: '每日总结',
        description: '每天发送工作总结邮件',
        type: 'toggle',
        value: false
      }
    ]
  },
  {
    id: 'appearance',
    title: '外观设置',
    description: '自定义界面外观',
    icon: EyeIcon,
    settings: [
      {
        id: 'theme',
        label: '主题',
        type: 'select',
        value: 'light',
        options: [
          { label: '浅色主题', value: 'light' },
          { label: '深色主题', value: 'dark' },
          { label: '跟随系统', value: 'system' }
        ]
      },
      {
        id: 'compact_mode',
        label: '紧凑模式',
        description: '使用更紧凑的界面布局',
        type: 'toggle',
        value: false
      },
      {
        id: 'show_completed',
        label: '显示已完成项目',
        description: '在列表中显示已完成的项目',
        type: 'toggle',
        value: true
      }
    ]
  },
  {
    id: 'security',
    title: '安全设置',
    description: '管理您的账户安全',
    icon: ShieldCheckIcon,
    settings: [
      {
        id: 'current_password',
        label: '当前密码',
        type: 'password',
        value: ''
      },
      {
        id: 'new_password',
        label: '新密码',
        type: 'password',
        value: ''
      },
      {
        id: 'confirm_password',
        label: '确认新密码',
        type: 'password',
        value: ''
      },
      {
        id: 'two_factor',
        label: '双因素认证',
        description: '启用双因素认证以提高账户安全性',
        type: 'toggle',
        value: false
      }
    ]
  }
];

function SettingItem({ setting, onUpdate }: { setting: Setting; onUpdate: (id: string, value: any) => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (value: any) => {
    onUpdate(setting.id, value);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-900">
          {setting.label}
        </label>
        {setting.description && (
          <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
        )}
      </div>
      
      <div className="ml-4">
        {setting.type === 'toggle' && (
          <button
            onClick={() => handleChange(!setting.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              setting.value ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                setting.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )}
        
        {setting.type === 'select' && (
          <select
            value={setting.value}
            onChange={(e) => handleChange(e.target.value)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        
        {setting.type === 'input' && (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleChange(e.target.value)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        )}
        
        {setting.type === 'password' && (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={setting.value}
              onChange={(e) => handleChange(e.target.value)}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingSectionCard({ section, onUpdate }: { section: SettingSection; onUpdate: (sectionId: string, settingId: string, value: any) => void }) {
  const Icon = section.icon;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
          <p className="text-sm text-gray-500">{section.description}</p>
        </div>
      </div>
      
      <div className="space-y-0">
        {section.settings.map((setting) => (
          <SettingItem
            key={setting.id}
            setting={setting}
            onUpdate={(settingId, value) => onUpdate(section.id, settingId, value)}
          />
        ))}
      </div>
      
      {section.id === 'security' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <CheckIcon className="h-4 w-4 mr-2" />
            更新密码
          </button>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [sections, setSections] = useState<SettingSection[]>(generateSettingSections());

  const handleSettingUpdate = (sectionId: string, settingId: string, value: any) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map(setting =>
                setting.id === settingId ? { ...setting, value } : setting
              )
            }
          : section
      )
    );
  };

  return (
    <SectionContainer
      title="设置"
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <SettingSectionCard
            key={section.id}
            section={section}
            onUpdate={handleSettingUpdate}
          />
        ))}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">数据管理</h3>
              <p className="text-sm text-gray-500 mt-1">导出或删除您的数据</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                导出数据
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                删除账户
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
