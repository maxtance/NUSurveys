import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabaseClient } from "../lib/client";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  useEffect(() => {
    const session = supabaseClient.auth.session();
    setUser(session?.user ?? null);
    setUserLoading(false);
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        // console.log(event);
        // console.log(session);
        const userEmail = session?.user.email;
        const { data: users, error } = await supabaseClient
          .from("users")
          .select("*")
          .eq("email", userEmail);
        setUserInfo(users[0] ?? null);
        setUserInfoLoading(false);

        setUser(session?.user ?? null);
        setUserLoading(false);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const session = supabaseClient.auth.session();
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
  }, []);

  useEffect(() => {
    const users = supabaseClient
      .from("users")
      .on("UPDATE", (payload) => {
        console.log("Received changes", payload);
      })
      .subscribe();

    console.log(users);
    console.log(supabaseClient.getSubscriptions());

    return () => supabaseClient.removeSubscription(users);
  }, []);
  supabaseClient.getSubscriptions();

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
