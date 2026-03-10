/**
 * Repository Pattern - 数据访问抽象层
 * 
 * 本层提供技术栈无关的数据访问接口，将业务逻辑与具体存储技术解耦。
 * 任何存储实现（PostgreSQL、MySQL、MongoDB、内存）都可接入此接口。
 * 
 * @module repositories/interfaces
 */

/**
 * 基础 Repository 接口
 * 定义所有实体的通用 CRUD 操作
 */
export interface Repository<T, ID> {
  /**
   * 根据ID查找实体
   * @param id 实体标识
   * @returns 找到的实体，不存在则返回 null
   */
  findById(id: ID): Promise<T | null>;

  /**
   * 查找所有实体
   * @param filters 可选的过滤条件
   * @returns 实体列表
   */
  findAll(filters?: FilterOptions<T>): Promise<T[]>;

  /**
   * 创建新实体
   * @param entity 不包含ID的实体数据
   * @returns 创建后的完整实体（包含生成的ID）
   */
  create(entity: Omit<T, 'id'>): Promise<T>;

  /**
   * 更新实体
   * @param id 实体标识
   * @param updates 部分更新数据
   * @returns 更新后的实体，不存在则返回 null
   */
  update(id: ID, updates: Partial<T>): Promise<T | null>;

  /**
   * 删除实体
   * @param id 实体标识
   * @returns 是否成功删除
   */
  delete(id: ID): Promise<boolean>;

  /**
   * 检查实体是否存在
   * @param id 实体标识
   * @returns 是否存在
   */
  exists(id: ID): Promise<boolean>;
}

/**
 * 过滤选项
 */
export interface FilterOptions<T> {
  /** 等值过滤条件 */
  where?: Partial<T>;
  /** 排序配置 */
  orderBy?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  }[];
  /** 分页 - 跳过的记录数 */
  skip?: number;
  /** 分页 - 返回的记录数 */
  take?: number;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  /** 数据列表 */
  data: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页大小 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 事务上下文
 * 用于需要原子性操作的场景
 */
export interface TransactionContext {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * 支持事务的 Repository
 */
export interface TransactionalRepository<T, ID> extends Repository<T, ID> {
  /**
   * 在事务上下文中执行操作
   * @param callback 事务回调
   */
  withTransaction<R>(callback: (context: TransactionContext) => Promise<R>): Promise<R>;
}

/**
 * 领域事件
 * 用于Repository触发业务事件
 */
export interface DomainEvent {
  type: string;
  payload: unknown;
  timestamp: Date;
}

/**
 * 事件发布者接口
 */
export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

/**
 * Repository 工厂接口
 * 用于获取具体 Repository 实例
 */
export interface RepositoryFactory {
  getUserRepository(): Repository<unknown, unknown>;
  getProjectRepository(): Repository<unknown, unknown>;
  getTaskRepository(): Repository<unknown, unknown>;
  getRequirementRepository(): Repository<unknown, unknown>;
  getDefectRepository(): Repository<unknown, unknown>;
  getTodoRepository(): Repository<unknown, unknown>;
}
