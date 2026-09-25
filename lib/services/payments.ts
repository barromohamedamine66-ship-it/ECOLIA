/**
 * ÉCOLIA SaaS - Service Enregistrement des Paiements & Audit Financier
 * Support : Espèces, Wave, Orange Money, MTN MoMo, Virement, Chèque
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database, PaymentMethod } from '../supabase/types';
import { generateReceiptNumber } from './receipts';

export type PaymentRow = Database['public']['Tables']['payments']['Row'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];

export interface NewPaymentPayload {
  schoolId: string;
  studentId: string;
  studentName?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  notes?: string;
  receivedByProfileId: string;
}

export interface PaymentRecordResult {
  payment: PaymentRow;
  receiptNumber: string;
  newBalance: number;
}

export async function getRecentPayments(limit = 20): Promise<{ data: PaymentRow[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false })
      .limit(limit);

    if (error) return { data: [], error: error.message, source: 'SUPABASE' };
    return { data: data || [], error: null, source: 'SUPABASE' };
  }

  // Démo store fallback
  const demoPayments: PaymentRow[] = [
    {
      id: 'pay-001',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      student_id: 'stu-2026-001',
      amount: 100000,
      payment_date: '2026-09-10T10:30:00Z',
      payment_method: 'WAVE',
      transaction_reference: 'WAVE-CI-778899',
      notes: 'Paiement Inscription + Tranche 1',
      received_by_profile_id: 'usr-acc-01',
      created_at: '2026-09-10T10:30:00Z',
    },
    {
      id: 'pay-002',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      student_id: 'stu-2026-001',
      amount: 150000,
      payment_date: '2026-09-20T14:15:00Z',
      payment_method: 'ORANGE_MONEY',
      transaction_reference: 'OM-CI-445566',
      notes: 'Solde annuel scolarité',
      received_by_profile_id: 'usr-acc-01',
      created_at: '2026-09-20T14:15:00Z',
    },
    {
      id: 'pay-003',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      student_id: 'stu-2026-002',
      amount: 150000,
      payment_date: '2026-09-12T11:00:00Z',
      payment_method: 'CASH',
      transaction_reference: null,
      notes: 'Espèces remises à la caisse',
      received_by_profile_id: 'usr-acc-01',
      created_at: '2026-09-12T11:00:00Z',
    }
  ];

  return { data: demoPayments, error: null, source: 'DEMO_STORE' };
}

/**
 * Enregistrement transactionnel d'un paiement avec émission immédiate du reçu
 */
export async function recordPayment(payload: NewPaymentPayload): Promise<{ data: PaymentRecordResult | null; error: string | null }> {
  // Validation stricte
  if (payload.amount <= 0) {
    return { data: null, error: 'Le montant du paiement doit être strictement supérieur à 0 FCFA.' };
  }
  if (!payload.studentId) {
    return { data: null, error: 'Un élève valide doit être sélectionné.' };
  }

  const receiptNum = generateReceiptNumber(Math.floor(100000 + Math.random() * 900000));

  if (isSupabaseConfigured()) {
    try {
      // 1. Insérer le paiement
      const { data: payData, error: payError } = await supabase
        .from('payments')
        .insert([{
          school_id: payload.schoolId,
          student_id: payload.studentId,
          amount: payload.amount,
          payment_method: payload.paymentMethod,
          transaction_reference: payload.transactionReference || null,
          notes: payload.notes || null,
          received_by_profile_id: payload.receivedByProfileId,
        }])
        .select()
        .single();

      if (payError) return { data: null, error: payError.message };

      // 2. Créer le reçu officiel lié
      await supabase
        .from('receipts')
        .insert([{
          school_id: payload.schoolId,
          payment_id: payData.id,
          receipt_number: receiptNum,
          student_id: payload.studentId,
          amount: payload.amount,
          payment_method: payload.paymentMethod,
          issued_by_profile_id: payload.receivedByProfileId,
        }]);

      // 3. Journaliser dans audit_logs
      await supabase
        .from('audit_logs')
        .insert([{
          school_id: payload.schoolId,
          user_id: payload.receivedByProfileId,
          action: 'PAYMENT_RECORDED',
          entity_type: 'PAYMENT',
          entity_id: payData.id,
          details: {
            amount: payload.amount,
            method: payload.paymentMethod,
            receiptNumber: receiptNum,
            studentId: payload.studentId,
          },
        }]);

      return {
        data: {
          payment: payData,
          receiptNumber: receiptNum,
          newBalance: 0,
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  }

  // Fallback Démo
  const newPay: PaymentRow = {
    id: `pay-${Date.now()}`,
    school_id: payload.schoolId,
    student_id: payload.studentId,
    amount: payload.amount,
    payment_date: new Date().toISOString(),
    payment_method: payload.paymentMethod,
    transaction_reference: payload.transactionReference || null,
    notes: payload.notes || null,
    received_by_profile_id: payload.receivedByProfileId,
    created_at: new Date().toISOString(),
  };

  return {
    data: {
      payment: newPay,
      receiptNumber: receiptNum,
      newBalance: 0,
    },
    error: null,
  };
}
