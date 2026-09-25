/**
 * ÉCOLIA SaaS - Service Évaluations (Devoirs, Interrogations, Examens)
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type AssessmentRow = Database['public']['Tables']['assessments']['Row'];
export type AssessmentInsert = Database['public']['Tables']['assessments']['Insert'];

export async function getAssessments(filters: { classId?: string; subjectId?: string; periodId?: string } = {}): Promise<{ data: AssessmentRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    let query = supabase.from('assessments').select('*').order('date', { ascending: false });

    if (filters.classId) query = query.eq('class_id', filters.classId);
    if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters.periodId) query = query.eq('evaluation_period_id', filters.periodId);

    const { data, error } = await query;
    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoAssessments: AssessmentRow[] = [
    {
      id: 'asm-01',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      class_id: 'e0000000-0000-0000-0000-000000000006', // 3e A
      subject_id: 'd0000000-0000-0000-0000-000000000001', // Mathématiques
      evaluation_period_id: 'c0000000-0000-0000-0000-000000000001', // T1
      teacher_profile_id: 'usr-tea-01',
      title: 'Devoir Surveillé N°1 : Théorème de Thalès & Équations',
      type: 'DEVOIR',
      date: '2026-10-15',
      max_score: 20,
      coefficient: 2.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'asm-02',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      class_id: 'e0000000-0000-0000-0000-000000000006', // 3e A
      subject_id: 'd0000000-0000-0000-0000-000000000001', // Mathématiques
      evaluation_period_id: 'c0000000-0000-0000-0000-000000000001', // T1
      teacher_profile_id: 'usr-tea-01',
      title: 'Interrogation Écrite N°1 : Calcul Littéral',
      type: 'INTERROGATION',
      date: '2026-10-28',
      max_score: 20,
      coefficient: 1.0,
      created_at: new Date().toISOString(),
    }
  ];

  let filtered = demoAssessments;
  if (filters.classId) filtered = filtered.filter(a => a.class_id === filters.classId);
  if (filters.subjectId) filtered = filtered.filter(a => a.subject_id === filters.subjectId);
  if (filters.periodId) filtered = filtered.filter(a => a.evaluation_period_id === filters.periodId);

  return { data: filtered, error: null, source: 'DEMO_STORE' };
}

export async function createAssessment(assessment: AssessmentInsert): Promise<{ data: AssessmentRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessment])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `asm-${Date.now()}`,
      school_id: assessment.school_id,
      class_id: assessment.class_id,
      subject_id: assessment.subject_id,
      evaluation_period_id: assessment.evaluation_period_id,
      teacher_profile_id: assessment.teacher_profile_id,
      title: assessment.title,
      type: assessment.type,
      date: assessment.date,
      max_score: assessment.max_score || 20,
      coefficient: assessment.coefficient || 1.0,
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
