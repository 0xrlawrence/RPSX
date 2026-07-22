"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, db, isFirebaseConfigured } from "./firebase";
import type { UserProfile } from "./types";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  configured: false,
  refreshProfile: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(u: User | null) {
    if (!u) {
      setProfile(null);
      return;
    }
    const snap = await getDoc(doc(db(), "users", u.uid));
    setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(firebaseAuth(), async (u) => {
      setUser(u);
      try {
        await loadProfile(u);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        configured: isFirebaseConfigured,
        refreshProfile: () => loadProfile(user),
        logout: async () => {
          await signOut(firebaseAuth());
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
