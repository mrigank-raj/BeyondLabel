import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Generate a simple UUID v4 for the guest ID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize Guest Mode
    let currentGuestId = localStorage.getItem('beyondlabel_guest_id');
    if (!currentGuestId) {
      currentGuestId = generateUUID();
      localStorage.setItem('beyondlabel_guest_id', currentGuestId);
    }
    setGuestId(currentGuestId);

    // 2. Check for authenticated user
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    guestId,
    loading,
    isGuest: !user,
    signInWithGoogle: async () => {
      if (!supabase) return alert("Supabase not configured");
      return supabase.auth.signInWithOAuth({ provider: 'google' });
    },
    signOut: async () => {
      if (!supabase) return;
      return supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
