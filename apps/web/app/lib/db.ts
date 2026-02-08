import postgres from 'postgres';
import bcrypt from 'bcrypt';
import {
  User,
  UserRole,
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectStatus,
  ProjectType,
  ProjectPriority,
  Task,
  TaskStatus,
  TaskPriority,
  TaskCreateRequest,
  TaskUpdateRequest,
  Requirement,
  RequirementStatus,
  RequirementPriority,
  RequirementType,
  RequirementCreateRequest,
  RequirementUpdateRequest,
  Defect,
  DefectStatus,
  DefectSeverity,
  DefectType,
  DefectCreateRequest,
  DefectUpdateRequest,
} from './definitions';

let _sql: ReturnType<typeof postgres> | null = null;

function getSql(): ReturnType<typeof postgres> {
  if (_sql) return _sql;
  const postgresUrl = process.env.POSTGRES_URL ?? '';
  if (!postgresUrl || !postgresUrl.trim()) {
    throw new Error(
      '未配置 POSTGRES_URL。请在 .env 中设置数据库连接串，例如：\n' +
        'POSTGRES_URL=postgresql://agile_user:agile_password@localhost:5432/agile_person_manage'
    );
  }
  if (/username\s*:/i.test(postgresUrl)) {
    throw new Error(
      'POSTGRES_URL 仍为占位符。请在项目根目录 .env 中改为实际连接串，例如：\n' +
        'POSTGRES_URL=postgresql://agile_user:agile_password@localhost:5432/agile_person_manage'
    );
  }
  _sql = postgres(postgresUrl, { ssl: process.env.NODE_ENV === 'production' ? 'require' : false });
  return _sql;
}

/**
 * 初始化数据库表结构（users 含 role，projects 含 user_id）
 */
