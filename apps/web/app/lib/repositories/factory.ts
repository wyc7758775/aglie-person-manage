/**
 * Repository 工厂
 * 集中管理所有 Repository 实例
 * 
 * 使用工厂模式便于：
 * 1. 统一管理 Repository 实例
 * 2. 支持依赖注入和测试 mock
 * 3. 未来支持更换存储实现（如从 PostgreSQL 切换到 MongoDB）
 */

import {
  RepositoryFactory,
  UserRepository,
  ProjectRepository,
  TaskRepository,
  RequirementRepository,
  DefectRepository,
  TodoRepository,
} from './interfaces';

import { PostgresUserRepository, userRepository } from './postgresql/user-repository';
import { PostgresProjectRepository, projectRepository } from './postgresql/project-repository';

/**
 * PostgreSQL Repository 工厂实现
 */
export class PostgresRepositoryFactory implements RepositoryFactory {
  private static instance: PostgresRepositoryFactory;

  static getInstance(): PostgresRepositoryFactory {
    if (!PostgresRepositoryFactory.instance) {
      PostgresRepositoryFactory.instance = new PostgresRepositoryFactory();
    }
    return PostgresRepositoryFactory.instance;
  }

  getUserRepository(): UserRepository {
    return userRepository;
  }

  getProjectRepository(): ProjectRepository {
    return projectRepository;
  }

  getTaskRepository(): TaskRepository {
    // TODO: 实现 TaskRepository
    throw new Error('TaskRepository not implemented yet');
  }

  getRequirementRepository(): RequirementRepository {
    // TODO: 实现 RequirementRepository
    throw new Error('RequirementRepository not implemented yet');
  }

  getDefectRepository(): DefectRepository {
    // TODO: 实现 DefectRepository
    throw new Error('DefectRepository not implemented yet');
  }

  getTodoRepository(): TodoRepository {
    // TODO: 实现 TodoRepository
    throw new Error('TodoRepository not implemented yet');
  }
}

/**
 * 获取 Repository 工厂的便捷函数
 */
export function getRepositoryFactory(): RepositoryFactory {
  return PostgresRepositoryFactory.getInstance();
}

/**
 * 便捷的 Repository 访问函数
 */
export function getUserRepository(): UserRepository {
  return getRepositoryFactory().getUserRepository();
}

export function getProjectRepository(): ProjectRepository {
  return getRepositoryFactory().getProjectRepository();
}

export function getTaskRepository(): TaskRepository {
  return getRepositoryFactory().getTaskRepository();
}

export function getRequirementRepository(): RequirementRepository {
  return getRepositoryFactory().getRequirementRepository();
}

export function getDefectRepository(): DefectRepository {
  return getRepositoryFactory().getDefectRepository();
}

export function getTodoRepository(): TodoRepository {
  return getRepositoryFactory().getTodoRepository();
}
