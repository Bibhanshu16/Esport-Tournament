import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContextValue.jsx";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  const initialDecoded = initialToken ? parseJwt(initialToken) : null;

  const [user, setUser] = useState(() => {
    if (!initialToken || !initialDecoded) {
      if (initialToken && !initialDecoded) {
        localStorage.removeItem("token");
      }
      return null;
    }
    return {
      token: initialToken,
      id: initialDecoded.id,
      role: initialDecoded.role,
      emailVerified: false
    };
  });
  const [loading, setLoading] = useState(!!initialToken);

  useEffect(() => {
    if (!initialToken || !initialDecoded) {
      return;
    }

    api.get("/auth/me")
      .then((res) => {
        setUser({
          token: initialToken,
          id: initialDecoded.id,
          role: initialDecoded.role,
          emailVerified: res.data.emailVerified
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [initialToken, initialDecoded]);

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
