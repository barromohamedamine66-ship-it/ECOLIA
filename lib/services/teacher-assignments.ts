/**
 * ÉCOLIA SaaS - Service Affectations Enseignants (Classes + Matières)
 * Détermine les droits pédagogiques du professeur
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type TeacherAssignmentRow = Database['public']['Tables']['teacher_assignments']['Row'];
export type TeacherAssignmentInsert = Database['public']['Tables']['teacher_assignments']['Insert'];

export async function getTeacherAssignments(teacherProfileId?: string): Promise<{ data: TeacherAssignmentRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    let query = supabase.from('teacher_assignments').select('*');
    if (teacherProfileId) {
      query = query.eq('teacher_profile_id', teacherProfileId);
    }
    const { data, error } = await query;
    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoAssignments: TeacherAssignmentRow[] = [
    {
      id: 'asg-01',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      teacher_profile_id: 'usr-tea-01', // M. KOFFI Yao
      class_id: 'e0000000-0000-0000-0000-000000000006', // 3e A
      subject_id: 'd0000000-0000-0000-0000-000000000001', // Mathématiques
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      created_at: new Date().toISOString(),
    },
    {
      id: 'asg-02',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      teacher_profile_id: 'usr-tea-01',
      class_id: 'e0000000-0000-0000-0000-000000000007', // Terminale D
      subject_id: 'd0000000-0000-0000-0000-000000000001', // Mathématiques
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      created_at: new Date().toISOString(),
    }
  ];

  const filtered = teacherProfileId ? demoAssignments.filter(a => a.teacher_profile_id === teacherProfileId) : demoAssignments;
  return { data: filtered, error: null, source: 'DEMO_STORE' };
}

export async function createTeacherAssignment(assignment: TeacherAssignmentInsert): Promise<{ data: TeacherAssignmentRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('teacher_assignments')
      .insert([assignment])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `asg-${Date.now()}`,
      school_id: assignment.school_id,
      teacher_profile_id: assignment.teacher_profile_id,
      class_id: assignment.class_id,
      subject_id: assignment.subject_id,
      academic_year_id: assignment.academic_year_id,
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
