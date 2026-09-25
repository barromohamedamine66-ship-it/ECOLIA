/**
 * ÉCOLIA SaaS - Moteur de Calcul Financier
 * Gestion rigoureuse des montants en FCFA, calculs de soldes, échéances, impayés et taux de recouvrement
 */

export interface FeeItem {
  name: string;
  amountDue: number;
  amountPaid: number;
  dueDate?: string;
}

export interface StudentFinancialBalance {
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  totalDue: number;
  totalPaid: number;
  balance: number; // > 0 si reste à payer, < 0 si avance/crédit, = 0 si soldé
  credit: number; // Avance éventuelle si balance < 0
  status: 'SOLDE' | 'PARTIEL' | 'IMPAYE' | 'EN_RETARD';
  recoveryRate: number; // En %
  overdueAmount: number;
  nextDueDate: string | null;
}

export interface PaymentSummary {
  totalInvoiced: number; // Total facturé
  totalCollected: number; // Total encaissé
  totalPending: number; // Solde global restant dû
  totalOverdue: number; // Total des retards
  globalRecoveryRate: number; // Taux de recouvrement global en %
  byPaymentMethod: Record<string, number>;
  paymentsCount: number;
}

/**
 * Formatage monétaire officiel en FCFA (sans décimales flottantes)
 * Ex: 150000 -> "150 000 FCFA"
 */
export function formatFCFA(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 FCFA';
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}

/**
 * Calcul du solde individuel d'un élève
 */
export function calculateStudentBalance(
  totalDue: number,
  totalPaid: number,
  schedules: { dueDate: string; amount: number }[] = []
): {
  balance: number;
  credit: number;
  status: 'SOLDE' | 'PARTIEL' | 'IMPAYE' | 'EN_RETARD';
  recoveryRate: number;
  overdueAmount: number;
  nextDueDate: string | null;
} {
  const safeDue = Math.max(0, Math.round(totalDue));
  const safePaid = Math.max(0, Math.round(totalPaid));
  const rawBalance = safeDue - safePaid;

  const balance = Math.max(0, rawBalance);
  const credit = rawBalance < 0 ? Math.abs(rawBalance) : 0;
  const recoveryRate = safeDue > 0 ? Number(((safePaid / safeDue) * 100).toFixed(1)) : 100;

  const today = new Date().toISOString().split('T')[0];
  let overdueAmount = 0;
  let accumulatedScheduleDue = 0;
  let nextDueDate: string | null = null;

  for (const item of schedules) {
    accumulatedScheduleDue += item.amount;
    if (item.dueDate < today) {
      // Échéance passée : vérifier si le montant cumulé payé couvre cette échéance
      if (safePaid < accumulatedScheduleDue) {
        overdueAmount = accumulatedScheduleDue - safePaid;
      }
    } else if (!nextDueDate && safePaid < accumulatedScheduleDue) {
      nextDueDate = item.dueDate;
    }
  }

  let status: 'SOLDE' | 'PARTIEL' | 'IMPAYE' | 'EN_RETARD' = 'IMPAYE';

  if (balance === 0) {
    status = 'SOLDE';
  } else if (overdueAmount > 0) {
    status = 'EN_RETARD';
  } else if (safePaid > 0) {
    status = 'PARTIEL';
  } else {
    status = 'IMPAYE';
  }

  return {
    balance,
    credit,
    status,
    recoveryRate,
    overdueAmount,
    nextDueDate,
  };
}

/**
 * Calcul des indicateurs financiers globaux de l'établissement
 */
export function calculateGlobalFinanceSummary(
  studentsBalances: { totalDue: number; totalPaid: number; overdueAmount: number }[],
  payments: { amount: number; paymentMethod: string }[]
): PaymentSummary {
  let totalInvoiced = 0;
  let totalCollected = 0;
  let totalOverdue = 0;

  for (const s of studentsBalances) {
    totalInvoiced += s.totalDue;
    totalCollected += s.totalPaid;
    totalOverdue += s.overdueAmount;
  }

  const totalPending = Math.max(0, totalInvoiced - totalCollected);
  const globalRecoveryRate = totalInvoiced > 0
    ? Number(((totalCollected / totalInvoiced) * 100).toFixed(1))
    : 0;

  const byPaymentMethod: Record<string, number> = {
    CASH: 0,
    WAVE: 0,
    ORANGE_MONEY: 0,
    MTN_MOMO: 0,
    BANK_TRANSFER: 0,
    CHECK: 0,
    OTHER: 0,
  };

  for (const p of payments) {
    const method = p.paymentMethod || 'OTHER';
    byPaymentMethod[method] = (byPaymentMethod[method] || 0) + p.amount;
  }

  return {
    totalInvoiced,
    totalCollected,
    totalPending,
    totalOverdue,
    globalRecoveryRate,
    byPaymentMethod,
    paymentsCount: payments.length,
  };
}