export async function initializeDatabase() {
  try {
    await getSql()`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await getSql()`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nickname VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await getSql()`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'role') THEN
          ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
        END IF;
      END $$;
    `;
    await getSql()`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'total_points') THEN
          ALTER TABLE users ADD COLUMN total_points INT NOT NULL DEFAULT 0;
        END IF;
      END $$;
    `;

    await getSql()`
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

    await getSql()`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR(50) NOT NULL DEFAULT 'todo',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        assignee VARCHAR(255) DEFAULT '',
        due_date DATE NOT NULL,
        estimated_hours INT NOT NULL DEFAULT 0,
        completed_hours INT NOT NULL DEFAULT 0,
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await getSql()`
      CREATE TABLE IF NOT EXISTS requirements (
        id VARCHAR(100) PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT '',
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        assignee VARCHAR(255) DEFAULT '',
        reporter VARCHAR(255) DEFAULT '',
        created_date DATE NOT NULL,
        due_date DATE NOT NULL,
        story_points INT NOT NULL DEFAULT 0,
        points INT NOT NULL DEFAULT 0,
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await getSql()`
      CREATE TABLE IF NOT EXISTS defects (
        id VARCHAR(100) PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR(50) NOT NULL DEFAULT 'open',
        severity VARCHAR(50) NOT NULL DEFAULT 'medium',
        type VARCHAR(50) NOT NULL,
        assignee VARCHAR(255) DEFAULT '',
        reporter VARCHAR(255) DEFAULT '',
        created_date DATE NOT NULL,
        due_date DATE NOT NULL,
        environment VARCHAR(255) DEFAULT '',
        steps JSONB DEFAULT '[]',
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
 * 根据昵称查找用户（含 role、total_points）
 */
export async function findUserByNickname(nickname: string): Promise<(User & { role: UserRole }) | null> {
  try {
    const result = await getSql()`
      SELECT id, nickname, password, role, COALESCE(total_points, 0) AS total_points
      FROM users
      WHERE nickname = ${nickname}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    const row = result[0] as { id: string; nickname: string; password: string; role: string; total_points: number };
    return {
      id: String(row.id),
      nickname: row.nickname,
      password: row.password,
      role: (row.role as UserRole) || 'user',
      totalPoints: Number(row.total_points) || 0,
    };
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 根据ID查找用户（含 role、total_points）
 */
export async function findUserById(id: string): Promise<(User & { role: UserRole }) | null> {
  try {
    const result = await getSql()`
      SELECT id, nickname, password, role, COALESCE(total_points, 0) AS total_points
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    const row = result[0] as { id: string; nickname: string; password: string; role: string; total_points: number };
    return {
      id: String(row.id),
      nickname: row.nickname,
      password: row.password,
      role: (row.role as UserRole) || 'user',
      totalPoints: Number(row.total_points) || 0,
    };
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 获取用户总积分
 */
export async function getUserTotalPoints(userId: string): Promise<number> {
  try {
    const result = await getSql()`SELECT COALESCE(total_points, 0) AS total_points FROM users WHERE id = ${userId} LIMIT 1`;
    if (result.length === 0) return 0;
    return Number((result[0] as { total_points: number }).total_points) || 0;
  } catch (error) {
    console.error('获取用户总积分失败:', error);
    return 0;
  }
}

/**
 * 更新用户总积分（累加）
 */
export async function updateUserTotalPoints(userId: string, pointsToAdd: number): Promise<boolean> {
  try {
    const result = await getSql()`
      UPDATE users SET total_points = COALESCE(total_points, 0) + ${pointsToAdd} WHERE id = ${userId} RETURNING id
    `;
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('更新用户总积分失败:', error);
    return false;
  }
}

/**
 * 获取所有用户（仅 id、nickname、role、totalPoints，不含密码）
 */
export async function getUsers(): Promise<{ id: string; nickname: string; role: string; totalPoints: number }[]> {
  try {
    const result = await getSql()`
      SELECT id, nickname, role, COALESCE(total_points, 0) AS total_points FROM users ORDER BY created_at ASC
    `;
    return (result as unknown as { id: string; nickname: string; role: string; total_points: number }[]).map((row) => ({
      id: String(row.id),
      nickname: row.nickname,
      role: row.role,
      totalPoints: Number(row.total_points) || 0,
    }));
  } catch (error) {
    console.error('获取用户列表失败:', error);
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
    const result = await getSql()`
      INSERT INTO users (nickname, password, role)
      VALUES (${nickname}, ${hashedPassword}, ${roleVal})
      RETURNING id, nickname, password, role, COALESCE(total_points, 0) AS total_points
    `;
    const row = result[0] as { id: string; nickname: string; password: string; role: string; total_points?: number };
    return {
      id: String(row.id),
      nickname: row.nickname,
      password: row.password,
      role: (row.role as UserRole) || 'user',
      totalPoints: Number(row.total_points) ?? 0,
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
    const result = await getSql()`SELECT * FROM projects WHERE user_id = ${userId}`;
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
    const result = await getSql()`
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
    const result = await getSql()`
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
    const existing = await getSql()`SELECT * FROM projects WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
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
    const result = await getSql()`
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
    const result = await getSql()`DELETE FROM projects WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('删除项目失败:', error);
    throw error;
  }
}

// ---------- 任务 CRUD ----------

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    status: (row.status as TaskStatus) || 'todo',
    priority: (row.priority as TaskPriority) || 'medium',
    assignee: String(row.assignee ?? ''),
    dueDate: row.due_date != null ? String(row.due_date) : '',
    estimatedHours: Number(row.estimated_hours) || 0,
    completedHours: Number(row.completed_hours) || 0,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}

export async function getTasks(filters?: {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}): Promise<Task[]> {
  try {
    let result;
    if (filters?.projectId) {
      result = await getSql()`SELECT * FROM tasks WHERE project_id = ${filters.projectId}`;
    } else {
      result = await getSql()`SELECT * FROM tasks`;
    }
    let list = result as unknown as Record<string, unknown>[];
    if (filters?.status) list = list.filter((r) => r.status === filters.status);
    if (filters?.priority) list = list.filter((r) => r.priority === filters.priority);
    return list.map(rowToTask);
  } catch (error) {
    console.error('获取任务列表失败:', error);
    throw error;
  }
}

export async function getTaskById(id: string): Promise<Task | null> {
  try {
    const result = await getSql()`SELECT * FROM tasks WHERE id = ${id} LIMIT 1`;
    if (result.length === 0) return null;
    return rowToTask(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('获取任务详情失败:', error);
    throw error;
  }
}

export async function createTask(data: TaskCreateRequest): Promise<Task> {
  try {
    const result = await getSql()`
      INSERT INTO tasks (project_id, title, description, status, priority, assignee, due_date, estimated_hours, completed_hours, tags)
      VALUES (
        ${data.projectId},
        ${data.title ?? ''},
        ${data.description ?? ''},
        ${data.status ?? 'todo'},
        ${data.priority ?? 'medium'},
        ${data.assignee ?? ''},
        ${data.dueDate ?? ''},
        ${data.estimatedHours ?? 0},
        ${data.completedHours ?? 0},
        ${JSON.stringify(data.tags ?? [])}
      )
      RETURNING *
    `;
    return rowToTask(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('创建任务失败:', error);
    throw error;
  }
}

export async function updateTask(id: string, data: TaskUpdateRequest): Promise<Task | null> {
  try {
    const existing = await getSql()`SELECT * FROM tasks WHERE id = ${id} LIMIT 1`;
    if (existing.length === 0) return null;
    const row = existing[0] as unknown as Record<string, unknown>;
    const title = (data.title !== undefined ? data.title : row.title) as string;
    const description = (data.description !== undefined ? data.description : row.description) as string;
    const status = (data.status !== undefined ? data.status : row.status) as string;
    const priority = (data.priority !== undefined ? data.priority : row.priority) as string;
    const assignee = (data.assignee !== undefined ? data.assignee : row.assignee) as string;
    const dueDate = (data.dueDate !== undefined ? data.dueDate : row.due_date) as string;
    const estimatedHours = Number(data.estimatedHours !== undefined ? data.estimatedHours : row.estimated_hours);
    const completedHours = Number(data.completedHours !== undefined ? data.completedHours : row.completed_hours);
    const tagsJson = JSON.stringify(data.tags !== undefined ? data.tags : (row.tags as string[]) ?? []);
    const result = await getSql()`
      UPDATE tasks SET
        title = ${title},
        description = ${description},
        status = ${status},
        priority = ${priority},
        assignee = ${assignee},
        due_date = ${dueDate},
        estimated_hours = ${estimatedHours},
        completed_hours = ${completedHours},
        tags = ${tagsJson},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) return null;
    return rowToTask(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('更新任务失败:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const result = await getSql()`DELETE FROM tasks WHERE id = ${id} RETURNING id`;
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('删除任务失败:', error);
    throw error;
  }
}

// ---------- 需求 CRUD ----------

function rowToRequirement(row: Record<string, unknown>): Requirement {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    type: (row.type as RequirementType) || 'feature',
    status: (row.status as RequirementStatus) || 'draft',
    priority: (row.priority as RequirementPriority) || 'medium',
    assignee: String(row.assignee ?? ''),
    reporter: String(row.reporter ?? ''),
    createdDate: row.created_date != null ? String(row.created_date) : '',
    dueDate: row.due_date != null ? String(row.due_date) : '',
    storyPoints: Number(row.story_points) || 0,
    points: Number(row.points) || 0,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}

export async function getRequirements(filters?: {
  projectId?: string;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  type?: RequirementType;
}): Promise<Requirement[]> {
  try {
    let result;
    if (filters?.projectId) {
      result = await getSql()`SELECT * FROM requirements WHERE project_id = ${filters.projectId}`;
    } else {
      result = await getSql()`SELECT * FROM requirements`;
    }
    let list = result as unknown as Record<string, unknown>[];
    if (filters?.status) list = list.filter((r) => r.status === filters.status);
    if (filters?.priority) list = list.filter((r) => r.priority === filters.priority);
    if (filters?.type) list = list.filter((r) => r.type === filters.type);
    return list.map(rowToRequirement);
  } catch (error) {
    console.error('获取需求列表失败:', error);
    throw error;
  }
}

export async function getRequirementById(id: string): Promise<Requirement | null> {
  try {
    const result = await getSql()`SELECT * FROM requirements WHERE id = ${id} LIMIT 1`;
    if (result.length === 0) return null;
    return rowToRequirement(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('获取需求详情失败:', error);
    throw error;
  }
}

export async function createRequirement(data: RequirementCreateRequest): Promise<Requirement> {
  try {
    const id = `REQ-${String(Date.now()).slice(-8)}-${Math.random().toString(36).slice(2, 6)}`;
    await getSql()`
      INSERT INTO requirements (id, project_id, title, description, type, status, priority, assignee, reporter, created_date, due_date, story_points, points, tags)
      VALUES (
        ${id},
        ${data.projectId},
        ${data.title ?? ''},
        ${data.description ?? ''},
        ${data.type ?? 'feature'},
        ${data.status ?? 'draft'},
        ${data.priority ?? 'medium'},
        ${data.assignee ?? ''},
        ${data.reporter ?? ''},
        ${data.createdDate ?? ''},
        ${data.dueDate ?? ''},
        ${data.storyPoints ?? 0},
        ${data.points ?? 0},
        ${JSON.stringify(data.tags ?? [])}
      )
    `;
    const created = await getRequirementById(id);
    if (!created) throw new Error('创建需求后查询失败');
    return created;
  } catch (error) {
    console.error('创建需求失败:', error);
    throw error;
  }
}

export async function updateRequirement(id: string, data: RequirementUpdateRequest): Promise<Requirement | null> {
  try {
    const existing = await getSql()`SELECT * FROM requirements WHERE id = ${id} LIMIT 1`;
    if (existing.length === 0) return null;
    const row = existing[0] as unknown as Record<string, unknown>;
    const title = String(data.title !== undefined ? data.title : row.title);
    const description = String(data.description !== undefined ? data.description : row.description ?? '');
    const type = String(data.type !== undefined ? data.type : row.type);
    const status = String(data.status !== undefined ? data.status : row.status);
    const priority = String(data.priority !== undefined ? data.priority : row.priority);
    const assignee = String(data.assignee !== undefined ? data.assignee : row.assignee ?? '');
    const reporter = String(data.reporter !== undefined ? data.reporter : row.reporter ?? '');
    const createdDate = String(data.createdDate !== undefined ? data.createdDate : row.created_date ?? '');
    const dueDate = String(data.dueDate !== undefined ? data.dueDate : row.due_date ?? '');
    const storyPoints = Number(data.storyPoints !== undefined ? data.storyPoints : row.story_points ?? 0);
    const points = Number(data.points !== undefined ? data.points : row.points ?? 0);
    const tagsJson = JSON.stringify(data.tags !== undefined ? data.tags : (row.tags as string[]) ?? []);
    await getSql()`
      UPDATE requirements SET
        title = ${title},
        description = ${description},
        type = ${type},
        status = ${status},
        priority = ${priority},
        assignee = ${assignee},
        reporter = ${reporter},
        created_date = ${createdDate},
        due_date = ${dueDate},
        story_points = ${storyPoints},
        points = ${points},
        tags = ${tagsJson},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    return getRequirementById(id);
  } catch (error) {
    console.error('更新需求失败:', error);
    throw error;
  }
}

export async function deleteRequirement(id: string): Promise<boolean> {
  try {
    const result = await getSql()`DELETE FROM requirements WHERE id = ${id} RETURNING id`;
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('删除需求失败:', error);
    throw error;
  }
}

// ---------- 缺陷 CRUD ----------

function rowToDefect(row: Record<string, unknown>): Defect {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    status: (row.status as DefectStatus) || 'open',
    severity: (row.severity as DefectSeverity) || 'medium',
    type: (row.type as DefectType) || 'bug',
    assignee: String(row.assignee ?? ''),
    reporter: String(row.reporter ?? ''),
    createdDate: row.created_date != null ? String(row.created_date) : '',
    dueDate: row.due_date != null ? String(row.due_date) : '',
    environment: String(row.environment ?? ''),
    steps: Array.isArray(row.steps) ? (row.steps as string[]) : [],
  };
}

export async function getDefects(filters?: {
  projectId?: string;
  status?: DefectStatus;
  severity?: DefectSeverity;
  type?: DefectType;
}): Promise<Defect[]> {
  try {
    let result;
    if (filters?.projectId) {
      result = await getSql()`SELECT * FROM defects WHERE project_id = ${filters.projectId}`;
    } else {
      result = await getSql()`SELECT * FROM defects`;
    }
    let list = result as unknown as Record<string, unknown>[];
    if (filters?.status) list = list.filter((r) => r.status === filters.status);
    if (filters?.severity) list = list.filter((r) => r.severity === filters.severity);
    if (filters?.type) list = list.filter((r) => r.type === filters.type);
    return list.map(rowToDefect);
  } catch (error) {
    console.error('获取缺陷列表失败:', error);
    throw error;
  }
}

export async function getDefectById(id: string): Promise<Defect | null> {
  try {
    const result = await getSql()`SELECT * FROM defects WHERE id = ${id} LIMIT 1`;
    if (result.length === 0) return null;
    return rowToDefect(result[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('获取缺陷详情失败:', error);
    throw error;
  }
}

export async function createDefect(data: DefectCreateRequest): Promise<Defect> {
  try {
    const id = `DEF-${String(Date.now()).slice(-8)}-${Math.random().toString(36).slice(2, 6)}`;
    await getSql()`
      INSERT INTO defects (id, project_id, title, description, status, severity, type, assignee, reporter, created_date, due_date, environment, steps)
      VALUES (
        ${id},
        ${data.projectId},
        ${data.title ?? ''},
        ${data.description ?? ''},
        ${data.status ?? 'open'},
        ${data.severity ?? 'medium'},
        ${data.type ?? 'bug'},
        ${data.assignee ?? ''},
        ${data.reporter ?? ''},
        ${data.createdDate ?? ''},
        ${data.dueDate ?? ''},
        ${data.environment ?? ''},
        ${JSON.stringify(data.steps ?? [])}
      )
    `;
    const created = await getDefectById(id);
    if (!created) throw new Error('创建缺陷后查询失败');
    return created;
  } catch (error) {
    console.error('创建缺陷失败:', error);
    throw error;
  }
}

export async function updateDefect(id: string, data: DefectUpdateRequest): Promise<Defect | null> {
  try {
    const existing = await getSql()`SELECT * FROM defects WHERE id = ${id} LIMIT 1`;
    if (existing.length === 0) return null;
    const row = existing[0] as unknown as Record<string, unknown>;
    const title = String(data.title !== undefined ? data.title : row.title);
    const description = String(data.description !== undefined ? data.description : row.description ?? '');
    const status = String(data.status !== undefined ? data.status : row.status);
    const severity = String(data.severity !== undefined ? data.severity : row.severity);
    const type = String(data.type !== undefined ? data.type : row.type);
    const assignee = String(data.assignee !== undefined ? data.assignee : row.assignee ?? '');
    const reporter = String(data.reporter !== undefined ? data.reporter : row.reporter ?? '');
    const createdDate = String(data.createdDate !== undefined ? data.createdDate : row.created_date ?? '');
    const dueDate = String(data.dueDate !== undefined ? data.dueDate : row.due_date ?? '');
    const environment = String(data.environment !== undefined ? data.environment : row.environment ?? '');
    const stepsJson = JSON.stringify(data.steps !== undefined ? data.steps : (row.steps as string[]) ?? []);
    await getSql()`
      UPDATE defects SET
        title = ${title},
        description = ${description},
        status = ${status},
        severity = ${severity},
        type = ${type},
        assignee = ${assignee},
        reporter = ${reporter},
        created_date = ${createdDate},
        due_date = ${dueDate},
        environment = ${environment},
        steps = ${stepsJson},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    return getDefectById(id);
  } catch (error) {
    console.error('更新缺陷失败:', error);
    throw error;
  }
}

export async function deleteDefect(id: string): Promise<boolean> {
  try {
    const result = await getSql()`DELETE FROM defects WHERE id = ${id} RETURNING id`;
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('删除缺陷失败:', error);
    throw error;
  }
}

/**
 * 检查数据库连接
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await getSql()`SELECT 1`;
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
    await getSql().end();
  } catch (error) {
    console.error('关闭数据库连接失败:', error);
  }
}