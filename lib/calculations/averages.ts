/**
 * ÉCOLIA SaaS - Moteur de Calcul Pédagogique
 * Calcul des moyennes par matière, moyennes générales pondérées, rangs et mentions officielles
 */

export interface SubjectGradeInput {
  score: number;
  coefficient: number;
  isAbsent?: boolean;
}

export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  category?: string;
  coefficient: number;
  average: number | null; // Sur 20
  weightedAverage: number | null; // average * coefficient
  teacherComment?: string;
  gradesCount: number;
}

export interface StudentPedagogicalSummary {
  studentId: string;
  studentName: string;
  matricule: string;
  subjects: SubjectResult[];
  totalCoefficients: number;
  totalWeightedPoints: number;
  overallAverage: number | null; // Sur 20 (arrondi à 2 décimales)
  rank?: number;
  rankSuffix?: string;
  isExAequo?: boolean;
  mention: string;
  councilDecision: string;
}

/**
 * Calcul de la moyenne d'une matière à partir d'une liste de notes pondérées
 * Formule : Moyenne = Σ(note × coefficient) / Σ(coefficients)
 */
export function calculateSubjectAverage(grades: SubjectGradeInput[]): number | null {
  const validGrades = grades.filter(g => !g.isAbsent && g.score !== null && g.score !== undefined && !isNaN(g.score));
  if (validGrades.length === 0) return null;

  let totalPoints = 0;
  let totalCoef = 0;

  for (const g of validGrades) {
    const score = Math.max(0, Math.min(20, g.score));
    const coef = g.coefficient > 0 ? g.coefficient : 1;
    totalPoints += score * coef;
    totalCoef += coef;
  }

  if (totalCoef === 0) return null;
  return Number((totalPoints / totalCoef).toFixed(2));
}

/**
 * Calcul de la moyenne générale d'un élève
 * Formule : Moyenne Générale = Σ(moyenne matière × coefficient matière) / Σ(coefficients matières)
 */
export function calculateOverallAverage(subjects: { average: number | null; coefficient: number }[]): {
  overallAverage: number | null;
  totalCoefficients: number;
  totalWeightedPoints: number;
} {
  const validSubjects = subjects.filter(s => s.average !== null && !isNaN(s.average!));
  if (validSubjects.length === 0) {
    return { overallAverage: null, totalCoefficients: 0, totalWeightedPoints: 0 };
  }

  let totalWeighted = 0;
  let totalCoef = 0;

  for (const s of validSubjects) {
    const coef = s.coefficient > 0 ? s.coefficient : 1;
    totalWeighted += (s.average! * coef);
    totalCoef += coef;
  }

  if (totalCoef === 0) return { overallAverage: null, totalCoefficients: 0, totalWeightedPoints: 0 };
  const overall = Number((totalWeighted / totalCoef).toFixed(2));

  return {
    overallAverage: overall,
    totalCoefficients: totalCoef,
    totalWeightedPoints: Number(totalWeighted.toFixed(2)),
  };
}

/**
 * Attribution de la mention officielle et appréciation globale (système francophone / ivoirien)
 */
export function getAcademicMention(average: number | null): { mention: string; councilDecision: string } {
  if (average === null) {
    return { mention: 'Non évalué', councilDecision: 'En attente des évaluations' };
  }

  if (average >= 16) {
    return { mention: 'Très Bien', councilDecision: 'Félicitations du Conseil des Professeurs & Tableau d\'Honneur' };
  }
  if (average >= 14) {
    return { mention: 'Bien', councilDecision: 'Encouragements du Conseil des Professeurs' };
  }
  if (average >= 12) {
    return { mention: 'Assez Bien', councilDecision: 'Tableau d\'Honneur' };
  }
  if (average >= 10) {
    return { mention: 'Passable', councilDecision: 'Admis(e) — Doit persévérer dans ses efforts' };
  }
  if (average >= 8.5) {
    return { mention: 'Insuffisant', councilDecision: 'Avertissement Travail — Soutien scolaire recommandé' };
  }
  return { mention: 'Faible', councilDecision: 'Blâme Travail — Redoublement ou réorientation à envisager' };
}

/**
 * Calcul du classement d'une classe avec gestion des ex-aequo
 */
export function calculateClassRanks(students: { studentId: string; overallAverage: number | null }[]): Map<string, { rank: number; isExAequo: boolean }> {
  const rankMap = new Map<string, { rank: number; isExAequo: boolean }>();
  
  // Trier les élèves ayant une moyenne par ordre décroissant
  const evaluated = students
    .filter(s => s.overallAverage !== null)
    .sort((a, b) => b.overallAverage! - a.overallAverage!);

  let currentRank = 1;
  for (let i = 0; i < evaluated.length; i++) {
    const current = evaluated[i];
    
    // Vérifier ex-aequo
    if (i > 0 && current.overallAverage === evaluated[i - 1].overallAverage) {
      // Même rang que le précédent
      const prev = rankMap.get(evaluated[i - 1].studentId);
      const assignedRank = prev ? prev.rank : currentRank;
      rankMap.set(current.studentId, { rank: assignedRank, isExAequo: true });
      if (prev) prev.isExAequo = true;
    } else {
      currentRank = i + 1;
      rankMap.set(current.studentId, { rank: currentRank, isExAequo: false });
    }
  }

  return rankMap;
}

/**
 * Formatage du rang (ex: 1er, 2ème, 3ème...)
 */
export function formatRank(rank?: number, isExAequo?: boolean): string {
  if (!rank) return '-';
  const suffix = rank === 1 ? 'er' : 'ème';
  return `${rank}${suffix}${isExAequo ? ' (ex)' : ''}`;
}
