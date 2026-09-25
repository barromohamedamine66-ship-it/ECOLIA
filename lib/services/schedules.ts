/**
 * ÉCOLIA SaaS - Service Emploi du Temps & Moteur de Détection de Conflits
 * Vues : Par Classe, Par Enseignant, et Vue Globale Direction
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export type ScheduleRow = Database['public']['Tables']['schedules']['Row'];
export type ScheduleInsert = Database['public']['Tables']['schedules']['Insert'];

export interface EnrichedScheduleItem {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: number; // 1 = Lundi, 2 = Mardi, ..., 5 = Vendredi
  dayLabel: string;
  startTime: string; // Ex: "08:00"
  endTime: string; // Ex: "10:00"
  roomName: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType?: 'TEACHER_CONFLICT' | 'CLASS_CONFLICT' | 'ROOM_CONFLICT';
  errorMessage?: string;
}

export const DAY_NAMES: Record<number, string> = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
};

/**
 * Moteur de Détection des Conflits d'Emploi du Temps
 * Détecte les chevauchements horaires :
 * - Même Enseignant dans 2 cours simultanés
 * - Même Classe avec 2 matières simultanées
 * - Même Salle occupée par 2 classes simultanées
 */
export function detectScheduleConflict(
  newItem: Omit<EnrichedScheduleItem, 'id'>,
  existingList: EnrichedScheduleItem[],
  ignoreId?: string
): ConflictCheckResult {
  const newStart = parseTimeToMinutes(newItem.startTime);
  const newEnd = parseTimeToMinutes(newItem.endTime);

  if (newEnd <= newStart) {
    return {
      hasConflict: true,
      errorMessage: 'L\'heure de fin doit être strictement postérieure à l\'heure de début.',
    };
  }

  for (const item of existingList) {
    if (ignoreId && item.id === ignoreId) continue;
    if (item.dayOfWeek !== newItem.dayOfWeek) continue;

    const itemStart = parseTimeToMinutes(item.startTime);
    const itemEnd = parseTimeToMinutes(item.endTime);

    // Vérifier chevauchement horaire : max(start1, start2) < min(end1, end2)
    const isOverlapping = Math.max(newStart, itemStart) < Math.min(newEnd, itemEnd);

    if (isOverlapping) {
      // 1. Conflit Enseignant
      if (item.teacherId === newItem.teacherId) {
        return {
          hasConflict: true,
          conflictType: 'TEACHER_CONFLICT',
          errorMessage: `⚠️ Conflit Enseignant : ${item.teacherName} a déjà un cours de ${item.startTime} à ${item.endTime} avec la classe ${item.className} en ${item.roomName}.`,
        };
      }

      // 2. Conflit Classe
      if (item.classId === newItem.classId) {
        return {
          hasConflict: true,
          conflictType: 'CLASS_CONFLICT',
          errorMessage: `⚠️ Conflit Classe : La classe ${item.className} a déjà cours de ${item.subjectName} prévu de ${item.startTime} à ${item.endTime}.`,
        };
      }

      // 3. Conflit Salle
      if (item.roomName.trim().toLowerCase() === newItem.roomName.trim().toLowerCase()) {
        return {
          hasConflict: true,
          conflictType: 'ROOM_CONFLICT',
          errorMessage: `⚠️ Conflit Salle : La salle « ${item.roomName} » est déjà occupée par la classe ${item.className} (${item.subjectName}) de ${item.startTime} à ${item.endTime}.`,
        };
      }
    }
  }

  return { hasConflict: false };
}

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export async function getScheduleList(filters: { classId?: string; teacherId?: string } = {}): Promise<{ data: EnrichedScheduleItem[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  // Démo / Live Data
  const demoSchedules: EnrichedScheduleItem[] = [
    {
      id: 'sch-001',
      classId: 'e0000000-0000-0000-0000-000000000006',
      className: '3e A',
      subjectId: 'd0000000-0000-0000-0000-000000000001',
      subjectName: 'Mathématiques',
      teacherId: 'usr-tea-01',
      teacherName: 'M. KOFFI Yao Simplice',
      dayOfWeek: 1, // Lundi
      dayLabel: 'Lundi',
      startTime: '08:00',
      endTime: '10:00',
      roomName: 'Bâtiment B - Salle 204',
    },
    {
      id: 'sch-002',
      classId: 'e0000000-0000-0000-0000-000000000006',
      className: '3e A',
      subjectId: 'd0000000-0000-0000-0000-000000000002',
      subjectName: 'Français & Expression',
      teacherId: 'usr-tea-02',
      teacherName: 'Mme KONE Fatou',
      dayOfWeek: 1, // Lundi
      dayLabel: 'Lundi',
      startTime: '10:15',
      endTime: '12:00',
      roomName: 'Bâtiment B - Salle 204',
    },
    {
      id: 'sch-003',
      classId: 'e0000000-0000-0000-0000-000000000006',
      className: '3e A',
      subjectId: 'd0000000-0000-0000-0000-000000000003',
      subjectName: 'Physique - Chimie',
      teacherId: 'usr-tea-03',
      teacherName: 'M. TOURE Seydou',
      dayOfWeek: 2, // Mardi
      dayLabel: 'Mardi',
      startTime: '08:00',
      endTime: '10:00',
      roomName: 'Laboratoire Sciences 1',
    },
    {
      id: 'sch-004',
      classId: 'e0000000-0000-0000-0000-000000000007',
      className: 'Terminale D',
      subjectId: 'd0000000-0000-0000-0000-000000000001',
      subjectName: 'Mathématiques',
      teacherId: 'usr-tea-01',
      teacherName: 'M. KOFFI Yao Simplice',
      dayOfWeek: 3, // Mercredi
      dayLabel: 'Mercredi',
      startTime: '08:00',
      endTime: '12:00',
      roomName: 'Bâtiment C - Salle 302',
    }
  ];

  let filtered = demoSchedules;
  if (filters.classId) filtered = filtered.filter(s => s.classId === filters.classId);
  if (filters.teacherId) filtered = filtered.filter(s => s.teacherId === filters.teacherId);

  return { data: filtered, error: null, source: isSupabaseConfigured() ? 'SUPABASE' : 'DEMO_STORE' };
}
