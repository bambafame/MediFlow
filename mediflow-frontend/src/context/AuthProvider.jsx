import { useState } from "react";

import { login as loginRequest } from "../services/authService";

import AuthContext from "./authContext";

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("mediflow_auth");

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("mediflow_auth");

      return null;
    }
  });

  const login = async (username, password) => {
    const response = await loginRequest({
      username,
      password,
    });

    const authData = {
      token: response.token,

      tokenType: response.tokenType,

      expiresIn: response.expiresIn,

      userId: response.userId,

      username: response.username,

      role: response.role,
    };

    localStorage.setItem("mediflow_auth", JSON.stringify(authData));

    setAuth(authData);

    return authData;
  };

  const logout = () => {
    localStorage.removeItem("mediflow_auth");

    setAuth(null);
  };

  const isAuthenticated = Boolean(auth?.token);

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
