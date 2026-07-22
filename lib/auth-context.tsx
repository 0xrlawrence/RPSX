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
import {
  DEMO_MODE,
  currentDemoRole,
  demoProfile,
  demoSignOut,
} from "./demo";
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

  function loadDemoSession() {
    const role = currentDemoRole();
    if (!role) {
      setUser(null);
      setProfile(null);
      return;
    }
    const p = demoProfile(role);
    setProfile(p);
    setUser({
      uid: p.uid,
      email: p.email,
      displayName: p.displayName,
    } as unknown as User);
  }

  useEffect(() => {
    // TEMPORARY guest access: sessions come from localStorage, not Firebase.
    if (DEMO_MODE) {
      loadDemoSession();
      setLoading(false);
      return;
    }
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
        configured: DEMO_MODE || isFirebaseConfigured,
        refreshProfile: async () => {
          if (DEMO_MODE) {
            loadDemoSession();
            return;
          }
          await loadProfile(user);
        },
        logout: async () => {
          if (DEMO_MODE) {
            demoSignOut();
            window.location.href = "/";
            return;
          }
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
