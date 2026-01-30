import { supabase } from '@/lib/supabase';
import type { AuthStore, CreateUserParams, SignInParams, User } from '@/types';
import { create } from 'zustand';

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    isLoading: true,

    //sign in
    signIn: async (params: SignInParams) => {
        const { email, password } = params;
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
    });

    if (error) throw error;

    // Fetch user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    set({ user: userData as User, session: data.session });
  },

    // Sign Up
    signUp: async (params: CreateUserParams) => {
        const { email, password, name, role } = params;

        // 1. Create auth user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    // 2. Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        name,
        role,
      });

    if (profileError) throw profileError;

    // 3. Fetch the created user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    set({ user: userData as User, session: data.session });
  },

    // Sign Out
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
  },

    // Fetch Authenticated User
    fetchAuthenticatedUser: async () => {
        set({ isLoading: true });

    try {
      // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
            set({ user: null, session: null, isLoading: false });
            return;
      }

        // Fetch user profile
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (userError) throw userError;

        set({ user: userData as User, session, isLoading: false });
    } catch (e) {
      console.log('fetchAuthenticatedUser error:', e);
      set({ user: null, session: null, isLoading: false });
    }
  },
    
}));

export default useAuthStore;