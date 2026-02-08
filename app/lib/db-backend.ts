/**
 * 统一数据层入口：仅使用 PostgreSQL（db.ts）。未配置 POSTGRES_URL 或连接失败时抛出错误，不再回退到内存。
 */
type UserWithRole = import('./definitions').User & { role?: import('./definitions').UserRole };
type UserBackend = {
  findUserByNickname: (nickname: string) => Promise<(import('./definitions').User & { role: import('./definitions').UserRole }) | null>;
  findUserById: (id: string) => Promise<(import('./definitions').User & { role: import('./definitions').UserRole }) | null>;
  createUser: (nickname: string, password: string, role?: import('./definitions').UserRole) => Promise<import('./definitions').User & { role: import('./definitions').UserRole }>;
  verifyUserPassword: (user: UserWithRole, password: string) => Promise<boolean>;
  getSafeUserInfo: (user: UserWithRole) => { id: string; nickname: string; isAdmin?: boolean };
  initializeDatabase: () => Promise<{ success: boolean }>;
  checkDatabaseConnection: () => Promise<boolean>;
};

let cachedUserBackend: UserBackend | null = null;

export function isConnectionError(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string }; errors?: Array<{ code?: string }> };
  return (
    err?.code === 'ECONNREFUSED' ||
    err?.code === 'ENOTFOUND' ||
    err?.cause?.code === 'ECONNREFUSED' ||
    err?.errors?.[0]?.code === 'ECONNREFUSED'
  );
}

const NO_DB_MSG =
  '未配置数据库。请在 .env 中设置 POSTGRES_URL，例如：\n' +
  'POSTGRES_URL=postgresql://agile_user:agile_password@localhost:5432/agile_person_manage';

export async function getUserBackend(): Promise<UserBackend> {
  if (cachedUserBackend) return cachedUserBackend;
  if (!process.env.POSTGRES_URL || !process.env.POSTGRES_URL.trim()) {
    throw new Error(NO_DB_MSG);
  }
  if (/username\s*:/i.test(process.env.POSTGRES_URL)) {
    throw new Error(
      'POSTGRES_URL 仍为占位符。请在项目根目录 .env 中改为实际连接串，例如：\n' +
        'POSTGRES_URL=postgresql://agile_user:agile_password@localhost:5432/agile_person_manage'
    );
  }
  try {
    const db = await import('./db');
    cachedUserBackend = {
      findUserByNickname: db.findUserByNickname,
      findUserById: db.findUserById,
      createUser: db.createUser,
      verifyUserPassword: db.verifyUserPassword,
      getSafeUserInfo: (u) => ({ ...db.getSafeUserInfo(u), isAdmin: u.role === 'superadmin' }),
      initializeDatabase: db.initializeDatabase,
      checkDatabaseConnection: db.checkDatabaseConnection,
    };
    return cachedUserBackend;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (isConnectionError(e)) {
      throw new Error('数据库连接失败，请确认 PostgreSQL 已启动且 POSTGRES_URL 正确。' + (msg ? ` ${msg}` : ''));
    }
    throw e;
  }
}
