-- ====================================================================
-- ÉCOLIA SaaS - Données de Démonstration Réalistes (Seed Data)
-- Établissement : Groupe Scolaire Horizon (Abidjan, Côte d'Ivoire)
-- Année académique : 2026-2027 | Devise : FCFA
-- ====================================================================

-- 1. Établissement
INSERT INTO schools (id, code, name, motto, country, city, commune, address, phone, email, currency, education_types)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'HORIZON-ABJ',
    'Groupe Scolaire Horizon',
    'Discipline • Travail • Excellence',
    'Côte d''Ivoire',
    'Abidjan',
    'Cocody Riviera',
    'Boulevard François Mitterrand, Abidjan',
    '+225 27 22 44 55 66',
    'contact@horizon-abidjan.ci',
    'FCFA',
    ARRAY['PRIMAIRE', 'COLLEGE', 'LYCEE']
) ON CONFLICT (id) DO NOTHING;

-- 2. Année scolaire 2026-2027
INSERT INTO academic_years (id, school_id, name, start_date, end_date, status)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '2026-2027',
    '2026-09-07',
    '2027-06-25',
    'ACTIVE'
) ON CONFLICT DO NOTHING;

-- 3. Périodes (Trimestres)
INSERT INTO evaluation_periods (id, school_id, academic_year_id, name, code, start_date, end_date, weight)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '1er Trimestre', 'T1', '2026-09-07', '2026-12-18', 1.0),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '2ème Trimestre', 'T2', '2027-01-04', '2027-03-26', 1.0),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '3ème Trimestre', 'T3', '2027-04-12', '2027-06-25', 1.0)
ON CONFLICT DO NOTHING;

-- 4. Matières
INSERT INTO subjects (id, school_id, name, code, category, default_coefficient)
VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mathématiques', 'MATH', 'Scientifique', 4.0),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Français & Expression', 'FR', 'Littéraire', 4.0),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Physique - Chimie', 'SP', 'Scientifique', 3.0),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Sciences de la Vie et de la Terre', 'SVT', 'Scientifique', 2.0),
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Histoire - Géographie', 'HG', 'Littéraire', 3.0),
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Anglais (LV1)', 'ANG', 'Langues', 3.0),
('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Éducation Physique & Sportive', 'EPS', 'Sport', 2.0),
('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Philosophie', 'PHILO', 'Littéraire', 3.0)
ON CONFLICT DO NOTHING;

-- 5. Classes
INSERT INTO classes (id, school_id, academic_year_id, name, level, room_name, capacity)
VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'CM2 A', 'Primaire', 'Bâtiment Primaire - Salle 05', 40),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '6e A', 'Collège', 'Bâtiment A - Salle 101', 45),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '6e B', 'Collège', 'Bâtiment A - Salle 102', 45),
('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '5e A', 'Collège', 'Bâtiment A - Salle 104', 45),
('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '4e A', 'Collège', 'Bâtiment B - Salle 201', 45),
('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '3e A', 'Collège', 'Bâtiment B - Salle 204', 45),
('e0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Terminale D', 'Lycée', 'Bâtiment C - Salle 302', 40)
ON CONFLICT DO NOTHING;
