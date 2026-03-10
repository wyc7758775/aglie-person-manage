/**
 * PostgreSQL Repository 基类
 * 提供通用的 CRUD 实现
 */

import postgres from 'postgres';
import { Repository, FilterOptions, PaginatedResult } from '../interfaces/base-repository';

export interface PostgresConfig {
  url: string;
  ssl?: boolean | 'require' | 'allow' | 'prefer';
}

/**
 * PostgreSQL Repository 抽象基类
 */
export abstract class PostgresRepository<T extends { id: ID }, ID> implements Repository<T, ID> {
  protected sql: ReturnType<typeof postgres>;

  constructor(
    sql: ReturnType<typeof postgres>,
    protected tableName: string,
    protected idColumn: string = 'id'
  ) {
    this.sql = sql;
  }

  /**
   * 将数据库行映射为领域实体
   */
  protected abstract mapToEntity(row: Record<string, unknown>): T;

  /**
   * 将领域实体映射为数据库行
   */
  protected abstract mapToRow(entity: Partial<T>): Record<string, unknown>;

  /**
   * 生成新的实体ID
   */
  protected abstract generateId(): ID;

  async findById(id: ID): Promise<T | null> {
    const rows = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.idColumn)} = ${id}
      LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return this.mapToEntity(rows[0] as Record<string, unknown>);
  }

  async findAll(filters?: FilterOptions<T>): Promise<T[]> {
    let query = this.sql`SELECT * FROM ${this.sql(this.tableName)}`;
    
    // 构建 WHERE 条件
    if (filters?.where) {
      const conditions: ReturnType<typeof this.sql>[] = [];
      for (const [key, value] of Object.entries(filters.where)) {
        if (value !== undefined && value !== null) {
          conditions.push(this.sql`${this.sql(key)} = ${value}`);
        }
      }
      if (conditions.length > 0) {
        query = this.sql`${query} WHERE ${conditions.reduce((a, b) => this.sql`${a} AND ${b}`)}`;
      }
    }

    // 构建 ORDER BY
    if (filters?.orderBy && filters.orderBy.length > 0) {
      const orderClauses = filters.orderBy.map(o => 
        `${String(o.field)} ${o.direction.toUpperCase()}`
      );
      query = this.sql`${query} ORDER BY ${this.sql(orderClauses.join(', '))}`;
    }

    // 构建分页
    if (filters?.take !== undefined) {
      query = this.sql`${query} LIMIT ${filters.take}`;
    }
    if (filters?.skip !== undefined) {
      query = this.sql`${query} OFFSET ${filters.skip}`;
    }

    const rows = await query;
    return rows.map(row => this.mapToEntity(row as Record<string, unknown>));
  }

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = this.generateId();
    const row = this.mapToRow({ ...entity, id } as Partial<T>);
    
    const columns = Object.keys(row);
    const values = Object.values(row);
    
    const result = await this.sql`
      INSERT INTO ${this.sql(this.tableName)} (
        ${columns.map(c => this.sql(c))}
      ) VALUES (
        ${values}
      )
      RETURNING *
    `;

    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async update(id: ID, updates: Partial<T>): Promise<T | null> {
    const row = this.mapToRow(updates);
    const entries = Object.entries(row).filter(([_, v]) => v !== undefined);
    
    if (entries.length === 0) {
      return this.findById(id);
    }

    const setClauses = entries.map(([key, _]) => `${key} = EXCLUDED.${key}`);
    
    const result = await this.sql`
      UPDATE ${this.sql(this.tableName)}
      SET ${this.sql(entries.map(([k]) => k).join(', '))} = ${entries.map(([_, v]) => v)}
      WHERE ${this.sql(this.idColumn)} = ${id}
      RETURNING *
    `;

    if (result.length === 0) return null;
    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async delete(id: ID): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.idColumn)} = ${id}
      RETURNING ${this.sql(this.idColumn)}
    `;
    
    return result.length > 0;
  }

  async exists(id: ID): Promise<boolean> {
    const result = await this.sql`
      SELECT 1 FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.idColumn)} = ${id}
      LIMIT 1
    `;
    
    return result.length > 0;
  }

  /**
   * 执行原始查询
   */
  protected async query<R>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<R[]> {
    return this.sql(strings, ...values) as Promise<R[]>;
  }

  /**
   * 事务执行
   */
  async withTransaction<R>(callback: (sql: typeof this.sql) => Promise<R>): Promise<R> {
    return this.sql.begin(async sql => {
      const repo = new (this.constructor as any)(sql, this.tableName, this.idColumn);
      return callback(sql);
    });
  }
}

/**
 * 生成 UUID
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * 生成自定义ID（如 TASK-xxx, REQ-xxx）
 */
export function generateCustomId(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
