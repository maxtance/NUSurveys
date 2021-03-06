import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../lib/client";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const navigate = useNavigate();

  const [change, setChange] = useState(false);

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

        if (error) {
          navigate("/error");
        }

        setUserInfo(users[0] ?? null);
        setUserInfoLoading(false);

        setUser(session?.user ?? null);
        setUserLoading(false);
      }
    );
    //console.log("checking");

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
        navigate("/error");
      }
      //console.log("setting user info");
      setUserInfo(users[0]);
      setUserInfoLoading(false);
    };

    fetchUserInfo();
  }, [change]);

  const value = {
    signUp: (data) => supabaseClient.auth.signUp(data),
    signIn: (data) => supabaseClient.auth.signIn(data),
    signOut: () => supabaseClient.auth.signOut(),
    user,
    userInfo,
    setChange,
  };

  return (
    <AuthContext.Provider value={value}>
      {!userLoading && !userInfoLoading && children}
    </AuthContext.Provider>
  );
}
