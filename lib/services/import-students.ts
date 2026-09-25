/**
 * ÉCOLIA SaaS - Service d'Importation Massive des Élèves (CSV / Excel)
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import type { Database } from '../supabase/types';

export interface ParsedStudentRow {
  matricule: string;
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  birthDate: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  status?: 'VALID' | 'ERROR';
  errorMessage?: string;
}

export interface ImportResult {
  totalCount: number;
  successCount: number;
  failedCount: number;
  errors: string[];
}

export function parseCSVContent(csvText: string): ParsedStudentRow[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const rows: ParsedStudentRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (rawCols.length < 5) continue;

    const matricule = rawCols[0] || `ECO-${Date.now().toString().slice(-5)}-${i}`;
    const lastName = rawCols[1] || '';
    const firstName = rawCols[2] || '';
    const gender = (rawCols[3]?.toUpperCase() === 'F' ? 'F' : 'M') as 'M' | 'F';
    const birthDate = rawCols[4] || '2012-01-01';
    const className = rawCols[5] || '6e A';
    const parentName = rawCols[6] || `Parent de ${lastName}`;
    const parentPhone = rawCols[7] || '+225 07 00 00 00 00';
    const parentEmail = rawCols[8] || '';

    if (!lastName || !firstName) continue;

    rows.push({
      matricule,
      lastName,
      firstName,
      gender,
      birthDate,
      className,
      parentName,
      parentPhone,
      parentEmail,
      status: 'VALID',
    });
  }

  return rows;
}

export async function importStudentsBatch(
  schoolId: string,
  academicYearId: string,
  students: ParsedStudentRow[]
): Promise<ImportResult> {
  const result: ImportResult = {
    totalCount: students.length,
    successCount: 0,
    failedCount: 0,
    errors: [],
  };

  if (students.length === 0) return result;

  if (isSupabaseConfigured()) {
    try {
      // 1. Récupérer ou créer les classes associées
      const { data: existingClasses } = await supabase
        .from('classes')
        .select('id, name')
        .eq('school_id', schoolId);

      const classMap = new Map<string, string>();
      existingClasses?.forEach(c => classMap.set(c.name.trim().toLowerCase(), c.id));

      for (const st of students) {
        let classId = classMap.get(st.className.trim().toLowerCase());

        // Si la classe n'existe pas encore, la créer
        if (!classId) {
          const isLycee = st.className.toLowerCase().includes('nde') || st.className.toLowerCase().includes('ère') || st.className.toLowerCase().includes('term');
          const { data: newCls } = await supabase
            .from('classes')
            .insert([{
              school_id: schoolId,
              academic_year_id: academicYearId,
              name: st.className.trim(),
              level: isLycee ? 'Lycée' : 'Collège',
              capacity: 45,
            } as any])
            .select('id')
            .single();

          if (newCls) {
            classId = newCls.id;
            classMap.set(st.className.trim().toLowerCase(), classId);
          }
        }

        // 2. Insérer l'élève
        const { data: newStudent, error: stuErr } = await supabase
          .from('students')
          .insert([{
            school_id: schoolId,
            matricule: st.matricule,
            first_name: st.firstName,
            last_name: st.lastName,
            gender: st.gender,
            birth_date: st.birthDate,
            birth_place: 'Abidjan',
            nationality: 'Ivoirienne',
          } as any])
          .select('id')
          .single();

        if (stuErr || !newStudent) {
          result.failedCount++;
          result.errors.push(`Erreur pour ${st.lastName} ${st.firstName}: ${stuErr?.message || 'Inconnue'}`);
          continue;
        }

        // 3. Inscrire l'élève dans la classe
        if (classId) {
          await supabase.from('enrollments').insert([{
            school_id: schoolId,
            student_id: newStudent.id,
            class_id: classId,
            academic_year_id: academicYearId,
            status: 'ENROLLED' as any,
          } as any]);
        }

        // 4. Créer la fiche parent et liaison
        const { data: newParent } = await supabase
          .from('parents')
          .insert([{
            school_id: schoolId,
            first_name: st.parentName.split(' ')[0] || st.parentName,
            last_name: st.parentName.split(' ').slice(1).join(' ') || st.lastName,
            phone_primary: st.parentPhone,
            email: st.parentEmail || null,
          } as any])
          .select('id')
          .single();

        if (newParent) {
          await supabase.from('parent_students').insert([{
            parent_id: newParent.id,
            student_id: newStudent.id,
            relationship: 'PARENT',
            is_primary_contact: true,
          } as any]);
        }

        result.successCount++;
      }
    } catch (err: any) {
      result.errors.push(`Erreur générale: ${err.message}`);
    }

    return result;
  }

  // Fallback Démo
  result.successCount = students.length;
  return result;
}
