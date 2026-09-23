import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "customer" | "admin" | "driver";

export interface DemoUser {
  name: string;
  phone: string;
  email: string;
  role: Role;
  city?: string | undefined;
  district?: string | undefined;
}

interface AuthValue {
  user: DemoUser | null;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);
const STORAGE_KEY = "wazeer-user";

export const roleLabel: Record<Role, string> = {
  customer: "عميل",
  admin: "مدير",
  driver: "مندوب توصيل",
};

export const roleHome: Record<Role, string> = {
  customer: "/account",
  admin: "/admin",
  driver: "/driver",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as DemoUser);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      signIn: (u) => {
        setUser(u);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        } catch {
          /* ignore */
        }
      },
      signOut: () => {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
