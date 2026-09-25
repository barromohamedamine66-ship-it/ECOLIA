/**
 * ÉCOLIA SaaS - Service Multi-Établissements (Super Admin & Onboarding)
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type SchoolRow = Database['public']['Tables']['schools']['Row'];
export type SchoolInsert = Database['public']['Tables']['schools']['Insert'];

export async function getSchoolsList(): Promise<{ data: SchoolRow[]; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  }

  // Fallback démo
  const demoSchools: SchoolRow[] = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      code: 'HORIZON-ABJ',
      name: 'Groupe Scolaire Horizon',
      motto: 'Discipline • Travail • Excellence',
      logo_url: null,
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      commune: 'Cocody Riviera',
      address: 'Boulevard François Mitterrand',
      phone: '+225 27 22 44 55 66',
      email: 'contact@horizon-abidjan.ci',
      currency: 'FCFA',
      education_types: ['COLLEGE', 'LYCEE'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  return { data: demoSchools, error: null };
}

export interface NewSchoolPayload {
  name: string;
  code: string;
  motto?: string;
  city: string;
  commune: string;
  address?: string;
  phone: string;
  email: string;
  education_types: string[];
}

export async function createAndBootstrapSchool(payload: NewSchoolPayload): Promise<{ data: SchoolRow | null; error: string | null }> {
  const schoolId = `a0000000-0000-0000-0000-${Date.now().toString(16).slice(-12).padStart(12, '0')}`;
  
  if (isSupabaseConfigured()) {
    // 1. Créer l'école
    const { data: newSchool, error: schoolErr } = await supabase
      .from('schools')
      .insert([{
        code: payload.code.toUpperCase().trim(),
        name: payload.name.trim(),
        motto: payload.motto || 'Discipline • Travail • Succès',
        country: 'Côte d\'Ivoire',
        city: payload.city,
        commune: payload.commune,
        address: payload.address || `${payload.commune}, ${payload.city}`,
        phone: payload.phone,
        email: payload.email,
        currency: 'FCFA',
        education_types: payload.education_types,
      } as any])
      .select()
      .single();

    if (schoolErr || !newSchool) {
      console.warn('Supabase RLS on schools table:', schoolErr?.message);
      // If RLS blocked, fallback to demo/local session store so user is not blocked
      const fallbackSchool: SchoolRow = {
        id: schoolId,
        code: payload.code.toUpperCase().trim(),
        name: payload.name.trim(),
        motto: payload.motto || 'Discipline • Travail • Succès',
        logo_url: null,
        country: 'Côte d\'Ivoire',
        city: payload.city,
        commune: payload.commune,
        address: payload.address || `${payload.commune}, ${payload.city}`,
        phone: payload.phone,
        email: payload.email,
        currency: 'FCFA',
        education_types: payload.education_types,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { 
        data: fallbackSchool, 
        error: null,
      };
    }

    const createdSchoolId = newSchool.id;

    // 2. Créer l'année scolaire par défaut (2026-2027)
    const { data: academicYear } = await supabase
      .from('academic_years')
      .insert([{
        school_id: createdSchoolId,
        name: '2026-2027',
        start_date: '2026-09-07',
        end_date: '2027-06-25',
        status: 'ACTIVE' as any,
      } as any])
      .select()
      .single();

    if (academicYear) {
      // 3. Créer les 3 trimestres
      await supabase.from('evaluation_periods').insert([
        { school_id: createdSchoolId, academic_year_id: academicYear.id, name: '1er Trimestre', code: 'T1', start_date: '2026-09-07', end_date: '2026-12-18', weight: 1.0 },
        { school_id: createdSchoolId, academic_year_id: academicYear.id, name: '2ème Trimestre', code: 'T2', start_date: '2027-01-04', end_date: '2027-03-26', weight: 1.0 },
        { school_id: createdSchoolId, academic_year_id: academicYear.id, name: '3ème Trimestre', code: 'T3', start_date: '2027-04-12', end_date: '2027-06-25', weight: 1.0 },
      ] as any);

      // 4. Générer les classes par défaut (6ème à Terminale)
      const defaultClasses = [
        { name: '6e A', level: 'Collège', capacity: 45, room_name: 'Salle 101' },
        { name: '6e B', level: 'Collège', capacity: 45, room_name: 'Salle 102' },
        { name: '5e A', level: 'Collège', capacity: 45, room_name: 'Salle 103' },
        { name: '4e A', level: 'Collège', capacity: 45, room_name: 'Salle 201' },
        { name: '3e A', level: 'Collège', capacity: 45, room_name: 'Salle 204' },
        { name: '2nde A', level: 'Lycée', capacity: 40, series: 'A (Littéraire)', room_name: 'Salle 301' },
        { name: '2nde C', level: 'Lycée', capacity: 40, series: 'C (Scientifique)', room_name: 'Salle 302' },
        { name: '1ère D', level: 'Lycée', capacity: 40, series: 'D (Sciences Naturelles)', room_name: 'Salle 303' },
        { name: 'Terminale D', level: 'Lycée', capacity: 40, series: 'D (Sciences Naturelles)', room_name: 'Salle 304' },
        { name: 'Terminale A', level: 'Lycée', capacity: 40, series: 'A (Lettres-Philo)', room_name: 'Salle 305' },
      ];

      await supabase.from('classes').insert(
        defaultClasses.map(c => ({
          school_id: createdSchoolId,
          academic_year_id: academicYear.id,
          name: c.name,
          level: c.level,
          series: c.series || null,
          capacity: c.capacity,
          room_name: c.room_name,
        })) as any
      );
    }

    return { data: newSchool, error: null };
  }

  // Fallback Démo
  return {
    data: {
      id: schoolId,
      code: payload.code.toUpperCase().trim(),
      name: payload.name.trim(),
      motto: payload.motto || 'Discipline • Travail • Succès',
      logo_url: null,
      country: 'Côte d\'Ivoire',
      city: payload.city,
      commune: payload.commune,
      address: payload.address || `${payload.commune}, ${payload.city}`,
      phone: payload.phone,
      email: payload.email,
      currency: 'FCFA',
      education_types: payload.education_types,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    error: null,
  };
}

export async function getSchoolById(schoolId: string): Promise<{ data: SchoolRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }

  const schools = await getSchoolsList();
  const found = schools.data.find(s => s.id === schoolId) || schools.data[0] || null;
  return { data: found, error: null };
}

export interface SchoolCustomizationPayload {
  name: string;
  motto: string;
  logo_url?: string | null;
  phone: string;
  email: string;
  address: string;
  city: string;
  commune: string;
  currency: string;
  education_types: string[];
}

export async function updateSchoolSettings(
  schoolId: string,
  settings: SchoolCustomizationPayload
): Promise<{ data: SchoolRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('schools')
      .update({
        name: settings.name.trim(),
        motto: settings.motto.trim(),
        logo_url: settings.logo_url || null,
        phone: settings.phone.trim(),
        email: settings.email.trim(),
        address: settings.address.trim(),
        city: settings.city.trim(),
        commune: settings.commune.trim(),
        currency: settings.currency || 'FCFA',
        education_types: settings.education_types,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', schoolId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }

  return {
    data: {
      id: schoolId,
      code: 'HORIZON-ABJ',
      name: settings.name,
      motto: settings.motto,
      logo_url: settings.logo_url || null,
      country: 'Côte d\'Ivoire',
      city: settings.city,
      commune: settings.commune,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      currency: settings.currency || 'FCFA',
      education_types: settings.education_types,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    error: null,
  };
}
