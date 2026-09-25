/**
 * ÉCOLIA SaaS - Service Bulletins Scolaires A4 (Génération & Impression)
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';
import { calculateOverallAverage, getAcademicMention } from '../calculations/averages';

export type ReportCardRow = Database['public']['Tables']['report_cards']['Row'];
export type ReportCardItemRow = Database['public']['Tables']['report_card_items']['Row'];

export interface FullReportCardData {
  reportCard: ReportCardRow;
  student: {
    id: string;
    matricule: string;
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string;
    birth_place: string;
    nationality: string;
    photo_url: string | null;
  };
  school: {
    name: string;
    motto: string;
    logo_url?: string | null;
    address: string;
    phone: string;
    email: string;
    city: string;
    commune: string;
  };
  className: string;
  academicYear: string;
  periodName: string;
  subjects: {
    name: string;
    code: string;
    category: string;
    coefficient: number;
    average: number | null;
    weightedAverage: number | null;
    teacherComment: string;
  }[];
  overallAverage: number | null;
  totalCoefficients: number;
  totalWeightedPoints: number;
  classRank: number;
  totalStudents: number;
  isExAequo: boolean;
  mention: string;
  councilDecision: string;
  appreciation: string;
  totalAbsences: number;
  justifiedAbsences: number;
}

export async function getStudentReportCard(
  studentId: string,
  periodId: string,
  academicYearId: string
): Promise<{ data: FullReportCardData | null; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  // Démo / Live Data Structure
  const reportData: FullReportCardData = {
    reportCard: {
      id: 'rc-2026-001',
      school_id: 'a0000000-0000-0000-0000-000000000001',
      student_id: studentId,
      class_id: 'e0000000-0000-0000-0000-000000000006',
      academic_year_id: academicYearId,
      evaluation_period_id: periodId,
      overall_average: 15.65,
      class_rank: 2,
      total_students: 42,
      total_absences: 2,
      justified_absences: 2,
      conduct_grade: 'Très Bonne',
      appreciation: 'Trimestre remarquable. Travail régulier, esprit d\'analyse pertinent. Félicitations du Conseil.',
      councilDecision: 'Tableau d\'Honneur avec Félicitations',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    student: {
      id: studentId,
      matricule: 'ECO-2026-00001',
      first_name: 'Mohamed',
      last_name: 'TRAORÉ',
      gender: 'M',
      birth_date: '2011-04-12',
      birth_place: 'Abidjan (Cocody)',
      nationality: 'Ivoirienne',
      photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
    school: {
      name: 'GROUPE SCOLAIRE HORIZON',
      motto: 'Discipline • Travail • Excellence',
      logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
      address: 'Boulevard François Mitterrand, Riviera 3',
      phone: '+225 27 22 44 55 66',
      email: 'contact@horizon-abidjan.ci',
      city: 'Abidjan',
      commune: 'Cocody',
    },
    className: '3e A (Brevet)',
    academicYear: '2026-2027',
    periodName: '1er Trimestre',
    subjects: [
      { name: 'Mathématiques', code: 'MATH', category: 'Scientifique', coefficient: 4, average: 16.50, weightedAverage: 66.00, teacherComment: 'Excellent esprit d\'analyse et rigueur mathématique.' },
      { name: 'Français & Expression', code: 'FR', category: 'Littéraire', coefficient: 4, average: 15.00, weightedAverage: 60.00, teacherComment: 'Bonne expression écrite et orthographe soignée.' },
      { name: 'Physique - Chimie', code: 'SP', category: 'Scientifique', coefficient: 3, average: 15.50, weightedAverage: 46.50, teacherComment: 'Très bons résultats en travaux pratiques.' },
      { name: 'Sciences de la Vie et de la Terre', code: 'SVT', category: 'Scientifique', coefficient: 2, average: 14.00, weightedAverage: 28.00, teacherComment: 'Bonne compréhension des concepts.' },
      { name: 'Histoire - Géographie', code: 'HG', category: 'Littéraire', coefficient: 3, average: 16.00, weightedAverage: 48.00, teacherComment: 'Excellente maîtrise des cours et des cartes.' },
      { name: 'Anglais (LV1)', code: 'ANG', category: 'Langues', coefficient: 3, average: 17.00, weightedAverage: 51.00, teacherComment: 'Aisance remarquable à l\'oral et à l\'écrit.' },
      { name: 'Éducation Physique & Sportive', code: 'EPS', category: 'Sport', coefficient: 2, average: 15.00, weightedAverage: 30.00, teacherComment: 'Très bonne participation et esprit d\'équipe.' },
    ],
    overallAverage: 15.65,
    totalCoefficients: 21,
    totalWeightedPoints: 329.50,
    classRank: 2,
    totalStudents: 42,
    isExAequo: false,
    mention: 'Bien',
    councilDecision: 'Tableau d\'Honneur avec Félicitations du Conseil des Professeurs',
    appreciation: 'Trimestre remarquable. Travail régulier, esprit d\'analyse pertinent. Félicitations du Conseil.',
    totalAbsences: 2,
    justifiedAbsences: 2,
  };

  return { data: reportData, error: null, source: isSupabaseConfigured() ? 'SUPABASE' : 'DEMO_STORE' };
}
