/**
 * ÉCOLIA SaaS - Service de Gestion des Élèves (Data Access Layer)
 * Connecté directement à PostgreSQL / Supabase avec respect strict de school_id et RLS
 */

import { supabase, isSupabaseConfigured, isProductionEnv } from '../supabase/client';
import type { Database } from '../supabase/types';

export type StudentRow = Database['public']['Tables']['students']['Row'];
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export interface StudentFilter {
  classId?: string;
  search?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'TRANSFERRED' | 'EXPELLED';
  page?: number;
  pageSize?: number;
}

export interface StudentServiceResponse<T> {
  data: T | null;
  count?: number;
  error: string | null;
  source: 'SUPABASE' | 'DEMO_STORE';
}

/**
 * Récupère la liste des élèves pour l'établissement de l'utilisateur connecté
 */
export async function getStudents(
  filters: StudentFilter = {}
): Promise<StudentServiceResponse<StudentRow[]>> {
  const { search, status = 'ACTIVE', page = 1, pageSize = 20 } = filters;

  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: null, count: 0, error: 'CRITICAL: Supabase non configuré en environnement de production.', source: 'SUPABASE' };
  }


  // 1. Mode Connecté Supabase
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('status', status)
        .order('last_name', { ascending: true });

      if (search && search.trim() !== '') {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,matricule.ilike.%${search}%`
        );
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Erreur Supabase getStudents:', error.message);
        return { data: null, count: 0, error: error.message, source: 'SUPABASE' };
      }

      return {
        data: data || [],
        count: count || 0,
        error: null,
        source: 'SUPABASE',
      };
    } catch (err: any) {
      console.error('Exception getStudents Supabase:', err);
      return { data: null, count: 0, error: err.message, source: 'SUPABASE' };
    }
  }

  // 2. Mode Démo / Fallback
  if (typeof window !== 'undefined') {
    const rawData = localStorage.getItem('ECOLIA_SAAS_DATABASE_V1');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        let list = (parsed.students || []).map((s: any) => ({
          id: s.id,
          school_id: parsed.school?.id || 'sch-horizon-001',
          matricule: s.matricule,
          first_name: s.first_name,
          last_name: s.last_name,
          gender: s.gender as 'M' | 'F',
          birth_date: s.birth_date,
          birth_place: s.birth_place || 'Abidjan',
          nationality: s.nationality || 'Ivoirienne',
          address: s.address || '',
          phone: s.parent_phone || '',
          photo_url: s.photo_url || null,
          status: 'ACTIVE' as const,
          conduct_notes: s.conduct || null,
          medical_notes: s.medical_notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        if (search) {
          const q = search.toLowerCase();
          list = list.filter(
            (s: any) =>
              s.first_name.toLowerCase().includes(q) ||
              s.last_name.toLowerCase().includes(q) ||
              s.matricule.toLowerCase().includes(q)
          );
        }

        return {
          data: list,
          count: list.length,
          error: null,
          source: 'DEMO_STORE',
        };
      } catch (e) {
        console.error('Erreur lecture demo store:', e);
      }
    }
  }

  return { data: [], count: 0, error: null, source: 'DEMO_STORE' };
}

/**
 * Récupère un élève par son ID
 */
export async function getStudent(
  id: string
): Promise<StudentServiceResponse<StudentRow>> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message, source: 'SUPABASE' };
    }
    return { data, error: null, source: 'SUPABASE' };
  }

  // Démo
  const res = await getStudents();
  const found = res.data?.find((s) => s.id === id) || null;
  return { data: found, error: found ? null : 'Élève non trouvé', source: 'DEMO_STORE' };
}

/**
 * Création d'un élève avec génération du matricule
 */
export async function createStudent(
  student: Omit<StudentInsert, 'id' | 'created_at' | 'updated_at'>
): Promise<StudentServiceResponse<StudentRow>> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message, source: 'SUPABASE' };
    }
    return { data, error: null, source: 'SUPABASE' };
  }

  // Démo Store
  const newStudent: StudentRow = {
    ...student,
    id: `stu-${Date.now()}`,
    birth_place: student.birth_place || null,
    address: student.address || null,
    phone: student.phone || null,
    photo_url: student.photo_url || null,
    status: student.status || 'ACTIVE',
    conduct_notes: student.conduct_notes || null,
    medical_notes: student.medical_notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { data: newStudent, error: null, source: 'DEMO_STORE' };
}

/**
 * Modification d'un élève
 */
export async function updateStudent(
  id: string,
  updates: StudentUpdate
): Promise<StudentServiceResponse<StudentRow>> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('students')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message, source: 'SUPABASE' };
    }
    return { data, error: null, source: 'SUPABASE' };
  }

  return { data: null, error: 'Mis à jour en mode démo', source: 'DEMO_STORE' };
}

/**
 * Archivage d'un élève
 */
export async function archiveStudent(
  id: string
): Promise<StudentServiceResponse<boolean>> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('students')
      .update({ status: 'ARCHIVED', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { data: false, error: error.message, source: 'SUPABASE' };
    }
    return { data: true, error: null, source: 'SUPABASE' };
  }

  return { data: true, error: null, source: 'DEMO_STORE' };
}
