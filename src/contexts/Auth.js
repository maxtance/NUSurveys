import React, { useContext, useState, useEffect } from 'react';
import { supabaseClient } from "../lib/client";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(supabaseClient.auth.user());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabaseClient.auth.session()

    setUser(session?.user ?? null)
    setLoading(false)

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  const value = {
    signUp: (data) => supabaseClient.auth.signUp(data),
    signIn: (data) => supabaseClient.auth.signIn(data),
    signOut: () => supabaseClient.auth.signOut(),
    user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}