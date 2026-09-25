/**
 * ÉCOLIA SaaS - Service Classes & Effectifs
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type ClassRow = Database['public']['Tables']['classes']['Row'];
export type ClassInsert = Database['public']['Tables']['classes']['Insert'];

export async function getClasses(academicYearId?: string): Promise<{ data: ClassRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    let query = supabase
      .from('classes')
      .select('*')
      .order('name', { ascending: true });

    if (academicYearId) {
      query = query.eq('academic_year_id', academicYearId);
    }

    const { data, error } = await query;
    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoClasses: ClassRow[] = [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'CM2 A',
      level: 'Primaire',
      series: null,
      room_name: 'Bâtiment Primaire - Salle 05',
      capacity: 40,
      head_teacher_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: '6e A',
      level: 'Collège',
      series: null,
      room_name: 'Bâtiment A - Salle 101',
      capacity: 45,
      head_teacher_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: '6e B',
      level: 'Collège',
      series: null,
      room_name: 'Bâtiment A - Salle 102',
      capacity: 45,
      head_teacher_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000006',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: '3e A',
      level: 'Collège',
      series: null,
      room_name: 'Bâtiment B - Salle 204',
      capacity: 45,
      head_teacher_id: 'usr-tea-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e0000000-0000-0000-0000-000000000007',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Terminale D',
      level: 'Lycée',
      series: 'D (Scientifique)',
      room_name: 'Bâtiment C - Salle 302',
      capacity: 40,
      head_teacher_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  return { data: demoClasses, error: null, source: 'DEMO_STORE' };
}

export async function createClass(cls: ClassInsert): Promise<{ data: ClassRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('classes')
      .insert([cls])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `cls-${Date.now()}`,
      school_id: cls.school_id,
      academic_year_id: cls.academic_year_id,
      name: cls.name,
      level: cls.level,
      series: cls.series || null,
      room_name: cls.room_name || null,
      capacity: cls.capacity || 40,
      head_teacher_id: cls.head_teacher_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    error: null,
  };
}
