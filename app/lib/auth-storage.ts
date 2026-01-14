const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  NICKNAME: 'lastLoginNickname',
  PASSWORD: 'lastLoginPassword',
} as const;

export interface AuthStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  removeAccessToken(): void;
  
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
  
  getNickname(): string | null;
  setNickname(value: string): void;
  removeNickname(): void;
  
  getPassword(): string | null;
  setPassword(value: string): void;
  removePassword(): void;
  
  clearAll(): void;
}

export const authStorage: AuthStorage = {
  getAccessToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: () => localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
  
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
  
  getNickname: () => localStorage.getItem(STORAGE_KEYS.NICKNAME),
  setNickname: (value) => localStorage.setItem(STORAGE_KEYS.NICKNAME, value),
  removeNickname: () => localStorage.removeItem(STORAGE_KEYS.NICKNAME),
  
  getPassword: () => localStorage.getItem(STORAGE_KEYS.PASSWORD),
  setPassword: (value) => localStorage.setItem(STORAGE_KEYS.PASSWORD, value),
  removePassword: () => localStorage.removeItem(STORAGE_KEYS.PASSWORD),
  
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
