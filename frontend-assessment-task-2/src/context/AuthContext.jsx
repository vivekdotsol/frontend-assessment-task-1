import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      let token;

      try {
        token = localStorage.getItem("accessToken");
      } catch {
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://dummyjson.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Could not restore session");
        }

        const data = await response.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);
  async function login(username, password) {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status === 400) {
      throw new Error("Invalid username or password");
    }

    if (!response.ok) {
      throw new Error("Login failed. Please try again.");
    }

    const data = await response.json();

    try {
      localStorage.setItem("accessToken", data.accessToken);
    } catch {
      throw new Error("Could not save your login session");
    }

    setUser(data);
  }

  function logout() {
    try {
      localStorage.removeItem("accessToken");
    } catch {}

    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
