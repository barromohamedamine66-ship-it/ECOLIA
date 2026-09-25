/**
 * ÉCOLIA SaaS - Service Échéanciers de Paiement par Tranches
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type PaymentScheduleRow = Database['public']['Tables']['payment_schedules']['Row'];
export type PaymentScheduleInsert = Database['public']['Tables']['payment_schedules']['Insert'];

export async function getPaymentSchedules(academicYearId?: string): Promise<{ data: PaymentScheduleRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    let query = supabase.from('payment_schedules').select('*').order('due_date', { ascending: true });
    if (academicYearId) query = query.eq('academic_year_id', academicYearId);

    const { data, error } = await query;
    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoSchedules: PaymentScheduleRow[] = [
    {
      id: 'sch-01',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      class_id: null,
      title: 'Inscription & Frais de Dossier',
      tranche_number: 0,
      amount: 50000,
      due_date: '2026-09-15',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sch-02',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      class_id: null,
      title: '1ère Tranche Scolarité',
      tranche_number: 1,
      amount: 100000,
      due_date: '2026-10-31',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sch-03',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      class_id: null,
      title: '2ème Tranche Scolarité',
      tranche_number: 2,
      amount: 50000,
      due_date: '2027-01-15',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sch-04',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      class_id: null,
      title: '3ème Tranche Scolarité (Solde Final)',
      tranche_number: 3,
      amount: 50000,
      due_date: '2027-03-31',
      created_at: new Date().toISOString(),
    },
  ];

  return { data: demoSchedules, error: null, source: 'DEMO_STORE' };
}

export async function createPaymentSchedule(schedule: PaymentScheduleInsert): Promise<{ data: PaymentScheduleRow | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('payment_schedules')
      .insert([schedule])
      .select()
      .single();

    return { data, error: error ? error.message : null };
  }

  return {
    data: {
      id: `sch-${Date.now()}`,
      school_id: schedule.school_id,
      academic_year_id: schedule.academic_year_id,
      class_id: schedule.class_id || null,
      title: schedule.title,
      tranche_number: schedule.tranche_number,
      amount: schedule.amount,
      due_date: schedule.due_date,
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
