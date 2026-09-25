-- ====================================================================
-- ÉCOLIA SaaS - Schéma PostgreSQL Complet & Multi-Tenant (Supabase)
-- Nom du produit : ÉCOLIA | Signature : « L'école, simplement. »
-- Conçu pour la Côte d'Ivoire & l'Afrique francophone (Devise: FCFA)
-- ====================================================================

-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. ÉTABLISSEMENTS & MULTI-TENANCY (TENANTS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- Ex: HORIZON-ABJ
    name VARCHAR(255) NOT NULL, -- Ex: Groupe Scolaire Horizon
    motto VARCHAR(255) DEFAULT 'Discipline, Travail, Excellence',
    logo_url TEXT,
    country VARCHAR(100) DEFAULT 'Côte d''Ivoire',
    city VARCHAR(100) DEFAULT 'Abidjan',
    commune VARCHAR(100) DEFAULT 'Cocody',
    address TEXT DEFAULT 'Boulevard des Martyrs, Abidjan',
    phone VARCHAR(50) DEFAULT '+225 27 22 44 55 66',
    email VARCHAR(255) DEFAULT 'direction@horizon-edu.ci',
    currency VARCHAR(10) DEFAULT 'FCFA',
    education_types TEXT[] DEFAULT ARRAY['PRIMAIRE', 'COLLEGE', 'LYCEE'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 2. PROFILS UTILISATEURS & CONTRÔLE D'ACCÈS PAR RÔLES (RBAC)
-- ====================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'SUPER_ADMIN',
        'SCHOOL_ADMIN',
        'DIRECTOR',
        'SECRETARY',
        'ACCOUNTANT',
        'TEACHER',
        'PARENT',
        'STUDENT'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'STUDENT',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 3. ANNÉES SCOLAIRES & PÉRIODES D'ÉVALUATION
-- ====================================================================
DO $$ BEGIN
    CREATE TYPE academic_year_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- Ex: 2026-2027
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status academic_year_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_school_academic_year UNIQUE (school_id, name)
);

CREATE TABLE IF NOT EXISTS evaluation_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Ex: Trimestre 1, Trimestre 2, Semestre 1
    code VARCHAR(20) NOT NULL, -- Ex: T1, T2, T3, S1, S2
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    weight NUMERIC(3, 2) DEFAULT 1.0,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 4. CLASSES, NIVEAUX & MATIÈRES
-- ====================================================================
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Ex: 3e A, CM2 B, Terminale C
    level VARCHAR(50) NOT NULL, -- Ex: Primaire, Collège, Lycée
    series VARCHAR(50), -- Ex: C, D, A1, A2
    head_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    room_name VARCHAR(100), -- Ex: Salle 204
    capacity INTEGER DEFAULT 45,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, -- Ex: Mathématiques, Français, Sciences Physiques
    code VARCHAR(20) NOT NULL, -- Ex: MATH, FR, SP, HG, SVT, ANG, EPS, PHILO
    category VARCHAR(50) DEFAULT 'Scientifique', -- Ex: Littéraire, Scientifique, Langues, Sport
    default_coefficient NUMERIC(3, 1) DEFAULT 2.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    coefficient NUMERIC(3, 1) NOT NULL DEFAULT 2.0,
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_class_subject UNIQUE (class_id, subject_id)
);

-- ====================================================================
-- 5. ÉLÈVES, PARENTS & INSCRIPTIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    matricule VARCHAR(50) NOT NULL, -- Ex: ECO-2026-00001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL, -- M / F
    birth_date DATE NOT NULL,
    birth_place VARCHAR(150) NOT NULL DEFAULT 'Abidjan',
    nationality VARCHAR(100) DEFAULT 'Ivoirienne',
    address TEXT DEFAULT 'Abidjan',
    blood_group VARCHAR(10),
    medical_notes TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_school_matricule UNIQUE (school_id, matricule)
);

CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) DEFAULT 'Père', -- Père, Mère, Tuteur Légal
    phone VARCHAR(50) NOT NULL,
    phone_alt VARCHAR(50),
    email VARCHAR(255),
    profession VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    is_primary_contact BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_parent_student UNIQUE (parent_id, student_id)
);

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('INSCRIT', 'REINSCRIT', 'TRANSFERE', 'ABANDONNE', 'EXCLU');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status enrollment_status NOT NULL DEFAULT 'INSCRIT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_student_year_enrollment UNIQUE (student_id, academic_year_id)
);

-- ====================================================================
-- 6. ÉVALUATIONS, NOTES & BULLETINS
-- ====================================================================
DO $$ BEGIN
    CREATE TYPE assessment_type AS ENUM ('INTERROGATION', 'DEVOIR', 'EXAMEN_BLANC', 'CONTROLE_CONTINU', 'TP_ORAL');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE grade_status AS ENUM ('DRAFT', 'SUBMITTED', 'VALIDATED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL, -- Ex: Devoir Surveillé N°1
    type assessment_type NOT NULL DEFAULT 'DEVOIR',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    max_score NUMERIC(5, 2) DEFAULT 20.0,
    weight NUMERIC(3, 1) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    is_absent BOOLEAN DEFAULT FALSE,
    comment TEXT,
    status grade_status NOT NULL DEFAULT 'SUBMITTED',
    entered_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_assessment_student_grade UNIQUE (assessment_id, student_id)
);

