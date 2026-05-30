'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_TENANT, MOCK_USER, MOCK_TOKEN, getRandomRewardWords } from '@/shared/lib/mock-data';

export interface ActiveReward {
  id: string;
  words: string;
  status: 'PENDING' | 'BURNED';
  createdAt: string; // ISO string para serialización en localStorage
}

// Claves de localStorage
const LS_REWARDS = 'cl_active_rewards';
const LS_STAMPS  = 'cl_current_stamps';
const LS_LAST_STAMP = 'cl_last_stamp_ts';
const LS_TOTAL_REWARDS = 'cl_total_rewards';
const LS_TENANT = 'cl_tenant';

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function writeLS(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

interface AppState {
  isLoggedIn: boolean;
  user: typeof MOCK_USER | null;
  tenant: typeof MOCK_TENANT;
  currentStamps: number;
  totalRewardsEarned: number;
  lastStampTimestamp: Date | null;
  activeRewards: ActiveReward[];
  currentToken: typeof MOCK_TOKEN;
  // Acciones
  login: () => void;
  logout: () => void;
  addStamp: () => boolean;
  initiateReward: () => string;
  burnReward: (rewardId: string) => void;
  updateTenant: (updates: Partial<typeof MOCK_TENANT>) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [tenant, setTenant] = useState<typeof MOCK_TENANT>(() => readLS(LS_TENANT, MOCK_TENANT));
  const [currentStamps, setCurrentStamps] = useState<number>(() => readLS(LS_STAMPS, 3));
  const [totalRewardsEarned, setTotalRewardsEarned] = useState<number>(() => readLS(LS_TOTAL_REWARDS, 2));
  const [lastStampTimestamp, setLastStampTimestamp] = useState<Date | null>(() => {
    const ts = readLS<string | null>(LS_LAST_STAMP, null);
    return ts ? new Date(ts) : null;
  });
  const [activeRewards, setActiveRewards] = useState<ActiveReward[]>(() => readLS(LS_REWARDS, []));
  const [currentToken] = useState(MOCK_TOKEN);

  // ─── Persist to localStorage on change ───────────────────────────────────
  useEffect(() => { writeLS(LS_REWARDS, activeRewards); }, [activeRewards]);
  useEffect(() => { writeLS(LS_STAMPS, currentStamps); }, [currentStamps]);
  useEffect(() => { writeLS(LS_TOTAL_REWARDS, totalRewardsEarned); }, [totalRewardsEarned]);
  useEffect(() => { writeLS(LS_LAST_STAMP, lastStampTimestamp?.toISOString() ?? null); }, [lastStampTimestamp]);
  useEffect(() => { writeLS(LS_TENANT, tenant); }, [tenant]);

  // ─── Cross-tab sync via storage event ────────────────────────────────────
  const syncFromStorage = useCallback((e: StorageEvent) => {
    if (e.key === LS_REWARDS && e.newValue !== null) {
      try { setActiveRewards(JSON.parse(e.newValue)); } catch { /* noop */ }
    }
    if (e.key === LS_STAMPS && e.newValue !== null) {
      try { setCurrentStamps(JSON.parse(e.newValue)); } catch { /* noop */ }
    }
    if (e.key === LS_TOTAL_REWARDS && e.newValue !== null) {
      try { setTotalRewardsEarned(JSON.parse(e.newValue)); } catch { /* noop */ }
    }
    if (e.key === LS_TENANT && e.newValue !== null) {
      try { setTenant(JSON.parse(e.newValue)); } catch { /* noop */ }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, [syncFromStorage]);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const login = () => { setIsLoggedIn(true); setUser(MOCK_USER); };
  const logout = () => { setIsLoggedIn(false); setUser(null); };

  const addStamp = (): boolean => {
    if (lastStampTimestamp) {
      const hoursDiff = (Date.now() - lastStampTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 5) return false;
    }
    setCurrentStamps(prev => Math.min(prev + 1, 5));
    setLastStampTimestamp(new Date());
    return true;
  };

  const initiateReward = (): string => {
    const words = getRandomRewardWords();
    const reward: ActiveReward = {
      id: `reward-${Date.now()}`,
      words,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setActiveRewards(prev => [...prev, reward]);
    return words;
  };

  const burnReward = (rewardId: string) => {
    setActiveRewards(prev =>
      prev.map(r => r.id === rewardId ? { ...r, status: 'BURNED' as const } : r)
    );
    setCurrentStamps(0);
    setTotalRewardsEarned(prev => prev + 1);
  };

  const updateTenant = (updates: Partial<typeof MOCK_TENANT>) => {
    setTenant(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, user, tenant, currentStamps, totalRewardsEarned,
      lastStampTimestamp, activeRewards, currentToken,
      login, logout, addStamp, initiateReward, burnReward, updateTenant,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
