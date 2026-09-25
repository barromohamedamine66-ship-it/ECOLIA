export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'DIRECTOR'
  | 'SECRETARY'
  | 'ACCOUNTANT'
  | 'TEACHER'
  | 'PARENT'
  | 'STUDENT';

export type AcademicYearStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type AssessmentType = 'INTERROGATION' | 'DEVOIR' | 'EXAMEN' | 'CONTROLE_CONTINU' | 'AUTRE';
export type GradeValidationStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'OTHER';
export type FeeCategory = 'INSCRIPTION' | 'SCOLARITE' | 'UNIFORME' | 'CANTINE' | 'TRANSPORT' | 'AUTRE';
export type ScheduleStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          code: string
          name: string
          motto: string | null
          logo_url: string | null
          country: string
          city: string
          commune: string | null
          address: string | null
          phone: string | null
          email: string | null
          currency: string
          education_types: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          motto?: string | null
          logo_url?: string | null
          country?: string
          city?: string
          commune?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          currency?: string
          education_types?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          motto?: string | null
          logo_url?: string | null
          country?: string
          city?: string
          commune?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          currency?: string
          education_types?: string[]
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          school_id: string | null
          role: UserRole
          first_name: string
          last_name: string
          phone: string | null
          email: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          school_id?: string | null
          role?: UserRole
          first_name: string
          last_name: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          role?: UserRole
          first_name?: string
          last_name?: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      academic_years: {
        Row: {
          id: string
          school_id: string
          name: string
          start_date: string
          end_date: string
          status: AcademicYearStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          start_date: string
          end_date: string
          status?: AcademicYearStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          start_date?: string
          end_date?: string
          status?: AcademicYearStatus
          updated_at?: string
        }
      }
      evaluation_periods: {
        Row: {
          id: string
          school_id: string
          academic_year_id: string
          name: string
          code: string
          start_date: string
          end_date: string
          weight: number
          is_locked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          academic_year_id: string
          name: string
          code: string
          start_date: string
          end_date: string
          weight?: number
          is_locked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          academic_year_id?: string
          name?: string
          code?: string
          start_date?: string
          end_date?: string
          weight?: number
          is_locked?: boolean
        }
      }
      classes: {
        Row: {
          id: string
          school_id: string
          academic_year_id: string
          name: string
          level: string
          series: string | null
          room_name: string | null
          capacity: number
          head_teacher_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          academic_year_id: string
          name: string
          level: string
          series?: string | null
          room_name?: string | null
          capacity?: number
          head_teacher_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          academic_year_id?: string
          name?: string
          level?: string
          series?: string | null
          room_name?: string | null
          capacity?: number
          head_teacher_id?: string | null
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          school_id: string
          name: string
          code: string
          category: string | null
          default_coefficient: number
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          code: string
          category?: string | null
          default_coefficient?: number
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          code?: string
          category?: string | null
          default_coefficient?: number
        }
      }
      class_subjects: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          coefficient: number
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          coefficient: number
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          coefficient?: number
        }
      }
      teacher_assignments: {
        Row: {
          id: string
          school_id: string
          teacher_profile_id: string
          class_id: string
          subject_id: string
          academic_year_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          teacher_profile_id: string
          class_id: string
          subject_id: string
          academic_year_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          teacher_profile_id?: string
          class_id?: string
          subject_id?: string
          academic_year_id?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string
          matricule: string
          first_name: string
          last_name: string
          gender: 'M' | 'F'
          birth_date: string
          birth_place: string | null
          nationality: string
          address: string | null
          phone: string | null
          photo_url: string | null
          status: 'ACTIVE' | 'ARCHIVED' | 'TRANSFERRED' | 'EXPELLED'
          conduct_notes: string | null
          medical_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          matricule: string
          first_name: string
          last_name: string
          gender: 'M' | 'F'
          birth_date: string
          birth_place?: string | null
          nationality?: string
          address?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: 'ACTIVE' | 'ARCHIVED' | 'TRANSFERRED' | 'EXPELLED'
          conduct_notes?: string | null
          medical_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          matricule?: string
          first_name?: string
          last_name?: string
          gender?: 'M' | 'F'
          birth_date?: string
          birth_place?: string | null
          nationality?: string
          address?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: 'ACTIVE' | 'ARCHIVED' | 'TRANSFERRED' | 'EXPELLED'
          conduct_notes?: string | null
          medical_notes?: string | null
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          school_id: string
          class_id: string
          subject_id: string
          evaluation_period_id: string
          teacher_profile_id: string
          title: string
          type: AssessmentType
          date: string
          max_score: number
          coefficient: number
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id: string
          subject_id: string
          evaluation_period_id: string
          teacher_profile_id: string
          title: string
          type: AssessmentType
          date: string
          max_score?: number
          coefficient?: number
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string
          subject_id?: string
          evaluation_period_id?: string
          teacher_profile_id?: string
          title?: string
          type?: AssessmentType
          date?: string
          max_score?: number
          coefficient?: number
        }
      }
      grades: {
        Row: {
          id: string
          school_id: string
          assessment_id: string
          student_id: string
          score: number | null
          is_absent: boolean
          teacher_comment: string | null
          status: GradeValidationStatus
          validated_by_profile_id: string | null
          validated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          assessment_id: string
          student_id: string
          score?: number | null
          is_absent?: boolean
          teacher_comment?: string | null
          status?: GradeValidationStatus
          validated_by_profile_id?: string | null
          validated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          assessment_id?: string
          student_id?: string
          score?: number | null
          is_absent?: boolean
          teacher_comment?: string | null
          status?: GradeValidationStatus
          validated_by_profile_id?: string | null
          validated_at?: string | null
          updated_at?: string
        }
      }
      report_cards: {
        Row: {
          id: string
          school_id: string
          student_id: string
          class_id: string
          academic_year_id: string
          evaluation_period_id: string
          overall_average: number | null
          class_rank: number | null
          total_students: number | null
          total_absences: number
          justified_absences: number
          conduct_grade: string | null
          appreciation: string | null
          council_decision: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          class_id: string
          academic_year_id: string
          evaluation_period_id: string
          overall_average?: number | null
          class_rank?: number | null
          total_students?: number | null
          total_absences?: number
          justified_absences?: number
          conduct_grade?: string | null
          appreciation?: string | null
          council_decision?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          class_id?: string
          academic_year_id?: string
          evaluation_period_id?: string
          overall_average?: number | null
          class_rank?: number | null
          total_students?: number | null
          total_absences?: number
          justified_absences?: number
          conduct_grade?: string | null
          appreciation?: string | null
          council_decision?: string | null
          is_published?: boolean
          updated_at?: string
        }
      }
      report_card_items: {
        Row: {
          id: string
          report_card_id: string
          subject_id: string
          subject_average: number | null
          coefficient: number
          teacher_comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          report_card_id: string
          subject_id: string
          subject_average?: number | null
          coefficient: number
          teacher_comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          report_card_id?: string
          subject_id?: string
          subject_average?: number | null
          coefficient?: number
          teacher_comment?: string | null
        }
      }
      fee_types: {
        Row: {
          id: string
          school_id: string
          academic_year_id: string
          name: string
          category: FeeCategory
          amount: number
          is_mandatory: boolean
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          academic_year_id: string
          name: string
          category: FeeCategory
          amount: number
          is_mandatory?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          academic_year_id?: string
          name?: string
          category?: FeeCategory
          amount?: number
          is_mandatory?: boolean
        }
      }
      student_fees: {
        Row: {
          id: string
          school_id: string
          student_id: string
          fee_type_id: string
          academic_year_id: string
          amount_due: number
          amount_paid: number
          balance: number
          status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          fee_type_id: string
          academic_year_id: string
          amount_due: number
          amount_paid?: number
          balance?: number
          status?: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          fee_type_id?: string
          academic_year_id?: string
          amount_due?: number
          amount_paid?: number
          balance?: number
          status?: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE'
          updated_at?: string
        }
      }
      payment_schedules: {
        Row: {
          id: string
          school_id: string
          academic_year_id: string
          class_id: string | null
          title: string
          tranche_number: number
          amount: number
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          academic_year_id: string
          class_id?: string | null
          title: string
          tranche_number: number
          amount: number
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          academic_year_id?: string
          class_id?: string | null
          title?: string
          tranche_number?: number
          amount?: number
          due_date?: string
        }
      }
      payments: {
        Row: {
          id: string
          school_id: string
          student_id: string
          amount: number
          payment_date: string
          payment_method: PaymentMethod
          transaction_reference: string | null
          notes: string | null
          received_by_profile_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          amount: number
          payment_date?: string
          payment_method: PaymentMethod
          transaction_reference?: string | null
          notes?: string | null
          received_by_profile_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          amount?: number
          payment_date?: string
          payment_method?: PaymentMethod
          transaction_reference?: string | null
          notes?: string | null
          received_by_profile_id?: string
        }
      }
      receipts: {
        Row: {
          id: string
          school_id: string
          payment_id: string
          receipt_number: string
          student_id: string
          amount: number
          payment_method: PaymentMethod
          issued_at: string
          issued_by_profile_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          payment_id: string
          receipt_number: string
          student_id: string
          amount: number
          payment_method: PaymentMethod
          issued_at?: string
          issued_by_profile_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          payment_id?: string
          receipt_number?: string
          student_id?: string
          amount?: number
          payment_method?: PaymentMethod
          issued_at?: string
          issued_by_profile_id?: string
        }
      }
      attendance: {
        Row: {
          id: string
          school_id: string
          academic_year_id: string
          class_id: string
          date: string
          time_slot: string
          taken_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          academic_year_id: string
          class_id: string
          date?: string
          time_slot: string
          taken_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          academic_year_id?: string
          class_id?: string
          date?: string
          time_slot?: string
          taken_by?: string | null
        }
      }
      attendance_records: {
        Row: {
          id: string
          school_id: string
          attendance_id: string
          student_id: string
          status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
          minutes_late: number
          reason: string | null
          justification_status: 'NOT_JUSTIFIED' | 'PENDING' | 'JUSTIFIED'
          justification_document_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          attendance_id: string
          student_id: string
          status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
          minutes_late?: number
          reason?: string | null
          justification_status?: 'NOT_JUSTIFIED' | 'PENDING' | 'JUSTIFIED'
          justification_document_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          attendance_id?: string
          student_id?: string
          status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
          minutes_late?: number
          reason?: string | null
          justification_status?: 'NOT_JUSTIFIED' | 'PENDING' | 'JUSTIFIED'
          justification_document_url?: string | null
        }
      }
      schedules: {
        Row: {
          id: string
          school_id: string
          academic_year_id: string
          class_id: string
          subject_id: string
          teacher_id: string
          day_of_week: number
          start_time: string
          end_time: string
          room_name: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          academic_year_id: string
          class_id: string
          subject_id: string
          teacher_id: string
          day_of_week: number
          start_time: string
          end_time: string
          room_name: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          academic_year_id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          room_name?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          school_id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
        }
      }
      announcements: {
        Row: {
          id: string
          school_id: string
          title: string
          content: string
          target: 'TOUS' | 'ENSEIGNANTS' | 'PARENTS' | 'ELEVES' | 'CLASSE' | 'NIVEAU'
          target_class_id: string | null
          target_level: string | null
          is_published: boolean
          published_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          title: string
          content: string
          target?: 'TOUS' | 'ENSEIGNANTS' | 'PARENTS' | 'ELEVES' | 'CLASSE' | 'NIVEAU'
          target_class_id?: string | null
          target_level?: string | null
          is_published?: boolean
          published_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          title?: string
          content?: string
          target?: 'TOUS' | 'ENSEIGNANTS' | 'PARENTS' | 'ELEVES' | 'CLASSE' | 'NIVEAU'
          target_class_id?: string | null
          target_level?: string | null
          is_published?: boolean
          published_by?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          school_id: string
          profile_id: string
          title: string
          message: string
          link: string | null
          type: 'ANNOUNCEMENT' | 'GRADE' | 'REPORT_CARD' | 'PAYMENT' | 'ATTENDANCE' | 'SYSTEM'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          profile_id: string
          title: string
          message: string
          link?: string | null
          type?: 'ANNOUNCEMENT' | 'GRADE' | 'REPORT_CARD' | 'PAYMENT' | 'ATTENDANCE' | 'SYSTEM'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          profile_id?: string
          title?: string
          message?: string
          link?: string | null
          type?: 'ANNOUNCEMENT' | 'GRADE' | 'REPORT_CARD' | 'PAYMENT' | 'ATTENDANCE' | 'SYSTEM'
          is_read?: boolean
        }
      }
      documents: {
        Row: {
          id: string
          school_id: string
          uploaded_by: string
          name: string
          file_path: string
          storage_bucket: string
          mime_type: string
          file_size: number
          document_category: DocumentCategory
          document_type: string
          entity_type: string | null
          entity_id: string | null
          description: string | null
          is_archived: boolean
          archived_at: string | null
          archived_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          uploaded_by: string
          name: string
          file_path: string
          storage_bucket?: string
          mime_type: string
          file_size: number
          document_category: DocumentCategory
          document_type: string
          entity_type?: string | null
          entity_id?: string | null
          description?: string | null
          is_archived?: boolean
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          uploaded_by?: string
          name?: string
          file_path?: string
          storage_bucket?: string
          mime_type?: string
          file_size?: number
          document_category?: DocumentCategory
          document_type?: string
          entity_type?: string | null
          entity_id?: string | null
          description?: string | null
          is_archived?: boolean
          archived_at?: string | null
          archived_by?: string | null
          updated_at?: string
        }
      }
    }
  }
}

export type Announcement = Database['public']['Tables']['announcements']['Row'];
export type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];
export type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update'];
export type AnnouncementTarget = 'TOUS' | 'ENSEIGNANTS' | 'PARENTS' | 'ELEVES' | 'CLASSE' | 'NIVEAU';

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];
export type NotificationType = 'ANNOUNCEMENT' | 'GRADE' | 'REPORT_CARD' | 'PAYMENT' | 'ATTENDANCE' | 'SYSTEM';

export type DocumentCategory = 'STUDENT' | 'PARENT' | 'TEACHER' | 'SCHOOL' | 'ACADEMIC' | 'FINANCE' | 'OTHER';
export type DocumentItem = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

