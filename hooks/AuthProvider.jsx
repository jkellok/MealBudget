import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import loginService from "../services/login";
import usersService from "../services/users";

const AuthContext = createContext({});

export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const tokenRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const userIdRef = useRef(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      tokenRef.current = token || "";
      const user = await AsyncStorage.getItem("user-id");
      userIdRef.current = user || "";
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (token, credentials) => {
    console.log("token is", token);
    console.log("credentials is", credentials);
    try {
      const user = await loginService.login(credentials);
      console.log("user is", user);
      if (user) {
        console.log("user id setting user", user.user_id);
        await AsyncStorage.setItem("token", token);
        tokenRef.current = token;
        await AsyncStorage.setItem("user-id", user.user_id.toString());
        userIdRef.current = user.user_id.toString();
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.setItem("token", "");
    tokenRef.current = null;
    await AsyncStorage.setItem("user-id", "");
    userIdRef.current = null;
    router.replace("/login");
  }, []);

  const signUp = useCallback(async (token, credentials) => {
    try {
      console.log("signing up in useAutg");
      const newUser = await usersService.createNewUser(credentials);
      console.log("new user is", newUser);
      if (!newUser) alert("Failed creating new user");
      signIn(token, credentials);
    } catch (err) {
      console.error(err);
      alert("Error registering new user", err.message);
    }
  }, [signIn]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        token: tokenRef,
        isLoading,
        userId: userIdRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}