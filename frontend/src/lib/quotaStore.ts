// frontend/src/lib/quotaStore.ts
'use client';

export interface CustomApiKeys {
  nebiusKey: string;
  tavilyKey: string;
  contextDevKey: string;
}

export interface QuotaState {
  runsUsed: number;
  maxFreeRuns: number;
  isAdmin: boolean;
  hasCustomKey: boolean;
  customKeys: CustomApiKeys;
}

const STORAGE_KEYS = {
  RUNS_COUNT: 'hermesshield_runs_count',
  ADMIN_UNLOCKED: 'hermesshield_admin_unlocked',
  CUSTOM_KEYS: 'hermesshield_custom_keys',
};

const MASTER_ADMIN_PASSCODE = 'hermes2026';
const MAX_FREE_RUNS = 3;

/**
 * Read current quota, BYOK, and Admin state from localStorage.
 */
export function getQuotaState(): QuotaState {
  if (typeof window === 'undefined') {
    return {
      runsUsed: 0,
      maxFreeRuns: MAX_FREE_RUNS,
      isAdmin: false,
      hasCustomKey: false,
      customKeys: { nebiusKey: '', tavilyKey: '', contextDevKey: '' },
    };
  }

  try {
    const runsUsed = parseInt(localStorage.getItem(STORAGE_KEYS.RUNS_COUNT) || '0', 10);
    const isAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_UNLOCKED) === 'true';
    const rawKeys = localStorage.getItem(STORAGE_KEYS.CUSTOM_KEYS);
    const customKeys: CustomApiKeys = rawKeys
      ? JSON.parse(rawKeys)
      : { nebiusKey: '', tavilyKey: '', contextDevKey: '' };

    const hasCustomKey = Boolean(customKeys.nebiusKey && customKeys.nebiusKey.trim().length > 5);

    return {
      runsUsed: isNaN(runsUsed) ? 0 : runsUsed,
      maxFreeRuns: MAX_FREE_RUNS,
      isAdmin,
      hasCustomKey,
      customKeys,
    };
  } catch (e) {
    console.warn('Error reading quota state from localStorage:', e);
    return {
      runsUsed: 0,
      maxFreeRuns: MAX_FREE_RUNS,
      isAdmin: false,
      hasCustomKey: false,
      customKeys: { nebiusKey: '', tavilyKey: '', contextDevKey: '' },
    };
  }
}

/**
 * Increment runs used if not in admin or custom key mode.
 */
export function incrementRunsUsed(): number {
  if (typeof window === 'undefined') return 0;
  const state = getQuotaState();
  if (state.isAdmin || state.hasCustomKey) {
    return state.runsUsed; // Do not consume free quota in admin/BYOK mode
  }

  const next = state.runsUsed + 1;
  try {
    localStorage.setItem(STORAGE_KEYS.RUNS_COUNT, String(next));
    window.dispatchEvent(new Event('hermesshield-quota-changed'));
  } catch (e) {
    console.warn('Failed to persist run count:', e);
  }
  return next;
}

/**
 * Check if the user is permitted to trigger a live run.
 */
export function canExecuteRun(): { allowed: boolean; remainingFree: number } {
  const state = getQuotaState();
  if (state.isAdmin || state.hasCustomKey) {
    return { allowed: true, remainingFree: Infinity };
  }

  const remaining = Math.max(0, state.maxFreeRuns - state.runsUsed);
  return {
    allowed: remaining > 0,
    remainingFree: remaining,
  };
}

/**
 * Validate and unlock master admin bypass mode.
 */
export function verifyAndUnlockAdmin(passcode: string): boolean {
  if (typeof window === 'undefined') return false;
  if (passcode.trim().toLowerCase() === MASTER_ADMIN_PASSCODE) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_UNLOCKED, 'true');
    window.dispatchEvent(new Event('hermesshield-quota-changed'));
    return true;
  }
  return false;
}

/**
 * Revoke admin bypass mode (e.g. for testing user flow).
 */
export function lockAdminMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ADMIN_UNLOCKED);
  window.dispatchEvent(new Event('hermesshield-quota-changed'));
}

/**
 * Save user-provided BYOK API keys.
 */
export function saveCustomApiKeys(keys: CustomApiKeys): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_KEYS, JSON.stringify(keys));
    window.dispatchEvent(new Event('hermesshield-quota-changed'));
  } catch (e) {
    console.warn('Failed to save custom keys:', e);
  }
}

/**
 * Clear custom keys.
 */
export function clearCustomApiKeys(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_KEYS);
    window.dispatchEvent(new Event('hermesshield-quota-changed'));
  } catch (e) {
    console.warn('Failed to clear custom keys:', e);
  }
}

/**
 * Reset free runs count (admin convenience).
 */
export function resetFreeRuns(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.RUNS_COUNT, '0');
  window.dispatchEvent(new Event('hermesshield-quota-changed'));
}
