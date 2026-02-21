"use client";

import * as React from "react";

// Types
interface TrophyUser {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  attributes?: Record<string, string | number | boolean>;
}

interface TrophyConfig {
  /** Trophy API key */
  apiKey?: string;
  /** Base URL for Trophy API (default: https://api.trophy.so) */
  baseUrl?: string;
  /** Current user */
  user?: TrophyUser | null;
  /** Enable debug logging */
  debug?: boolean;
}

interface TrophyContextValue {
  /** Current configuration */
  config: TrophyConfig;
  /** Current user */
  user: TrophyUser | null;
  /** Update user */
  setUser: (user: TrophyUser | null) => void;
  /** Update config */
  updateConfig: (config: Partial<TrophyConfig>) => void;
  /** Check if Trophy is configured */
  isConfigured: boolean;
}

// Context
const TrophyContext = React.createContext<TrophyContextValue | null>(null);

// Provider Props
interface TrophyProviderProps {
  children: React.ReactNode;
  /** Initial configuration */
  config?: TrophyConfig;
  /** Initial user */
  user?: TrophyUser | null;
  /** Called when user changes */
  onUserChange?: (user: TrophyUser | null) => void;
}

function TrophyProvider({
  children,
  config: initialConfig = {},
  user: initialUser = null,
  onUserChange,
}: TrophyProviderProps) {
  const [config, setConfig] = React.useState<TrophyConfig>(() => ({
    baseUrl: "https://api.trophy.so",
    ...initialConfig,
  }));

  const [user, setUserState] = React.useState<TrophyUser | null>(
    initialUser ?? initialConfig.user ?? null,
  );

  const setUser = React.useCallback(
    (newUser: TrophyUser | null) => {
      setUserState(newUser);
      onUserChange?.(newUser);
    },
    [onUserChange],
  );

  const updateConfig = React.useCallback((updates: Partial<TrophyConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const isConfigured = Boolean(config.apiKey);

  const value = React.useMemo<TrophyContextValue>(
    () => ({
      config,
      user,
      setUser,
      updateConfig,
      isConfigured,
    }),
    [config, user, setUser, updateConfig, isConfigured],
  );

  return (
    <TrophyContext.Provider value={value}>{children}</TrophyContext.Provider>
  );
}

// Hook
function useTrophy(): TrophyContextValue {
  const context = React.useContext(TrophyContext);
  if (!context) {
    throw new Error("useTrophy must be used within a TrophyProvider");
  }
  return context;
}

// Optional hook that returns null if not in provider
function useTrophyOptional(): TrophyContextValue | null {
  return React.useContext(TrophyContext);
}

// Hook for current user
function useTrophyUser(): TrophyUser | null {
  const context = useTrophyOptional();
  return context?.user ?? null;
}

// Hook to check if user matches current user
function useIsCurrentUser(userId: string): boolean {
  const user = useTrophyUser();
  return user?.id === userId;
}

export {
  TrophyProvider,
  TrophyContext,
  useTrophy,
  useTrophyOptional,
  useTrophyUser,
  useIsCurrentUser,
};
export type {
  TrophyProviderProps,
  TrophyContextValue,
  TrophyConfig,
  TrophyUser,
};
