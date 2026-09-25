/**
 * ÉCOLIA SaaS - Service Matières & Coefficients
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type SubjectRow = Database['public']['Tables']['subjects']['Row'];
export type SubjectInsert = Database['public']['Tables']['subjects']['Insert'];

export async function getSubjects(): Promise<{ data: SubjectRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name', { ascending: true });

    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoSubjects: SubjectRow[] = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Mathématiques',
      code: 'MATH',
      category: 'Scientifique',
      default_coefficient: 4.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Français & Expression',
      code: 'FR',
      category: 'Littéraire',
      default_coefficient: 4.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Physique - Chimie',
      code: 'SP',
      category: 'Scientifique',
      default_coefficient: 3.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Sciences de la Vie et de la Terre',
      code: 'SVT',
      category: 'Scientifique',
      default_coefficient: 2.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000005',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Histoire - Géographie',
      code: 'HG',
      category: 'Littéraire',
      default_coefficient: 3.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000006',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Anglais (LV1)',
      code: 'ANG',
      category: 'Langues',
      default_coefficient: 3.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000007',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Éducation Physique & Sportive',
      code: 'EPS',
      category: 'Sport',
      default_coefficient: 2.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000008',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Philosophie',
      code: 'PHILO',
      category: 'Littéraire',
      default_coefficient: 3.0,
      created_at: new Date().toISOString(),
    }
  ];

  return { data: demoSubjects, error: null, source: 'DEMO_STORE' };
}

export async function createSubject(subject: SubjectInsert): Promise<{ data: SubjectRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `sub-${Date.now()}`,
      school_id: subject.school_id,
      name: subject.name,
      code: subject.code,
      category: subject.category || null,
      default_coefficient: subject.default_coefficient || 2.0,
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
