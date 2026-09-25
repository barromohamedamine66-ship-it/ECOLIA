/**
 * ÉCOLIA SaaS - Service Présences, Absences & Justifications
 * Feuille d'appel tactile, calcul de l'assiduité et historique
 */

import { supabase, isSupabaseConfigured, isProductionEnv } from '../supabase/client';
import type { Database } from '../supabase/types';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type JustificationStatus = 'NOT_JUSTIFIED' | 'PENDING' | 'JUSTIFIED';

export interface AttendanceRecordInput {
  studentId: string;
  studentName?: string;
  matricule?: string;
  status: AttendanceStatus;
  minutesLate?: number;
  reason?: string;
  justificationStatus?: JustificationStatus;
}

export interface AttendanceSessionSummary {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  presenceRate: number; // En %
}

export interface StudentAttendanceProfileStats {
  studentId: string;
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  lateCount: number;
  presenceRate: number; // En %
}

export async function getAttendanceSheet(
  classId: string,
  date: string,
  timeSlot = 'Matinée (07h30-12h00)'
): Promise<{ data: AttendanceRecordInput[]; isRecorded: boolean; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: [], isRecorded: false, error: 'CRITICAL: Supabase non configuré en environnement de production.', source: 'SUPABASE' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data: session } = await supabase
        .from('attendance')
        .select('id')
        .eq('class_id', classId)
        .eq('date', date)
        .eq('time_slot', timeSlot)
        .maybeSingle();

      if (session) {
        const { data: records, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('attendance_id', session.id);

        if (error) return { data: [], isRecorded: false, error: error.message, source: 'SUPABASE' };

        const mapped: AttendanceRecordInput[] = (records || []).map(r => ({
          studentId: r.student_id,
          status: r.status,
          minutesLate: r.minutes_late,
          reason: r.reason || undefined,
          justificationStatus: r.justification_status,
        }));

        return { data: mapped, isRecorded: true, error: null, source: 'SUPABASE' };
      }
    } catch (err: any) {
      console.error('Erreur getAttendanceSheet Supabase:', err);
    }
  }

  // Démo store fallback
  const demoRoster: AttendanceRecordInput[] = [
    { studentId: 'stu-2026-001', matricule: 'ECO-2026-00001', studentName: 'TRAORÉ Mohamed', status: 'PRESENT', minutesLate: 0 },
    { studentId: 'stu-2026-004', matricule: 'ECO-2026-00004', studentName: 'KOUASSI Ange Emmanuel', status: 'PRESENT', minutesLate: 0 },
    { studentId: 'stu-2026-005', matricule: 'ECO-2026-00005', studentName: 'BAMBA Yasmine', status: 'ABSENT', reason: 'Non justifié', justificationStatus: 'NOT_JUSTIFIED' },
    { studentId: 'stu-2026-006', matricule: 'ECO-2026-00006', studentName: 'YAO Kouamé David', status: 'LATE', minutesLate: 15, reason: 'Embouteillages Boulevard Mitterrand' },
    { studentId: 'stu-2026-007', matricule: 'ECO-2026-00007', studentName: 'DIALLO Fatoumata', status: 'EXCUSED', reason: 'Rendez-vous médical', justificationStatus: 'JUSTIFIED' },
  ];

  return { data: demoRoster, isRecorded: false, error: null, source: 'DEMO_STORE' };
}

/**
 * Enregistrement groupé (Batch) de la feuille d'appel
 */
export async function saveAttendanceSheet(
  schoolId: string,
  academicYearId: string,
  classId: string,
  date: string,
  timeSlot: string,
  records: AttendanceRecordInput[],
  takenByProfileId: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      // 1. Créer ou récupérer la session attendance
      const { data: session, error: sessError } = await supabase
        .from('attendance')
        .upsert([{
          school_id: schoolId,
          academic_year_id: academicYearId,
          class_id: classId,
          date,
          time_slot: timeSlot,
          taken_by: takenByProfileId,
        }], { onConflict: 'class_id, date, time_slot' })
        .select()
        .single();

      if (sessError) return { success: false, error: sessError.message };

      // 2. Insérer les enregistrements élèves
      const rows = records.map(r => ({
        school_id: schoolId,
        attendance_id: session.id,
        student_id: r.studentId,
        status: r.status,
        minutes_late: r.minutesLate || 0,
        reason: r.reason || null,
        justification_status: r.justificationStatus || (r.status === 'EXCUSED' ? 'JUSTIFIED' : 'NOT_JUSTIFIED'),
      }));

      const { error: recError } = await supabase
        .from('attendance_records')
        .upsert(rows, { onConflict: 'attendance_id, student_id' });

      if (recError) return { success: false, error: recError.message };

      // 3. Audit Log
      await supabase.from('audit_logs').insert([{
        school_id: schoolId,
        user_id: takenByProfileId,
        action: 'ATTENDANCE_RECORDED',
        entity_type: 'ATTENDANCE',
        entity_id: session.id,
        details: { classId, date, timeSlot, count: records.length },
      }]);

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, error: null };
}

/**
 * Calcul des statistiques d'assiduité d'un élève
 */
export function calculateStudentAttendanceStats(records: { status: AttendanceStatus; justificationStatus?: string }[]): StudentAttendanceProfileStats {
  const totalSessions = records.length;
  if (totalSessions === 0) {
    return {
      studentId: '',
      totalSessions: 0,
      presentSessions: 0,
      absentSessions: 0,
      justifiedAbsences: 0,
      unjustifiedAbsences: 0,
      lateCount: 0,
      presenceRate: 100,
    };
  }

  let present = 0;
  let absent = 0;
  let justified = 0;
  let late = 0;

  for (const r of records) {
    if (r.status === 'PRESENT') {
      present++;
    } else if (r.status === 'LATE') {
      present++; // Le retard est compté comme présent dans l'assiduité globale
      late++;
    } else if (r.status === 'EXCUSED' || r.justificationStatus === 'JUSTIFIED') {
      absent++;
      justified++;
    } else if (r.status === 'ABSENT') {
      absent++;
    }
  }

  const unjustified = Math.max(0, absent - justified);
  const presenceRate = Number(((present / totalSessions) * 100).toFixed(1));

  return {
    studentId: '',
    totalSessions,
    presentSessions: present,
    absentSessions: absent,
    justifiedAbsences: justified,
    unjustifiedAbsences: unjustified,
    lateCount: late,
    presenceRate,
  };
}
