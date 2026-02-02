import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded) {
      localStorage.removeItem("token");
      setLoading(false);
      return;
    }

    // 🔥 FETCH FULL USER FROM BACKEND
    api.get("/auth/me")
      .then(res => {
        setUser({
          token,
          id: decoded.id,
          role: decoded.role,
          emailVerified: res.data.emailVerified
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);

    const res = await api.get("/auth/me");

    setUser({
      token,
      id: decoded.id,
      role: decoded.role,
      emailVerified: res.data.emailVerified
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};