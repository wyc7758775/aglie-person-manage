'use client';

import { useState, useEffect } from 'react';
import SectionContainer from '@/app/ui/dashboard/section-container';
import LanguageSwitcher from '@/app/ui/language-switcher';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon
} from '@/app/ui/icons';
import { useLanguage } from '@/app/lib/i18n';

interface SettingSection {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<any>;
  settings: Setting[];
}

interface Setting {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  type: 'toggle' | 'select' | 'input' | 'password' | 'language';
  value: any;
  options?: { labelKey: string; label: string; value: string }[];
}

const generateSettingSections = (t: (key: string) => string, locale: string): SettingSection[] => [
  {
    id: 'profile',
    titleKey: 'setting.profile.title',
    descriptionKey: 'setting.profile.description',
    icon: UserIcon,
    settings: [
      {
        id: 'username',
        labelKey: 'setting.profile.username',
        type: 'input',
        value: 'john_doe'
      },
      {
        id: 'email',
        labelKey: 'setting.profile.email',
        type: 'input',
        value: 'john.doe@example.com'
      },
      {
        id: 'language',
        labelKey: 'setting.profile.language',
        descriptionKey: 'setting.profile.languageDescription',
        type: 'language',
        value: locale
      },
      {
        id: 'timezone',
        labelKey: 'setting.profile.timezone',
        type: 'select',
        value: 'Asia/Shanghai',
        options: [
          { labelKey: 'common.time.beijing', label: t('common.time.beijing'), value: 'Asia/Shanghai' },
          { labelKey: 'common.time.tokyo', label: t('common.time.tokyo'), value: 'Asia/Tokyo' },
          { labelKey: 'common.time.newyork', label: t('common.time.newyork'), value: 'America/New_York' }
        ]
      }
    ]
  },
  {
    id: 'notifications',
    titleKey: 'setting.notifications.title',
    descriptionKey: 'setting.notifications.description',
    icon: BellIcon,
    settings: [
      {
        id: 'email_notifications',
        labelKey: 'setting.notifications.emailNotifications',
        descriptionKey: 'setting.notifications.emailNotificationsDescription',
        type: 'toggle',
        value: true
      },
      {
        id: 'push_notifications',
        labelKey: 'setting.notifications.pushNotifications',
        descriptionKey: 'setting.notifications.pushNotificationsDescription',
        type: 'toggle',
        value: false
      },
      {
        id: 'task_reminders',
        labelKey: 'setting.notifications.taskReminders',
        descriptionKey: 'setting.notifications.taskRemindersDescription',
        type: 'toggle',
        value: true
      },
      {
        id: 'daily_summary',
        labelKey: 'setting.notifications.dailySummary',
        descriptionKey: 'setting.notifications.dailySummaryDescription',
        type: 'toggle',
        value: false
      }
    ]
  },
  {
    id: 'appearance',
    titleKey: 'setting.appearance.title',
    descriptionKey: 'setting.appearance.description',
    icon: EyeIcon,
    settings: [
      {
        id: 'theme',
        labelKey: 'setting.appearance.theme',
        type: 'select',
        value: 'light',
        options: [
          { labelKey: 'setting.appearance.themeLight', label: t('setting.appearance.themeLight'), value: 'light' },
          { labelKey: 'setting.appearance.themeDark', label: t('setting.appearance.themeDark'), value: 'dark' },
          { labelKey: 'setting.appearance.themeSystem', label: t('setting.appearance.themeSystem'), value: 'system' }
        ]
      },
      {
        id: 'compact_mode',
        labelKey: 'setting.appearance.compactMode',
        descriptionKey: 'setting.appearance.compactModeDescription',
        type: 'toggle',
        value: false
      },
      {
        id: 'show_completed',
        labelKey: 'setting.appearance.showCompleted',
        descriptionKey: 'setting.appearance.showCompletedDescription',
        type: 'toggle',
        value: true
      }
    ]
  },
  {
    id: 'security',
    titleKey: 'setting.security.title',
    descriptionKey: 'setting.security.description',
    icon: ShieldCheckIcon,
    settings: [
      {
        id: 'current_password',
        labelKey: 'setting.security.currentPassword',
        type: 'password',
        value: ''
      },
      {
        id: 'new_password',
        labelKey: 'setting.security.newPassword',
        type: 'password',
        value: ''
      },
      {
        id: 'confirm_password',
        labelKey: 'setting.security.confirmPassword',
        type: 'password',
        value: ''
      },
      {
        id: 'two_factor',
        labelKey: 'setting.security.twoFactor',
        descriptionKey: 'setting.security.twoFactorDescription',
        type: 'toggle',
        value: false
      }
    ]
  }
];

function SettingItem({ setting, onUpdate, t }: { setting: Setting; onUpdate: (id: string, value: any) => void; t: (key: string) => string }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (value: any) => {
    onUpdate(setting.id, value);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-900">
          {t(setting.labelKey)}
        </label>
        {setting.descriptionKey && (
          <p className="text-sm text-gray-500 mt-1">{t(setting.descriptionKey)}</p>
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

        {setting.type === 'language' && (
          <LanguageSwitcher
            value={setting.value}
            onChange={handleChange}
          />
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

function SettingSectionCard({ section, onUpdate, t }: { section: SettingSection; onUpdate: (sectionId: string, settingId: string, value: any) => void; t: (key: string) => string }) {
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">{t(section.titleKey)}</h3>
          <p className="text-sm text-gray-500">{t(section.descriptionKey)}</p>
        </div>
      </div>

      <div className="space-y-0">
        {section.settings.map((setting) => (
          <SettingItem
            key={setting.id}
            setting={setting}
            onUpdate={(settingId, value) => onUpdate(section.id, settingId, value)}
            t={t}
          />
        ))}
      </div>

      {section.id === 'security' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <CheckIcon className="h-4 w-4 mr-2" />
            {t('setting.security.updatePassword')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { t, locale } = useLanguage();
  const [sections, setSections] = useState<SettingSection[]>([]);

  useEffect(() => {
    setSections(generateSettingSections(t, locale));
  }, [t, locale]);

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
      title={t('setting.title')}
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <SettingSectionCard
            key={section.id}
            section={section}
            onUpdate={handleSettingUpdate}
            t={t}
          />
        ))}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('setting.dataManagement.title')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('setting.dataManagement.description')}</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t('setting.dataManagement.export')}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                {t('setting.dataManagement.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
