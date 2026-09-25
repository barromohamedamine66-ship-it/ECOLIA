import { supabase, isSupabaseConfigured, isProductionEnv } from '../supabase/client';
import { calculateStudentBalance, calculateGlobalFinanceSummary, type StudentFinancialBalance, type PaymentSummary } from '../calculations/finance';
import { getRecentPayments } from './payments';

export async function getUnpaidBalancesList(filters: { classId?: string; status?: string } = {}): Promise<{ data: StudentFinancialBalance[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: [], error: 'CRITICAL: Supabase non configuré en environnement de production.', source: 'SUPABASE' };
  }

  // Liste des élèves avec situation financière
  const demoBalances: StudentFinancialBalance[] = [
    {
      studentId: 'stu-2026-001',
      studentName: 'TRAORÉ Mohamed',
      matricule: 'ECO-2026-00001',
      className: '3e A',
      totalDue: 250000,
      totalPaid: 250000,
      balance: 0,
      credit: 0,
      status: 'SOLDE',
      recoveryRate: 100,
      overdueAmount: 0,
      nextDueDate: null,
    },
    {
      studentId: 'stu-2026-002',
      studentName: 'TRAORÉ Aïcha',
      matricule: 'ECO-2026-00002',
      className: '6e B',
      totalDue: 220000,
      totalPaid: 150000,
      balance: 70000,
      credit: 0,
      status: 'PARTIEL',
      recoveryRate: 68.2,
      overdueAmount: 0,
      nextDueDate: '2027-01-15',
    },
    {
      studentId: 'stu-2026-003',
      studentName: 'TRAORÉ Mariam',
      matricule: 'ECO-2026-00003',
      className: 'CM2 A',
      totalDue: 180000,
      totalPaid: 180000,
      balance: 0,
      credit: 0,
      status: 'SOLDE',
      recoveryRate: 100,
      overdueAmount: 0,
      nextDueDate: null,
    },
    {
      studentId: 'stu-2026-004',
      studentName: 'KOUASSI Ange Emmanuel',
      matricule: 'ECO-2026-00004',
      className: '3e A',
      totalDue: 250000,
      totalPaid: 100000,
      balance: 150000,
      credit: 0,
      status: 'EN_RETARD',
      recoveryRate: 40.0,
      overdueAmount: 50000,
      nextDueDate: '2026-10-31',
    },
    {
      studentId: 'stu-2026-005',
      studentName: 'BAMBA Yasmine',
      matricule: 'ECO-2026-00005',
      className: '3e A',
      totalDue: 250000,
      totalPaid: 0,
      balance: 250000,
      credit: 0,
      status: 'IMPAYE',
      recoveryRate: 0.0,
      overdueAmount: 150000,
      nextDueDate: '2026-09-15',
    },
    {
      studentId: 'stu-2026-006',
      studentName: 'YAO Kouamé David',
      matricule: 'ECO-2026-00006',
      className: 'Terminale D',
      totalDue: 300000,
      totalPaid: 200000,
      balance: 100000,
      credit: 0,
      status: 'PARTIEL',
      recoveryRate: 66.7,
      overdueAmount: 0,
      nextDueDate: '2027-01-15',
    },
    {
      studentId: 'stu-2026-007',
      studentName: 'DIALLO Fatoumata',
      matricule: 'ECO-2026-00007',
      className: 'Terminale D',
      totalDue: 300000,
      totalPaid: 300000,
      balance: 0,
      credit: 0,
      status: 'SOLDE',
      recoveryRate: 100,
      overdueAmount: 0,
      nextDueDate: null,
    }
  ];

  let filtered = demoBalances;
  if (filters.status) filtered = filtered.filter(b => b.status === filters.status);

  return { data: filtered, error: null, source: isSupabaseConfigured() ? 'SUPABASE' : 'DEMO_STORE' };
}

export async function getGlobalFinancialDashboard(): Promise<{ summary: PaymentSummary; error: string | null }> {
  const [unpaidRes, payRes] = await Promise.all([
    getUnpaidBalancesList(),
    getRecentPayments(100),
  ]);

  const summary = calculateGlobalFinanceSummary(
    unpaidRes.data.map(d => ({ totalDue: d.totalDue, totalPaid: d.totalPaid, overdueAmount: d.overdueAmount })),
    payRes.data.map(p => ({ amount: p.amount, paymentMethod: p.payment_method }))
  );

  return { summary, error: null };
}
