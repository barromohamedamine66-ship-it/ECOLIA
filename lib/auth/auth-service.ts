/**
 * ÉCOLIA SaaS - Service d'Authentification Supabase Auth & Profils
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database, UserRole } from '../supabase/types';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface AuthState {
  user: any | null;
  profile: ProfileRow | null;
  role: UserRole | null;
  schoolId: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

/**
 * Connexion avec email et mot de passe via Supabase Auth
 */
export async function signIn(email: string, password: string): Promise<{
  data: { user: any; profile: ProfileRow | null } | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Supabase n\'est pas encore configuré avec des clés réelles. Utilisez le mode démo ou configurez votre fichier .env.local.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data.user) {
      return { data: null, error: 'Identifiants invalides' };
    }

    // Récupérer le profil réel depuis la table profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn('Profil introuvable pour l\'utilisateur:', profileError.message);
    }

    return {
      data: {
        user: data.user,
        profile: profile || null,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message || 'Erreur lors de la connexion' };
  }
}

/**
 * Déconnexion Supabase Auth
 */
export async function signOut(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

/**
 * Récupérer la session et le profil actif
 */
export async function getActiveProfile(): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (err) {
    console.error('Erreur getActiveProfile:', err);
    return null;
  }
}

/**
 * Réinitialisation du mot de passe
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Service disponible uniquement avec Supabase configuré.' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
  });

  return { error: error ? error.message : null };
}
