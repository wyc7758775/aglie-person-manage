import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { User, UserRole, Project, ProjectCreateRequest, ProjectUpdateRequest, ProjectStatus, ProjectType, ProjectPriority } from './definitions';

const postgresUrl = process.env.POSTGRES_URL ?? '';
// 占位符检测：常见示例连接串会导致 Postgres 报 "user \"username\"" 等错误，此处提前给出明确提示
if (postgresUrl && /username\s*:/i.test(postgresUrl)) {
  throw new Error(
    'POSTGRES_URL 仍为占位符。请在项目根目录 .env 中改为实际连接串，例如：\n' +
    'POSTGRES_URL=postgresql://agile_user:agile_password@localhost:5432/agile_person_manage\n' +
    '（需与 docker-compose.yml 中 postgres 服务的用户名、密码、数据库名一致）。修改后请重启 pnpm dev。'
  );
}

// 创建数据库连接（无 POSTGRES_URL 时由调用方使用 db-memory，此处仅在有 URL 时使用）
const sql = postgres(postgresUrl || 'postgres://localhost', { ssl: process.env.NODE_ENV === 'production' ? 'require' : false });

/**
 * 初始化数据库表结构（users 含 role，projects 含 user_id）
 */
export async function initializeDatabase() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nickname VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'role') THEN
          ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
        END IF;
      END $$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'normal',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        goals JSONB DEFAULT '[]',
        tags JSONB DEFAULT '[]',
        start_date DATE NOT NULL,
        end_date DATE,
        progress INT NOT NULL DEFAULT 0,
        points INT NOT NULL DEFAULT 0,
        cover_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('数据库表结构初始化完成');
    return { success: true };
  } catch (error) {
    const err = error as { code?: string; errors?: Array<{ code?: string }> };
    if (err?.code === 'ECONNREFUSED' || err?.errors?.[0]?.code === 'ECONNREFUSED') {
      console.warn('数据库连接失败 (PostgreSQL 未启动或不可达)，可移除 .env 中 POSTGRES_URL 或启动 Docker 使用内存模式');
    } else {
      console.error('数据库初始化失败:', error);
    }
    throw error;
  }
}

/**
 * 根据昵称查找用户（含 role）
 */
export async function findUserByNickname(nickname: string): Promise<(User & { role: UserRole }) | null> {
  try {
    const result = await sql`
      SELECT id, nickname, password, role
      FROM users
      WHERE nickname = ${nickname}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: String(row.id),
      nickname: row.nickname,
      password: row.password,
      role: (row.role as UserRole) || 'user',
    };
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 根据ID查找用户（含 role）
 */
export async function findUserById(id: string): Promise<(User & { role: UserRole }) | null> {
  try {
    const result = await sql`
      SELECT id, nickname, password, role
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    const row = result[0];
    return {
      id: String(row.id),
      nickname: row.nickname,
      password: row.password,
      role: (row.role as UserRole) || 'user',
    };
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 创建新用户（支持 role，默认 user）
 */
export async function createUser(nickname: string, password: string, role?: UserRole): Promise<User & { role: UserRole }> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleVal = role || 'user';
    const result = await sql`
      INSERT INTO users (nickname, password, role)
      VALUES (${nickname}, ${hashedPassword}, ${roleVal})
      RETURNING id, nickname, password, role
    `;
    const row = result[0];
    return {
      id: String(row.id),
      nickname: row.nickname,
      password: row.password,
      role: (row.role as UserRole) || 'user',
    };
  } catch (error) {
    console.error('创建用户失败:', error);
    if (error instanceof Error && (error.message?.includes('duplicate key') || error.message?.includes('已存在'))) {
      throw new Error('用户昵称已存在');
    }
    throw error;
  }
}

/**
 * 验证用户密码
 */
export async function verifyUserPassword(user: User, password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('密码验证失败:', error);
    return false;
  }
}

/**
 * 获取安全的用户信息（含 isAdmin）
 */
export function getSafeUserInfo(user: User & { role?: UserRole }) {
  return {
    id: user.id,
    nickname: user.nickname,
    isAdmin: user.role === 'superadmin',
  };
}

