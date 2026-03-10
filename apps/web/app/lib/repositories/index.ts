/**
 * Repository 层统一导出
 * 
 * 本层提供技术栈无关的数据访问抽象
 */

// 接口定义
export * from './interfaces';

// PostgreSQL 实现
export * from './postgresql/base-postgres-repository';
export * from './postgresql/user-repository';
export * from './postgresql/project-repository';

// 工厂
export * from './factory';
