/**
 * ÉCOLIA SaaS - Service Types de Frais (Inscription, Scolarité, Uniforme, Cantine...)
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type FeeTypeRow = Database['public']['Tables']['fee_types']['Row'];
export type FeeTypeInsert = Database['public']['Tables']['fee_types']['Insert'];

export async function getFeeTypes(academicYearId?: string): Promise<{ data: FeeTypeRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    let query = supabase.from('fee_types').select('*').order('name', { ascending: true });
    if (academicYearId) query = query.eq('academic_year_id', academicYearId);

    const { data, error } = await query;
    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoFees: FeeTypeRow[] = [
    {
      id: 'fee-01',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Frais d\'Inscription & Dossier',
      category: 'INSCRIPTION',
      amount: 50000,
      is_mandatory: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'fee-02',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Scolarité Annuelle (Collège - 3e)',
      category: 'SCOLARITE',
      amount: 200000,
      is_mandatory: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'fee-03',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Paquetage Tenue & Uniforme Officiel',
      category: 'UNIFORME',
      amount: 35000,
      is_mandatory: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'fee-04',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Service Cantine Scolaire (Annuel)',
      category: 'CANTINE',
      amount: 120000,
      is_mandatory: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'fee-05',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Transport Scolaire (Ligne Cocody - Riviera)',
      category: 'TRANSPORT',
      amount: 150000,
      is_mandatory: false,
      created_at: new Date().toISOString(),
    },
  ];

  return { data: demoFees, error: null, source: 'DEMO_STORE' };
}

export async function createFeeType(fee: FeeTypeInsert): Promise<{ data: FeeTypeRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('fee_types')
      .insert([fee])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `fee-${Date.now()}`,
      school_id: fee.school_id,
      academic_year_id: fee.academic_year_id,
      name: fee.name,
      category: fee.category,
      amount: fee.amount,
      is_mandatory: fee.is_mandatory ?? true,
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
