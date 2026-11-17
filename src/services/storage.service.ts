/**
 * Resilient Local Storage Service
 * Handles SSR safety, corrupted JSON, quota exceptions, and private browsing.
 */

class StorageService {
  private isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const testKey = "__candela_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key "${key}":`, err);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to write key "${key}":`, err);
      return false;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, err);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.clear();
      return true;
    } catch (err) {
      console.warn("[StorageService] Failed to clear storage:", err);
      return false;
    }
  }
}

export const safeStorage = new StorageService();
