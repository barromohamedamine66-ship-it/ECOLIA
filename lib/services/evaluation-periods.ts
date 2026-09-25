/**
 * ÉCOLIA SaaS - Service Périodes d'Évaluation (Trimestres / Semestres)
 * Entièrement configurable par établissement et année scolaire
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type EvaluationPeriodRow = Database['public']['Tables']['evaluation_periods']['Row'];
export type EvaluationPeriodInsert = Database['public']['Tables']['evaluation_periods']['Insert'];

export async function getEvaluationPeriods(academicYearId?: string): Promise<{ data: EvaluationPeriodRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    let query = supabase
      .from('evaluation_periods')
      .select('*')
      .order('start_date', { ascending: true });

    if (academicYearId) {
      query = query.eq('academic_year_id', academicYearId);
    }

    const { data, error } = await query;
    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoPeriods: EvaluationPeriodRow[] = [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: academicYearId || 'b0000000-0000-0000-0000-000000000001',
      name: '1er Trimestre',
      code: 'T1',
      start_date: '2026-09-07',
      end_date: '2026-12-18',
      weight: 1.0,
      is_locked: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: academicYearId || 'b0000000-0000-0000-0000-000000000001',
      name: '2ème Trimestre',
      code: 'T2',
      start_date: '2027-01-04',
      end_date: '2027-03-26',
      weight: 1.0,
      is_locked: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: academicYearId || 'b0000000-0000-0000-0000-000000000001',
      name: '3ème Trimestre',
      code: 'T3',
      start_date: '2027-04-12',
      end_date: '2027-06-25',
      weight: 1.0,
      is_locked: false,
      created_at: new Date().toISOString(),
    }
  ];

  return { data: demoPeriods, error: null, source: 'DEMO_STORE' };
}

export async function createEvaluationPeriod(period: EvaluationPeriodInsert): Promise<{ data: EvaluationPeriodRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('evaluation_periods')
      .insert([period])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `per-${Date.now()}`,
      school_id: period.school_id,
      academic_year_id: period.academic_year_id,
      name: period.name,
      code: period.code,
      start_date: period.start_date,
      end_date: period.end_date,
      weight: period.weight || 1.0,
      is_locked: false,
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
