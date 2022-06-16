import React, { useContext, useState, useEffect } from "react";
import { supabaseClient } from "../lib/client";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(supabaseClient.auth.user());
  const [userLoading, setUserLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  useEffect(() => {
    const session = supabaseClient.auth.session();

    setUser(session?.user ?? null);
    setUserLoading(false);

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setUserLoading(false);
      }
    );

    // fetching the userInfo from users table
    // Problem? every re render of page will fetch info
    const fetchUserInfo = async () => {
      const userEmail = session?.user.email;
      const { data: users, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("email", userEmail);
      if (error) {
        console.log(error);
      }
      setUserInfo(users[0]);
      setUserInfoLoading(false);
    };

    fetchUserInfo();

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabaseClient.auth.signUp(data),
    signIn: (data) => supabaseClient.auth.signIn(data),
    signOut: () => supabaseClient.auth.signOut(),
    user,
    userInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!userLoading && !userInfoLoading && children}
    </AuthContext.Provider>
  );
}
