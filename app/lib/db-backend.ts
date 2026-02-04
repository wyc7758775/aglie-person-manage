/**
 * 统一数据层入口：当 POSTGRES_URL 存在时使用 PostgreSQL（db.ts），否则使用内存（db-memory.ts）。
 * 仅在有 POSTGRES_URL 时才会加载 db.ts，避免未配置时连接失败。
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
/** 当 PostgreSQL 连接失败时置为 true，后续请求自动使用内存后端 */
let useMemoryDueToConnectionFailure = false;

export function isConnectionError(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string }; errors?: Array<{ code?: string }> };
  return (
    err?.code === "ECONNREFUSED" ||
    err?.code === "ENOTFOUND" ||
    err?.cause?.code === "ECONNREFUSED" ||
    err?.errors?.[0]?.code === "ECONNREFUSED"
  );
}

/** 在连接失败时调用，后续将使用内存后端（无需改 .env 或启动 Docker） */
export function forceMemoryBackend(): void {
  useMemoryDueToConnectionFailure = true;
  cachedUserBackend = null;
}

/** 是否已因连接失败而使用内存（项目层可据此决定用 db 还是内存） */
export function getShouldUseMemoryBackend(): boolean {
  return useMemoryDueToConnectionFailure;
}

const PLACEHOLDER_MSG = 'POSTGRES_URL 仍为占位符';

export async function getUserBackend(): Promise<UserBackend> {
  if (cachedUserBackend) return cachedUserBackend;
  if (process.env.POSTGRES_URL && !useMemoryDueToConnectionFailure) {
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes(PLACEHOLDER_MSG)) {
        console.warn('[db-backend] POSTGRES_URL 为占位符，已自动切换为内存后端。如需持久化，请在 .env 中配置正确连接串并重启。');
        useMemoryDueToConnectionFailure = true;
        cachedUserBackend = null;
        return getUserBackend();
      }
      throw e;
    }
  }
  if (!cachedUserBackend) {
    const mem = await import('./db-memory');
    type UserAndRole = import('./definitions').User & { role: import('./definitions').UserRole };
    cachedUserBackend = {
      findUserByNickname: mem.findUserByNickname as UserBackend['findUserByNickname'],
      findUserById: mem.findUserById as UserBackend['findUserById'],
      createUser: mem.createUser,
      verifyUserPassword: (user: UserWithRole, password: string) =>
        mem.verifyUserPassword(user as UserAndRole, password),
      getSafeUserInfo: mem.getSafeUserInfo as UserBackend['getSafeUserInfo'],
      initializeDatabase: mem.initializeDatabase,
      checkDatabaseConnection: mem.checkDatabaseConnection,
    };
  }
  return cachedUserBackend;
}
