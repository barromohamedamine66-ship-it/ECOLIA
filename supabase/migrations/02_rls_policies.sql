-- ====================================================================
-- ÉCOLIA SaaS - Politiques de Sécurité RLS (Row Level Security)
-- Règle d'or : Isolation absolue multi-tenant par school_id & Rôles
-- ====================================================================

-- 1. Activer RLS sur toutes les tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_card_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Fonctions utilitaires de sécurité (Security Definer)
CREATE OR REPLACE FUNCTION get_auth_school_id()
RETURNS UUID AS $$
    SELECT school_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT (get_auth_role() = 'SUPER_ADMIN');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_school_admin_or_director()
RETURNS BOOLEAN AS $$
    SELECT (get_auth_role() IN ('SCHOOL_ADMIN', 'DIRECTOR', 'SUPER_ADMIN'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Politiques RLS pour chaque entité

-- SCHOOLS
DROP POLICY IF EXISTS "Super admin sees all schools, users see their own school" ON schools;
DROP POLICY IF EXISTS "Allow public read of schools" ON schools;
DROP POLICY IF EXISTS "Allow school registration" ON schools;
DROP POLICY IF EXISTS "Allow admins to update school" ON schools;

CREATE POLICY "Allow public read of schools"
ON schools FOR SELECT
USING (true);

CREATE POLICY "Allow school registration"
ON schools FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow admins to update school"
ON schools FOR UPDATE
USING (is_super_admin() OR id = get_auth_school_id());

-- PROFILES
DROP POLICY IF EXISTS "Users can see profiles of their own school" ON profiles;
CREATE POLICY "Users can see profiles of their own school"
ON profiles FOR SELECT
USING (is_super_admin() OR school_id = get_auth_school_id());

DROP POLICY IF EXISTS "Admins can manage profiles of their school" ON profiles;
CREATE POLICY "Admins can manage profiles of their school"
ON profiles FOR ALL
USING (is_super_admin() OR (school_id = get_auth_school_id() AND is_school_admin_or_director()));

-- STUDENTS
DROP POLICY IF EXISTS "Staff can view students in their school" ON students;
CREATE POLICY "Staff can view students in their school"
ON students FOR SELECT
USING (
    is_super_admin() OR 
    (school_id = get_auth_school_id() AND get_auth_role() IN ('SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY', 'ACCOUNTANT', 'TEACHER')) OR
    (get_auth_role() = 'PARENT' AND id IN (
        SELECT student_id FROM parent_students ps
        JOIN parents p ON p.id = ps.parent_id
        WHERE p.profile_id = auth.uid()
    ))
);

DROP POLICY IF EXISTS "Admins and Secretaries can modify students" ON students;
CREATE POLICY "Admins and Secretaries can modify students"
ON students FOR ALL
USING (is_super_admin() OR (school_id = get_auth_school_id() AND get_auth_role() IN ('SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY')));

-- ACADEMIC YEARS
DROP POLICY IF EXISTS "Users see academic years" ON academic_years;
DROP POLICY IF EXISTS "Allow academic years registration" ON academic_years;
DROP POLICY IF EXISTS "Allow admins to update academic years" ON academic_years;
CREATE POLICY "Users see academic years" ON academic_years FOR SELECT USING (true);
CREATE POLICY "Allow academic years registration" ON academic_years FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins to update academic years" ON academic_years FOR UPDATE USING (is_super_admin() OR (school_id = get_auth_school_id() AND is_school_admin_or_director()));

-- EVALUATION PERIODS
DROP POLICY IF EXISTS "Users see evaluation periods" ON evaluation_periods;
DROP POLICY IF EXISTS "Allow evaluation periods registration" ON evaluation_periods;
CREATE POLICY "Users see evaluation periods" ON evaluation_periods FOR SELECT USING (true);
CREATE POLICY "Allow evaluation periods registration" ON evaluation_periods FOR INSERT WITH CHECK (true);

-- CLASSES
DROP POLICY IF EXISTS "Users see academic structure of their school" ON classes;
DROP POLICY IF EXISTS "Admins manage classes" ON classes;
DROP POLICY IF EXISTS "Allow classes view" ON classes;
DROP POLICY IF EXISTS "Allow classes registration" ON classes;
CREATE POLICY "Allow classes view" ON classes FOR SELECT USING (true);
CREATE POLICY "Allow classes registration" ON classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage classes" ON classes FOR ALL USING (is_super_admin() OR (school_id = get_auth_school_id() AND is_school_admin_or_director()));

-- SUBJECTS
DROP POLICY IF EXISTS "Users see subjects" ON subjects;
DROP POLICY IF EXISTS "Allow subjects registration" ON subjects;
CREATE POLICY "Users see subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow subjects registration" ON subjects FOR INSERT WITH CHECK (true);

-- GRADES & ASSESSMENTS
DROP POLICY IF EXISTS "Staff see grades, parents see only their child's grades" ON grades;
CREATE POLICY "Staff see grades, parents see only their child's grades"
ON grades FOR SELECT
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND get_auth_role() IN ('SCHOOL_ADMIN', 'DIRECTOR', 'TEACHER')) OR
    (get_auth_role() = 'PARENT' AND student_id IN (
        SELECT student_id FROM parent_students ps
        JOIN parents p ON p.id = ps.parent_id
        WHERE p.profile_id = auth.uid()
    ))
);

