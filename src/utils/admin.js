import { supabase } from '../supabase';

export async function fetchUserRole(user) {
  if (!user?.email) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', user.email)
    .maybeSingle();

  if (error) {
    console.warn('Failed to fetch user role:', error.message);
    return null;
  }

  return data?.role ?? null;
}
