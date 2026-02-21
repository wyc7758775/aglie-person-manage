'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Project, ProjectStatus, ProjectType, ProjectPriority } from './definitions';

interface UseProjectsFilters {
  status?: ProjectStatus;
  type?: ProjectType;
  priority?: ProjectPriority;
}

interface ProjectsResponse {
  success: boolean;
  projects: Project[];
  message?: string;
}

// 简单的缓存存储
const cache = new Map<string, ProjectsResponse>();

export function useProjects(filters: UseProjectsFilters = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 构建缓存键
  const cacheKey = `/api/projects?${new URLSearchParams({
    ...(filters.status && { status: filters.status }),
    ...(filters.type && { type: filters.type }),
    ...(filters.priority && { priority: filters.priority }),
  }).toString()}`;

  // 获取数据
  const fetchProjects = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsValidating(true);
    }
    setError(null);

    try {
      const response = await fetch(cacheKey);
      const data: ProjectsResponse = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
        // 更新缓存
        cache.set(cacheKey, data);
      } else {
        throw new Error(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // 如果有缓存数据，使用缓存
      const cached = cache.get(cacheKey);
      if (cached?.success) {
        setProjects(cached.projects);
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [cacheKey]);

  // 初始加载
  useEffect(() => {
    // 首先尝试从缓存加载
    const cached = cache.get(cacheKey);
    if (cached?.success) {
      setProjects(cached.projects);
      setIsLoading(false);
      // 后台静默刷新
      fetchProjects(false);
    } else {
      fetchProjects(true);
    }
  }, [cacheKey, fetchProjects]);

  // 窗口聚焦时重新验证
  useEffect(() => {
    const handleFocus = () => {
      fetchProjects(false);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchProjects]);

  // 刷新函数
  const refresh = useCallback(() => {
    cache.delete(cacheKey);
    return fetchProjects(true);
  }, [cacheKey, fetchProjects]);

  // 乐观更新函数
  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    // 更新缓存
    const cached = cache.get(cacheKey);
    if (cached?.success) {
      cache.set(cacheKey, {
        ...cached,
        projects: cached.projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        )
      });
    }
  }, [cacheKey]);

  const addProject = useCallback((newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
    // 更新缓存
    const cached = cache.get(cacheKey);
    if (cached?.success) {
      cache.set(cacheKey, {
        ...cached,
        projects: [...cached.projects, newProject]
      });
    }
  }, [cacheKey]);

  const removeProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // 更新缓存
    const cached = cache.get(cacheKey);
    if (cached?.success) {
      cache.set(cacheKey, {
        ...cached,
        projects: cached.projects.filter(p => p.id !== projectId)
      });
    }
  }, [cacheKey]);

  return {
    projects,
    isLoading,
    isValidating,
    error,
    refresh,
    updateProject,
    addProject,
    removeProject,
  };
}

export default useProjects;