// ---------- 项目 CRUD（按 user_id 维度） ----------

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ''),
    type: (row.type as ProjectType) || 'life',
    status: (row.status as ProjectStatus) || 'normal',
    priority: (row.priority as ProjectPriority) || 'medium',
    goals: Array.isArray(row.goals) ? (row.goals as string[]) : [],
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    startDate: row.start_date != null ? String(row.start_date) : '',
    endDate: row.end_date != null ? String(row.end_date) : null,
    progress: Number(row.progress) || 0,
    points: Number(row.points) || 0,
    coverImageUrl: row.cover_image_url != null ? String(row.cover_image_url) : undefined,
    createdAt: row.created_at != null ? new Date(row.created_at as string).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at != null ? new Date(row.updated_at as string).toISOString() : new Date().toISOString(),
  };
}

export async function getProjects(
  userId: string,
  filters?: { status?: ProjectStatus; type?: ProjectType; priority?: ProjectPriority }
): Promise<Project[]> {
  try {
    const result = await sql`SELECT * FROM projects WHERE user_id = ${userId}`;
    let list = result as unknown as Record<string, unknown>[];
    if (filters?.status) list = list.filter((r) => r.status === filters.status);
    if (filters?.type) list = list.filter((r) => r.type === filters.type);
    if (filters?.priority) list = list.filter((r) => r.priority === filters.priority);
    return list.map(rowToProject);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    throw error;
  }
}

export async function getProjectById(id: string, userId: string): Promise<Project | null> {
  try {
    const result = await sql`
      SELECT * FROM projects WHERE id = ${id} AND user_id = ${userId} LIMIT 1
    `;
    if (result.length === 0) return null;
    return rowToProject(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    throw error;
  }
}

export async function createProject(data: ProjectCreateRequest, userId: string): Promise<Project> {
  try {
    const result = await sql`
      INSERT INTO projects (user_id, name, description, type, status, priority, goals, tags, start_date, end_date, progress, points, cover_image_url)
      VALUES (
        ${userId},
        ${data.name},
        ${data.description ?? ''},
        ${data.type},
        ${data.status ?? 'normal'},
        ${data.priority ?? 'medium'},
        ${JSON.stringify(data.goals ?? [])},
        ${JSON.stringify(data.tags ?? [])},
        ${data.startDate},
        ${data.endDate ?? null},
        0,
        ${data.points ?? 0},
        ${data.coverImageUrl ?? null}
      )
      RETURNING *
    `;
    return rowToProject(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('创建项目失败:', error);
    throw error;
  }
}

export async function updateProject(id: string, data: ProjectUpdateRequest, userId: string): Promise<Project | null> {
  try {
    const existing = await sql`SELECT * FROM projects WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
    if (existing.length === 0) return null;
    const row = existing[0] as unknown as Record<string, unknown>;
    const name = String(data.name ?? row.name);
    const description = data.description !== undefined ? String(data.description) : String(row.description ?? '');
    const type = String(data.type ?? row.type);
    const status = String(data.status ?? row.status);
    const priority = String(data.priority ?? row.priority);
    const goalsJson = JSON.stringify(data.goals ?? (row.goals as string[]) ?? []);
    const tagsJson = JSON.stringify(data.tags ?? (row.tags as string[]) ?? []);
    const startDate = String(data.startDate ?? row.start_date ?? '');
    const endDateVal = data.endDate !== undefined ? data.endDate : row.end_date;
    const endDate = endDateVal != null ? String(endDateVal) : null;
    const progress = Number(data.progress ?? row.progress ?? 0);
    const points = Number(data.points ?? row.points ?? 0);
    const coverImageUrl: string | null = data.coverImageUrl !== undefined
      ? (data.coverImageUrl ?? null)
      : (row.cover_image_url != null ? String(row.cover_image_url) : null);
    const result = await sql`
      UPDATE projects SET
        name = ${name},
        description = ${description},
        type = ${type},
        status = ${status},
        priority = ${priority},
        goals = ${goalsJson},
        tags = ${tagsJson},
        start_date = ${startDate},
        end_date = ${endDate},
        progress = ${progress},
        points = ${points},
        cover_image_url = ${coverImageUrl},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;
    return result.length === 0 ? null : rowToProject(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('更新项目失败:', error);
    throw error;
  }
}

export async function deleteProject(id: string, userId: string): Promise<boolean> {
  try {
    const result = await sql`DELETE FROM projects WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('删除项目失败:', error);
    throw error;
  }
}

/**
 * 检查数据库连接
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}

/**
 * 关闭数据库连接
 */
export async function closeDatabaseConnection() {
  try {
    await sql.end();
  } catch (error) {
    console.error('关闭数据库连接失败:', error);
  }
}