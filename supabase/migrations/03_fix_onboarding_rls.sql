-- ====================================================================
-- ÉCOLIA SaaS - Fix RLS Onboarding Multi-Établissements & Démo
-- Exécutez ce script dans l'Éditeur SQL de votre Supabase Dashboard
-- ====================================================================

-- 1. Autoriser l'enregistrement et l'onboarding public des nouveaux établissements
DROP POLICY IF EXISTS "Allow school registration" ON schools;
DROP POLICY IF EXISTS "Allow public read of schools" ON schools;
DROP POLICY IF EXISTS "Super admin sees all schools, users see their own school" ON schools;

CREATE POLICY "Allow public read of schools"
ON schools FOR SELECT
USING (true);

CREATE POLICY "Allow school registration"
ON schools FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow school update"
ON schools FOR UPDATE
USING (true);

-- 2. Autoriser l'initialisation des années académiques, trimestres et classes
DROP POLICY IF EXISTS "Allow academic years registration" ON academic_years;
CREATE POLICY "Allow academic years registration"
ON academic_years FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow evaluation periods registration" ON evaluation_periods;
CREATE POLICY "Allow evaluation periods registration"
ON evaluation_periods FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow classes registration" ON classes;
CREATE POLICY "Allow classes registration"
ON classes FOR INSERT
WITH CHECK (true);

-- Recharger le cache du schéma Supabase
NOTIFY pgrst, 'reload schema';
