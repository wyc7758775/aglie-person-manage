'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronDownIcon } from '@/app/ui/icons';
import { Project, ProjectType } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';

interface ProjectHeaderProps {
  currentProject: Project | null;
  projects: Project[];
  activeTab: 'requirement' | 'task' | 'defect';
  onTabChange: (tab: 'requirement' | 'task' | 'defect') => void;
  showDefectTab: boolean;
}

function ProjectTypeIcon({ type }: { type: ProjectType }) {
  return <span>{type === 'sprint-project' ? '⚡' : '🌱'}</span>;
}

function BreadcrumbNav({ 
  currentProject, 
  projects = [], 
  currentTab = 'requirement' 
}: { 
  currentProject: Project | null; 
  projects?: Project[]; 
  currentTab?: string;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useLanguage();

  const otherProjects = currentProject
    ? projects.filter((p) => p.id !== currentProject.id).slice(0, 10)
    : projects.slice(0, 10);

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard/project"
        className="text-sm transition-colors"
        style={{ color: 'rgba(26, 29, 46, 0.5)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(26, 29, 46, 0.8)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(26, 29, 46, 0.5)')}
      >
        {t('dashboard.nav.project')}
      </Link>

      <ChevronRightIcon className="w-4 h-4" style={{ color: 'rgba(26, 29, 46, 0.3)' }} />

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
          style={{ 
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(26, 29, 46, 0.08)',
          }}
        >
          {currentProject && (
            <ProjectTypeIcon type={currentProject.type} />
          )}
          <span className="font-semibold text-sm" style={{ color: '#1A1D2E' }}>
            {currentProject?.name || '...'}
          </span>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
            style={{ color: 'rgba(26, 29, 46, 0.5)' }}
          />
        </button>

        {dropdownOpen && (
          <div
            className="absolute left-0 top-full mt-2 z-50 rounded-xl py-1.5 min-w-[240px]"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(26, 29, 46, 0.15)',
            }}
          >
            {currentProject && (
              <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(26, 29, 46, 0.06)' }}>
                <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>
                  {t('projectDetail.dropdown.currentProject')}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <ProjectTypeIcon type={currentProject.type} />
                  <span className="font-medium text-sm truncate" style={{ color: '#1A1D2E' }}>
                    {currentProject.name}
                  </span>
                </div>
              </div>
            )}

            {otherProjects.length > 0 && (
              <div className="py-1">
                <span className="px-3 py-1 text-xs uppercase tracking-wider block" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>
                  {t('projectDetail.dropdown.otherProjects')}
                </span>
                {otherProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/project/${project.id}?tab=${currentTab}`}
                    className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg text-sm transition-colors"
                    style={{ color: 'rgba(26, 29, 46, 0.7)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(26, 29, 46, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ProjectTypeIcon type={project.type} />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-1 pt-1 px-1 border-t" style={{ borderColor: 'rgba(26, 29, 46, 0.06)' }}>
              <Link
                href="/dashboard/project"
                className="flex items-center gap-2 px-2.5 py-1.5 mx-1 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#E8944A' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 148, 74, 0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => setDropdownOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('projectDetail.dropdown.backToProjectList')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabMenu({ 
  activeTab = 'requirement', 
  onTabChange,
  showDefectTab = false
}: { 
  activeTab?: 'requirement' | 'task' | 'defect';
  onTabChange?: (tab: 'requirement' | 'task' | 'defect') => void;
  showDefectTab?: boolean;
}) {
  const { t } = useLanguage();
  const tabs = [
    { key: 'requirement' as const, label: t('dashboard.nav.requirement') },
    { key: 'task' as const, label: t('dashboard.nav.task') },
    ...(showDefectTab ? [{ key: 'defect' as const, label: t('dashboard.nav.defect') }] : []),
  ];

  return (
    <div 
      className="relative inline-flex items-center p-1 rounded-full"
      style={{ 
        backgroundColor: 'rgba(26, 29, 46, 0.04)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange?.(tab.key)}
            className="relative z-10 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300"
            style={{
              color: isActive ? 'white' : 'rgba(26, 29, 46, 0.6)',
              backgroundColor: isActive ? '#E8944A' : 'transparent',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectHeader({
  currentProject,
  projects,
  activeTab,
  onTabChange,
  showDefectTab,
}: ProjectHeaderProps) {
  return (
    <div 
      className="flex items-center justify-between px-6 py-4 flex-shrink-0 rounded-t-2xl"
      style={{ 
        borderBottom: '1px solid rgba(26, 29, 46, 0.06)',
        backgroundColor: 'white',
      }}
    >
      <div className="flex-1">
        <BreadcrumbNav 
          currentProject={currentProject} 
          projects={projects} 
          currentTab={activeTab}
        />
      </div>

      <TabMenu 
        activeTab={activeTab}
        onTabChange={onTabChange}
        showDefectTab={showDefectTab}
      />
    </div>
  );
}
