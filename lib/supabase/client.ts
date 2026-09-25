import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isProductionEnv = (): boolean => {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_APP_ENV === 'production'
  );
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://xyzcompany.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

export const getAppMode = (): 'PRODUCTION' | 'DEMO' => {
  if (isProductionEnv()) return 'PRODUCTION';
  return isSupabaseConfigured() ? 'PRODUCTION' : 'DEMO';
};

export const assertSupabaseConfigured = (context = 'Operation'): void => {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    throw new Error(
      `[ÉCOLIA CRITICAL ERROR] Supabase n'est pas configuré en mode PRODUCTION pour "${context}". Les fallbacks locaux sont strictement désactivés en production.`
    );
  }
};

export const createSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    if (isProductionEnv()) {
      console.error(
        '❌ [ÉCOLIA PROD ERROR] Supabase non configuré en production. Veuillez renseigner NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    } else {
      console.warn(
        '⚠️ ÉCOLIA : Supabase n\'est pas encore configuré avec des clés réelles. Mode Démo / LocalStore actif.'
      );
    }
  }
  return createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
};

export const supabase = createSupabaseClient();

