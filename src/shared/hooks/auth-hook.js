import { useCallback, useState, useEffect } from "react";
let logoutTimer;
const EXP_TIME = 1000 * 60 * 60;
export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [tokenExp, setTokenExp] = useState(null);
  const [token, setToken] = useState(null);
  const login = useCallback((uid, token, expiration) => {
    setToken(token);
    setUserId(uid);
    const expirationDate =
      expiration || new Date(new Date().getTime() + EXP_TIME);
    setTokenExp(expirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExp(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExp) {
      const remainingTime = tokenExp.getTime() - new Date();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExp, logout]);

  return { token, userId, login, logout };
};
