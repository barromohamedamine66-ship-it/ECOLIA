/**
 * ÉCOLIA SaaS - Définitions TypeScript du Domaine Métier
 * Nom du produit : ÉCOLIA | Signature : « L'école, simplement. »
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'DIRECTOR'
  | 'SECRETARY'
  | 'ACCOUNTANT'
  | 'TEACHER'
  | 'PARENT'
  | 'STUDENT';

export interface School {
  id: string;
  code: string;
  name: string;
  motto: string;
  logo_url?: string;
  country: string;
  city: string;
  commune: string;
  address: string;
  phone: string;
  email: string;
  currency: 'FCFA' | string;
  education_types: ('PRIMAIRE' | 'COLLEGE' | 'LYCEE')[];
}

export interface Profile {
  id: string;
  school_id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface AcademicYear {
  id: string;
  school_id: string;
  name: string; // Ex: 2026-2027
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

export interface EvaluationPeriod {
  id: string;
  school_id: string;
  academic_year_id: string;
  name: string; // Trimestre 1, Trimestre 2, Trimestre 3
  code: string; // T1, T2, T3
  start_date: string;
  end_date: string;
  weight: number;
  is_locked: boolean;
}

export interface ClassRoom {
  id: string;
  school_id: string;
  academic_year_id: string;
  name: string; // 3e A, 6e B, CM2 A, Terminale D
  level: 'Primaire' | 'Collège' | 'Lycée';
  series?: string;
  head_teacher_id?: string;
  head_teacher_name?: string;
  room_name: string;
  capacity: number;
  students_count?: number;
}

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  code: string;
  category: string;
  default_coefficient: number;
}

export interface Student {
  id: string;
  school_id: string;
  matricule: string; // ECO-2026-00001
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  birth_date: string;
  birth_place: string;
  nationality: string;
  address: string;
  blood_group?: string;
  medical_notes?: string;
  photo_url?: string;
  is_active: boolean;
  
  // Relations
  class_id: string;
  class_name?: string;
  parent_id?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  
  // Scolarité
  annual_tuition: number; // en FCFA
  paid_tuition: number; // en FCFA
  balance_tuition: number; // en FCFA
  payment_status: 'SOLDE' | 'PARTIEL' | 'IMPAYE';
}

export interface Parent {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  relationship: string; // Père, Mère, Tuteur Légal
  phone: string;
  phone_alt?: string;
  email: string;
  profession?: string;
  address: string;
  children_ids: string[];
}

export interface Assessment {
  id: string;
  school_id: string;
  class_id: string;
  subject_id: string;
  period_id: string;
  teacher_id: string;
  title: string;
  type: 'INTERROGATION' | 'DEVOIR' | 'EXAMEN_BLANC' | 'CONTROLE_CONTINU' | 'TP_ORAL';
  date: string;
  max_score: number;
  weight: number;
}

export interface Grade {
  id: string;
  school_id: string;
  assessment_id: string;
  student_id: string;
  student_name?: string;
  score: number;
  is_absent: boolean;
  comment?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATED';
}

export interface AttendanceRecord {
  id: string;
  school_id: string;
  class_id: string;
  student_id: string;
  student_name?: string;
  date: string;
  time_slot: string; // Matinée ou Après-midi
  status: 'PRESENT' | 'ABSENT_NON_JUSTIFIE' | 'ABSENT_JUSTIFIE' | 'RETARD';
  minutes_late?: number;
  reason?: string;
  sanction?: string;
}

export interface ScheduleItem {
  id: string;
  school_id: string;
  class_id: string;
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  teacher_name: string;
  day_of_week: number; // 1 = Lundi, ..., 5 = Vendredi
  start_time: string;
  end_time: string;
  room_name: string;
}

export interface PaymentSchedule {
  id: string;
  student_id: string;
  name: string; // Inscription, Tranche 1, Tranche 2, Tranche 3
  due_date: string;
  amount: number; // en FCFA
  paid_amount: number;
  is_paid: boolean;
}

export interface Payment {
  id: string;
  school_id: string;
  student_id: string;
  student_name?: string;
  class_name?: string;
  academic_year_id: string;
  receipt_number: string; // REC-2026-000001
  amount: number; // en FCFA
  payment_date: string;
  mode: 'ESPECES' | 'VIREMENT_BANCAIRE' | 'CHEQUE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'WAVE' | 'AUTRE';
  reference?: string;
  fee_category: string;
  notes?: string;
  received_by: string;
}

export interface Announcement {
  id: string;
  school_id: string;
  title: string;
  content: string;
  target: 'TOUS' | 'ENSEIGNANTS' | 'PARENTS' | 'ELEVES' | 'CLASSE' | 'NIVEAU';
  target_name?: string;
  date: string;
  published_by: string;
}
