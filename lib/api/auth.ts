import { supabase } from '@/lib/supabase';
import type { SignInData, SignUpData, User } from '@/type';

export async function signIn(params: SignInData): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
    });

    if (error) throw error;

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (userError) throw userError;
    return userData;
}

export async function signUp(params: SignUpData): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    const { error: profileError } = await supabase
        .from('users')
        .insert({
            id: data.user.id,
            email: params.email,
            name: params.name,
            role: params.role,
            default_location_id: params.defaultLocationId || null,
        });

    if (profileError) throw profileError;

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (userError) throw userError;
    return userData;
}

export async function signOut(): Promise<void> {
    await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) return null;
    return data;
}