DROP POLICY IF EXISTS "Teachers can insert and update grades for their assignments" ON grades;
CREATE POLICY "Teachers can insert and update grades for their assignments"
ON grades FOR ALL
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND get_auth_role() IN ('TEACHER', 'SCHOOL_ADMIN', 'DIRECTOR'))
);

-- REPORT CARDS (BULLETINS)
DROP POLICY IF EXISTS "Report cards view policy" ON report_cards;
CREATE POLICY "Report cards view policy"
ON report_cards FOR SELECT
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND get_auth_role() IN ('SCHOOL_ADMIN', 'DIRECTOR', 'TEACHER', 'SECRETARY')) OR
    (get_auth_role() = 'PARENT' AND is_published = TRUE AND student_id IN (
        SELECT student_id FROM parent_students ps
        JOIN parents p ON p.id = ps.parent_id
        WHERE p.profile_id = auth.uid()
    ))
);

-- FINANCES, PAYMENTS & RECEIPTS
DROP POLICY IF EXISTS "Accountants and Admins see and manage payments" ON payments;
CREATE POLICY "Accountants and Admins see and manage payments"
ON payments FOR ALL
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND get_auth_role() IN ('ACCOUNTANT', 'SCHOOL_ADMIN', 'DIRECTOR'))
);

DROP POLICY IF EXISTS "Parents see payments of their children" ON payments;
CREATE POLICY "Parents see payments of their children"
ON payments FOR SELECT
USING (
    get_auth_role() = 'PARENT' AND student_id IN (
        SELECT student_id FROM parent_students ps
        JOIN parents p ON p.id = ps.parent_id
        WHERE p.profile_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Receipts view policy" ON receipts;
CREATE POLICY "Receipts view policy"
ON receipts FOR SELECT
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND get_auth_role() IN ('ACCOUNTANT', 'SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY')) OR
    (get_auth_role() = 'PARENT' AND payment_id IN (
        SELECT p.id FROM payments p
        JOIN parent_students ps ON ps.student_id = p.student_id
        JOIN parents pr ON pr.id = ps.parent_id
        WHERE pr.profile_id = auth.uid()
    ))
);

-- ATTENDANCE (ABSENCES)
DROP POLICY IF EXISTS "Attendance view and edit" ON attendance;
CREATE POLICY "Attendance view and edit"
ON attendance FOR ALL
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND get_auth_role() IN ('TEACHER', 'DIRECTOR', 'SCHOOL_ADMIN', 'SECRETARY'))
);

-- ANNOUNCEMENTS
DROP POLICY IF EXISTS "Announcements view policy" ON announcements;
CREATE POLICY "Announcements view policy"
ON announcements FOR SELECT
USING (is_super_admin() OR (school_id = get_auth_school_id() AND is_published = TRUE));

DROP POLICY IF EXISTS "Admins manage announcements" ON announcements;
CREATE POLICY "Admins manage announcements"
ON announcements FOR ALL
USING (is_super_admin() OR (school_id = get_auth_school_id() AND is_school_admin_or_director()));

