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
  nebiusSpendUsd: number;
  maxNebiusSpendUsd: number;
  isNebiusLimitHit: boolean;
}

const STORAGE_KEYS = {
  RUNS_COUNT: 'hermesshield_runs_count',
  ADMIN_UNLOCKED: 'hermesshield_admin_unlocked',
  CUSTOM_KEYS: 'hermesshield_custom_keys',
  NEBIUS_SPEND: 'hermesshield_nebius_spend_usd',
};

const MASTER_ADMIN_PASSCODE = 'hermes2026';
export const MAX_NEBIUS_SPEND_USD = 5.00;
const MAX_FREE_RUNS = 25; // Generous trial runs within $5.00 limit

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
      nebiusSpendUsd: 0,
      maxNebiusSpendUsd: MAX_NEBIUS_SPEND_USD,
      isNebiusLimitHit: false,
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

    const rawSpend = parseFloat(localStorage.getItem(STORAGE_KEYS.NEBIUS_SPEND) || '0.00');
    const nebiusSpendUsd = isNaN(rawSpend) ? 0 : rawSpend;
    const isNebiusLimitHit = !hasCustomKey && !isAdmin && nebiusSpendUsd >= MAX_NEBIUS_SPEND_USD;

    return {
      runsUsed: isNaN(runsUsed) ? 0 : runsUsed,
      maxFreeRuns: MAX_FREE_RUNS,
      isAdmin,
      hasCustomKey,
      customKeys,
      nebiusSpendUsd,
      maxNebiusSpendUsd: MAX_NEBIUS_SPEND_USD,
      isNebiusLimitHit,
    };
  } catch (e) {
    console.warn('Error reading quota state from localStorage:', e);
    return {
      runsUsed: 0,
      maxFreeRuns: MAX_FREE_RUNS,
      isAdmin: false,
      hasCustomKey: false,
      customKeys: { nebiusKey: '', tavilyKey: '', contextDevKey: '' },
      nebiusSpendUsd: 0,
      maxNebiusSpendUsd: MAX_NEBIUS_SPEND_USD,
      isNebiusLimitHit: false,
    };
  }
}

/**
 * Increment runs and track Nebius spend.
 */
export function recordRunUsage(costUsd: number = 0.0018): number {
  if (typeof window === 'undefined') return 0;
  const state = getQuotaState();
  if (state.isAdmin || state.hasCustomKey) {
    return state.runsUsed; // Unlimited in BYOK or Admin mode
  }

  const nextCount = state.runsUsed + 1;
  const nextSpend = Math.min(MAX_NEBIUS_SPEND_USD, Number((state.nebiusSpendUsd + costUsd).toFixed(4)));

  try {
    localStorage.setItem(STORAGE_KEYS.RUNS_COUNT, String(nextCount));
    localStorage.setItem(STORAGE_KEYS.NEBIUS_SPEND, String(nextSpend));
    window.dispatchEvent(new Event('hermesshield-quota-changed'));
  } catch (e) {
    console.warn('Failed to persist run count:', e);
  }
  return nextCount;
}

export function incrementRunsUsed(): number {
  return recordRunUsage(0.0018);
}

/**
 * Check if the user is permitted to trigger a live run.
 */
export function canExecuteRun(): {
  allowed: boolean;
  remainingFree: number;
  remainingDollars: number;
  reason?: 'limit_reached' | null;
} {
  const state = getQuotaState();
  if (state.isAdmin || state.hasCustomKey) {
    return { allowed: true, remainingFree: Infinity, remainingDollars: Infinity };
  }

  const remainingDollars = Math.max(0, Number((MAX_NEBIUS_SPEND_USD - state.nebiusSpendUsd).toFixed(4)));
  const allowed = remainingDollars > 0 && !state.isNebiusLimitHit;

  return {
    allowed,
    remainingFree: Math.ceil(remainingDollars / 0.0018),
    remainingDollars,
    reason: allowed ? null : 'limit_reached',
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
 * Reset Nebius evaluation spend (for testing or reset).
 */
export function resetNebiusSpend(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.NEBIUS_SPEND);
  localStorage.removeItem(STORAGE_KEYS.RUNS_COUNT);
  window.dispatchEvent(new Event('hermesshield-quota-changed'));
}

export function resetFreeRuns(): void {
  resetNebiusSpend();
}
