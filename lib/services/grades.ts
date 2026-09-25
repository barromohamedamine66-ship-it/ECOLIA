/**
 * ÉCOLIA SaaS - Service Notes & Workflow de Validation Pédagogique
 * Workflow : DRAFT -> SUBMITTED -> VALIDATED
 */

import { supabase, isSupabaseConfigured, isProductionEnv } from '../supabase/client';
import type { Database, GradeValidationStatus } from '../supabase/types';

export type GradeRow = Database['public']['Tables']['grades']['Row'];
export type GradeInsert = Database['public']['Tables']['grades']['Insert'];

export interface GradeInput {
  studentId: string;
  studentName?: string;
  matricule?: string;
  score: number | null;
  isAbsent?: boolean;
  teacherComment?: string;
}

export async function getGradesForAssessment(assessmentId: string): Promise<{ data: GradeRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: [], error: 'CRITICAL: Supabase non configuré en environnement de production.', source: 'SUPABASE' };
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoGrades: GradeRow[] = [
    {
      id: 'grd-01',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      assessment_id: assessmentId,
      student_id: 'stu-2026-001', // Mohamed Traoré
      score: 16.5,
      is_absent: false,
      teacher_comment: 'Excellente maîtrise du sujet.',
      status: 'VALIDATED',
      validated_by_profile_id: 'usr-dir-01',
      validated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'grd-02',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      assessment_id: assessmentId,
      student_id: 'stu-2026-004', // Kouassi Ange
      score: 14.0,
      is_absent: false,
      teacher_comment: 'Bon travail.',
      status: 'VALIDATED',
      validated_by_profile_id: 'usr-dir-01',
      validated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'grd-03',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      assessment_id: assessmentId,
      student_id: 'stu-2026-005', // Bamba Yasmine
      score: 11.5,
      is_absent: false,
      teacher_comment: 'Passable, doit approfondir.',
      status: 'SUBMITTED',
      validated_by_profile_id: null,
      validated_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  return { data: demoGrades, error: null, source: 'DEMO_STORE' };
}

/**
 * Enregistrement en masse des notes d'une évaluation
 */
export async function saveGradesBatch(
  assessmentId: string,
  schoolId: string,
  grades: GradeInput[],
  targetStatus: GradeValidationStatus = 'DRAFT'
): Promise<{ success: boolean; count: number; error: string | null }> {
  if (isSupabaseConfigured()) {
    const rows: GradeInsert[] = grades.map(g => ({
      school_id: schoolId,
      assessment_id: assessmentId,
      student_id: g.studentId,
      score: g.isAbsent ? null : (g.score !== null ? Math.max(0, Math.min(20, g.score)) : null),
      is_absent: Boolean(g.isAbsent),
      teacher_comment: g.teacherComment || null,
      status: targetStatus,
    }));

    const { error } = await supabase
      .from('grades')
      .upsert(rows, { onConflict: 'assessment_id, student_id' });

    if (error) {
      console.error('Erreur sauvegarde notes:', error.message);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: rows.length, error: null };
  }

  return { success: true, count: grades.length, error: null };
}

/**
 * Validation définitive des notes par la Direction (interdiction de modification ultérieure sans audit)
 */
export async function validateAssessmentGrades(
  assessmentId: string,
  validatorProfileId: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('grades')
      .update({
        status: 'VALIDATED',
        validated_by_profile_id: validatorProfileId,
        validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('assessment_id', assessmentId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  }

  return { success: true, error: null };
}