-- NOTIFICATIONS (Centre de notifications internes)
DROP POLICY IF EXISTS "Users can only view their own notifications" ON notifications;
CREATE POLICY "Users can only view their own notifications"
ON notifications FOR SELECT
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update their own notifications status" ON notifications;
CREATE POLICY "Users can update their own notifications status"
ON notifications FOR UPDATE
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND profile_id = auth.uid())
);

DROP POLICY IF EXISTS "System and Admins can insert notifications" ON notifications;
CREATE POLICY "System and Admins can insert notifications"
ON notifications FOR INSERT
WITH CHECK (
    is_super_admin() OR
    school_id = get_auth_school_id()
);

-- AUDIT LOGS
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
USING (is_super_admin() OR (school_id = get_auth_school_id() AND is_school_admin_or_director()));

-- ====================================================================
-- DOCUMENTS (Coffre-fort documentaire)
-- ====================================================================
DROP POLICY IF EXISTS "Documents view policy" ON documents;
CREATE POLICY "Documents view policy"
ON documents FOR SELECT
USING (
    is_super_admin() OR
    (
        school_id = get_auth_school_id() AND (
            get_auth_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY') OR
            (get_auth_role() = 'ACCOUNTANT' AND document_category = 'FINANCE') OR
            (get_auth_role() = 'TEACHER' AND (
                uploaded_by = auth.uid() OR
                (entity_type = 'teacher' AND entity_id = auth.uid()) OR
                document_category IN ('ACADEMIC', 'SCHOOL')
            )) OR
            (get_auth_role() = 'PARENT' AND (
                uploaded_by = auth.uid() OR
                (entity_type = 'parent' AND entity_id = auth.uid()) OR
                (entity_type = 'student' AND entity_id IN (
                    SELECT student_id FROM parent_students ps
                    JOIN parents p ON p.id = ps.parent_id
                    WHERE p.profile_id = auth.uid()
                )) OR
                document_category = 'SCHOOL'
            )) OR
            (get_auth_role() = 'STUDENT' AND (
                (entity_type = 'student' AND entity_id = auth.uid()) AND
                document_category IN ('STUDENT', 'ACADEMIC', 'SCHOOL')
            ))
        )
    )
);

DROP POLICY IF EXISTS "Documents insert policy" ON documents;
CREATE POLICY "Documents insert policy"
ON documents FOR INSERT
WITH CHECK (
    is_super_admin() OR
    (
        school_id = get_auth_school_id() AND
        uploaded_by = auth.uid()
    )
);

DROP POLICY IF EXISTS "Documents update/archive policy" ON documents;
CREATE POLICY "Documents update/archive policy"
ON documents FOR UPDATE
USING (
    is_super_admin() OR
    (
        school_id = get_auth_school_id() AND (
            is_school_admin_or_director() OR
            uploaded_by = auth.uid()
        )
    )
);

DROP POLICY IF EXISTS "Documents delete policy" ON documents;
CREATE POLICY "Documents delete policy"
ON documents FOR DELETE
USING (
    is_super_admin() OR
    (school_id = get_auth_school_id() AND is_school_admin_or_director())
);

-- ====================================================================
-- SUPABASE STORAGE POLICIES (Bucket privé : ecolia-documents)
-- ====================================================================
DROP POLICY IF EXISTS "Storage private bucket isolation for read" ON storage.objects;
CREATE POLICY "Storage private bucket isolation for read"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'ecolia-documents' AND
    (
        is_super_admin() OR
        (storage.foldername(name))[2] = get_auth_school_id()::text
    )
);

DROP POLICY IF EXISTS "Storage private bucket isolation for upload" ON storage.objects;
CREATE POLICY "Storage private bucket isolation for upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'ecolia-documents' AND
    (
        is_super_admin() OR
        (storage.foldername(name))[2] = get_auth_school_id()::text
    )
);

DROP POLICY IF EXISTS "Storage private bucket isolation for delete" ON storage.objects;
CREATE POLICY "Storage private bucket isolation for delete"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'ecolia-documents' AND
    (
        is_super_admin() OR
        (
            (storage.foldername(name))[2] = get_auth_school_id()::text AND
            is_school_admin_or_director()
        )
    )
);
