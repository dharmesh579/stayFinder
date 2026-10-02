import { createContext, useState, useEffect } from "react";

import { getProfile } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setUser(data.data);
      } catch (e) {
        setUser(null);
        console.log(e);
      }
    }
    fetchProfile();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
