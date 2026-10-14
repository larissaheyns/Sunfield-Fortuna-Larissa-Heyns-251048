import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // false until we know if someone is logged in

  useEffect(() => {
    api("/auth/me").then((r) => setUser(r.user)).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);

  const post = async (path, body) => {
    const r = await api(path, { method: "POST", body: JSON.stringify(body) });
    setUser(r.user);
  };

  const value = {
    user, ready, setUser,
    login: (body) => post("/auth/login", body),
    register: (body) => post("/auth/register", body),
    logout: async () => { await api("/auth/logout", { method: "POST" }).catch(() => {}); setUser(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