CREATE TABLE IF NOT EXISTS report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
    overall_average NUMERIC(5, 2) NOT NULL,
    class_average NUMERIC(5, 2),
    min_average NUMERIC(5, 2),
    max_average NUMERIC(5, 2),
    rank INTEGER,
    total_students INTEGER,
    total_absences INTEGER DEFAULT 0,
    total_justified_absences INTEGER DEFAULT 0,
    council_decision TEXT,
    honors VARCHAR(100), -- Félicitations, Tableau d'Honneur, Encouragements, Avertissement
    principal_signature TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_student_period_report UNIQUE (student_id, period_id)
);

CREATE TABLE IF NOT EXISTS report_card_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_card_id UUID NOT NULL REFERENCES report_cards(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    coefficient NUMERIC(3, 1) NOT NULL,
    average NUMERIC(5, 2) NOT NULL,
    class_average NUMERIC(5, 2),
    rank INTEGER,
    teacher_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 7. ASSIDUITÉ, ABSENCES & EMPLOI DU TEMPS
-- ====================================================================
DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT_NON_JUSTIFIE', 'ABSENT_JUSTIFIE', 'RETARD');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_slot VARCHAR(50) NOT NULL, -- Matinée (07h30-12h00) ou Après-midi (13h30-17h30)
    taken_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_class_date_slot_attendance UNIQUE (class_id, date, time_slot)
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'PRESENT',
    minutes_late INTEGER DEFAULT 0,
    reason TEXT,
    justification_document_url TEXT,
    sanction VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_attendance_student UNIQUE (attendance_id, student_id)
);

CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 1 = Lundi, 2 = Mardi, ..., 5 = Vendredi
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 8. FINANCES, SCOLARITÉS, ÉCHÉANCIERS & REÇUS EN FCFA
-- ====================================================================
CREATE TABLE IF NOT EXISTS fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, -- Inscription, Scolarité Annuelle, Cantine, Transport, Uniforme
    code VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 0) NOT NULL, -- En FCFA
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    total_amount NUMERIC(12, 0) NOT NULL, -- Ex: 250 000 FCFA
    discount_amount NUMERIC(12, 0) DEFAULT 0,
    paid_amount NUMERIC(12, 0) DEFAULT 0,
    balance_amount NUMERIC(12, 0) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_student_fee_year UNIQUE (student_id, academic_year_id)
);

CREATE TABLE IF NOT EXISTS payment_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_fee_id UUID NOT NULL REFERENCES student_fees(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Inscription, 1ère Tranche, 2ème Tranche, 3ème Tranche
    due_date DATE NOT NULL,
    amount NUMERIC(12, 0) NOT NULL, -- Montant attendu en FCFA
    paid_amount NUMERIC(12, 0) DEFAULT 0,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ BEGIN
    CREATE TYPE payment_mode AS ENUM (
        'ESPECES',
        'VIREMENT_BANCAIRE',
        'CHEQUE',
        'ORANGE_MONEY',
        'MTN_MOMO',
        'WAVE',
        'AUTRE'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    amount NUMERIC(12, 0) NOT NULL, -- Montant encaissé en FCFA
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mode payment_mode NOT NULL DEFAULT 'ESPECES',
    reference VARCHAR(150), -- N° Chèque, Référence Wave/Orange Money
    notes TEXT,
    received_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL, -- Ex: REC-2026-000001
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_school_receipt_number UNIQUE (school_id, receipt_number)
);

-- ====================================================================
-- 9. COMMUNICATION, ANNONCES & NOTIFICATIONS
-- ====================================================================
DO $$ BEGIN
    CREATE TYPE announcement_target AS ENUM ('TOUS', 'ENSEIGNANTS', 'PARENTS', 'ELEVES', 'CLASSE', 'NIVEAU');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target announcement_target NOT NULL DEFAULT 'TOUS',
    target_class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    target_level VARCHAR(50),
    is_published BOOLEAN DEFAULT TRUE,
    published_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 10. DOCUMENTS & JOURNAL D'AUDIT
-- ====================================================================
DO $$ BEGIN
    CREATE TYPE document_category_enum AS ENUM ('STUDENT', 'PARENT', 'TEACHER', 'SCHOOL', 'ACADEMIC', 'FINANCE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    storage_bucket VARCHAR(100) DEFAULT 'ecolia-documents' NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    document_category document_category_enum NOT NULL DEFAULT 'OTHER',
    document_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'student', 'parent', 'teacher', 'school', 'payment', etc.
    entity_id UUID,
    description TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP WITH TIME ZONE,
    archived_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- CREATE_STUDENT, VALIDATE_GRADE, RECORD_PAYMENT, etc.
    entity_type VARCHAR(100) NOT NULL, -- students, grades, payments, report_cards
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser les performances multi-tenant
CREATE INDEX IF NOT EXISTS idx_profiles_school ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_matricule ON students(matricule);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_year ON enrollments(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_assessment ON grades(assessment_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_audit_school ON audit_logs(school_id);
