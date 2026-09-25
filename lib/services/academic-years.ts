/**
 * ÉCOLIA SaaS - Service Années Scolaires (Supabase + Fallback)
 * Règle d'or : Une seule année active par établissement
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type AcademicYearRow = Database['public']['Tables']['academic_years']['Row'];
export type AcademicYearInsert = Database['public']['Tables']['academic_years']['Insert'];

export async function getAcademicYears(): Promise<{ data: AcademicYearRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .order('name', { ascending: false });

    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoYears: AcademicYearRow[] = [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: '2026-2027',
      start_date: '2026-09-07',
      end_date: '2027-06-25',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: '2025-2026',
      start_date: '2025-09-08',
      end_date: '2026-06-26',
      status: 'ARCHIVED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  return { data: demoYears, error: null, source: 'DEMO_STORE' };
}

export async function createAcademicYear(year: AcademicYearInsert): Promise<{ data: AcademicYearRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    // Si la nouvelle année est ACTIVE, passer les autres en ARCHIVED
    if (year.status === 'ACTIVE') {
      await supabase
        .from('academic_years')
        .update({ status: 'ARCHIVED' })
        .eq('school_id', year.school_id)
        .eq('status', 'ACTIVE');
    }

    const { data, error } = await supabase
      .from('academic_years')
      .insert([year])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `yr-${Date.now()}`,
      school_id: year.school_id,
      name: year.name,
      start_date: year.start_date,
      end_date: year.end_date,
      status: year.status || 'DRAFT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    error: null,
  };
}

export async function activateAcademicYear(id: string, schoolId: string): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    // 1. Désactiver toutes les autres
    await supabase
      .from('academic_years')
      .update({ status: 'ARCHIVED' })
      .eq('school_id', schoolId);

    // 2. Activer la sélectionnée
    const { error } = await supabase
      .from('academic_years')
      .update({ status: 'ACTIVE' })
      .eq('id', id);

    return { success: !error, error: error ? error.message : null };
  }

  return { success: true, error: null };
}
