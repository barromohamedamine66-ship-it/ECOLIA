/**
 * ÉCOLIA SaaS - Contrôle d'Accès par Rôles (RBAC) & Matrice de Sécurité
 * Rôles : SUPER_ADMIN, SCHOOL_ADMIN, DIRECTOR, SECRETARY, ACCOUNTANT, TEACHER, PARENT, STUDENT
 */

import type { UserRole } from '../supabase/types';

export interface RolePermissions {
  canAccessAllSchools: boolean;
  canManageSchoolSettings: boolean;
  canManageUsers: boolean;
  canManageStudents: boolean;
  canManageParents: boolean;
  canManageTeachers: boolean;
  canManageClasses: boolean;
  canManageSubjects: boolean;
  canEnterGrades: boolean;
  canValidateGrades: boolean;
  canGenerateReportCards: boolean;
  canTakeAttendance: boolean;
  canManageFinance: boolean;
  canViewReports: boolean;
  canPublishAnnouncements: boolean;
  canManageAnnouncements: boolean;
  canViewNotifications: boolean;
  canManageNotifications: boolean;
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canManageDocuments: boolean;
  canArchiveDocuments: boolean;
  canDeleteDocuments: boolean;
  isParentPortalOnly: boolean;
  isStudentPortalOnly: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SUPER_ADMIN: {
    canAccessAllSchools: true,
    canManageSchoolSettings: true,
    canManageUsers: true,
    canManageStudents: true,
    canManageParents: true,
    canManageTeachers: true,
    canManageClasses: true,
    canManageSubjects: true,
    canEnterGrades: true,
    canValidateGrades: true,
    canGenerateReportCards: true,
    canTakeAttendance: true,
    canManageFinance: true,
    canViewReports: true,
    canPublishAnnouncements: true,
    canManageAnnouncements: true,
    canViewNotifications: true,
    canManageNotifications: true,
    canViewDocuments: true,
    canUploadDocuments: true,
    canManageDocuments: true,
    canArchiveDocuments: true,
    canDeleteDocuments: true,
    isParentPortalOnly: false,
    isStudentPortalOnly: false,
  },
  SCHOOL_ADMIN: {
    canAccessAllSchools: false,
    canManageSchoolSettings: true,
    canManageUsers: true,
    canManageStudents: true,
    canManageParents: true,
    canManageTeachers: true,
    canManageClasses: true,
    canManageSubjects: true,
    canEnterGrades: true,
    canValidateGrades: true,
    canGenerateReportCards: true,
    canTakeAttendance: true,
    canManageFinance: true,
    canViewReports: true,
    canPublishAnnouncements: true,
    canManageAnnouncements: true,
    canViewNotifications: true,
    canManageNotifications: true,
    canViewDocuments: true,
    canUploadDocuments: true,
    canManageDocuments: true,
    canArchiveDocuments: true,
    canDeleteDocuments: true,
    isParentPortalOnly: false,
    isStudentPortalOnly: false,
  },
  DIRECTOR: {
    canAccessAllSchools: false,
    canManageSchoolSettings: true,
    canManageUsers: false,
    canManageStudents: true,
    canManageParents: true,
    canManageTeachers: true,
    canManageClasses: true,
    canManageSubjects: true,
    canEnterGrades: true,
    canValidateGrades: true,
    canGenerateReportCards: true,
    canTakeAttendance: true,
    canManageFinance: true,
    canViewReports: true,
    canPublishAnnouncements: true,
    canManageAnnouncements: true,
    canViewNotifications: true,
    canManageNotifications: true,
    canViewDocuments: true,
    canUploadDocuments: true,
    canManageDocuments: true,
    canArchiveDocuments: true,
    canDeleteDocuments: false, // Archivage privilégié
    isParentPortalOnly: false,
    isStudentPortalOnly: false,
  },
  SECRETARY: {
    canAccessAllSchools: false,
    canManageSchoolSettings: false,
    canManageUsers: false,
    canManageStudents: true,
    canManageParents: true,
    canManageTeachers: false,
    canManageClasses: true,
    canManageSubjects: false,
    canEnterGrades: false,
    canValidateGrades: false,
    canGenerateReportCards: true,
    canTakeAttendance: true,
    canManageFinance: false,
    canViewReports: false,
    canPublishAnnouncements: true,
    canManageAnnouncements: true,
    canViewNotifications: true,
    canManageNotifications: true,
    canViewDocuments: true,
    canUploadDocuments: true,
    canManageDocuments: true,
    canArchiveDocuments: true,
    canDeleteDocuments: false,
    isParentPortalOnly: false,
    isStudentPortalOnly: false,
  },
  ACCOUNTANT: {
    canAccessAllSchools: false,
    canManageSchoolSettings: false,
    canManageUsers: false,
    canManageStudents: false,
    canManageParents: false,
    canManageTeachers: false,
    canManageClasses: false,
    canManageSubjects: false,
    canEnterGrades: false, // Strict: Aucun accès aux notes
    canValidateGrades: false,
    canGenerateReportCards: false,
    canTakeAttendance: false,
    canManageFinance: true,
    canViewReports: true,
    canPublishAnnouncements: false,
    canManageAnnouncements: false,
    canViewNotifications: true,
    canManageNotifications: false,
    canViewDocuments: true, // Documents financiers/reçus
    canUploadDocuments: true,
    canManageDocuments: false,
    canArchiveDocuments: false,
    canDeleteDocuments: false,
    isParentPortalOnly: false,
    isStudentPortalOnly: false,
  },
  TEACHER: {
    canAccessAllSchools: false,
    canManageSchoolSettings: false,
    canManageUsers: false,
    canManageStudents: false,
    canManageParents: false,
    canManageTeachers: false,
    canManageClasses: false,
    canManageSubjects: false,
    canEnterGrades: true, // Uniquement pour ses classes/matières
    canValidateGrades: false, // Réservé à la Direction
    canGenerateReportCards: false,
    canTakeAttendance: true,
    canManageFinance: false, // Strict: Aucun accès aux finances
    canViewReports: false,
    canPublishAnnouncements: false,
    canManageAnnouncements: false,
    canViewNotifications: true,
    canManageNotifications: false,
    canViewDocuments: true, // Ses documents RH et documents pédagogiques
    canUploadDocuments: true,
    canManageDocuments: false,
    canArchiveDocuments: false,
    canDeleteDocuments: false,
    isParentPortalOnly: false,
    isStudentPortalOnly: false,
  },
  PARENT: {
    canAccessAllSchools: false,
    canManageSchoolSettings: false,
    canManageUsers: false,
    canManageStudents: false,
    canManageParents: false,
    canManageTeachers: false,
    canManageClasses: false,
    canManageSubjects: false,
    canEnterGrades: false,
    canValidateGrades: false,
    canGenerateReportCards: false,
    canTakeAttendance: false,
    canManageFinance: false,
    canViewReports: false,
    canPublishAnnouncements: false,
    canManageAnnouncements: false,
    canViewNotifications: true,
    canManageNotifications: false,
    canViewDocuments: true, // Uniquement documents de ses enfants et reçus autorisés
    canUploadDocuments: true, // Justificatifs et pièces d'inscription
    canManageDocuments: false,
    canArchiveDocuments: false,
    canDeleteDocuments: false,
    isParentPortalOnly: true,
    isStudentPortalOnly: false,
  },
  STUDENT: {
    canAccessAllSchools: false,
    canManageSchoolSettings: false,
    canManageUsers: false,
    canManageStudents: false,
    canManageParents: false,
    canManageTeachers: false,
    canManageClasses: false,
    canManageSubjects: false,
    canEnterGrades: false,
    canValidateGrades: false,
    canGenerateReportCards: false,
    canTakeAttendance: false,
    canManageFinance: false,
    canViewReports: false,
    canPublishAnnouncements: false,
    canManageAnnouncements: false,
    canViewNotifications: true,
    canManageNotifications: false,
    canViewDocuments: true, // Bulletins, certificats autorisés
    canUploadDocuments: false,
    canManageDocuments: false,
    canArchiveDocuments: false,
    canDeleteDocuments: false,
    isParentPortalOnly: false,
    isStudentPortalOnly: true,
  },
};

export function hasPermission(role: UserRole | null, permission: keyof RolePermissions): boolean {
  if (!role) return false;
  return Boolean(ROLE_PERMISSIONS[role]?.[permission]);
}

/**
 * Détermine si le rôle est autorisé à accéder au portail demandé
 */
export function canAccessPortal(
  role: UserRole | null,
  portal: 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT'
): boolean {
  if (!role) return false;

  switch (portal) {
    case 'ADMIN':
      return ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY', 'ACCOUNTANT'].includes(role);
    case 'TEACHER':
      return ['TEACHER', 'DIRECTOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(role);
    case 'PARENT':
      return ['PARENT', 'DIRECTOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(role);
    case 'STUDENT':
      return ['STUDENT', 'PARENT', 'DIRECTOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(role);
    default:
      return false;
  }
}

/**
 * Vérifie si un rôle peut voir une annonce ciblée
 */
export function canViewAnnouncement(
  role: UserRole | null,
  target: string,
  userClassId?: string | null,
  targetClassId?: string | null,
  userLevel?: string | null,
  targetLevel?: string | null
): boolean {
  if (!role) return false;
  if (['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DIRECTOR'].includes(role)) return true;
  if (target === 'TOUS') return true;

  if (target === 'ENSEIGNANTS' && role === 'TEACHER') return true;
  if (target === 'PARENTS' && role === 'PARENT') return true;
  if (target === 'ELEVES' && role === 'STUDENT') return true;
  if (target === 'CLASSE') {
    if (targetClassId && userClassId && targetClassId === userClassId) return true;
  }
  if (target === 'NIVEAU') {
    if (targetLevel && userLevel && targetLevel === userLevel) return true;
  }

  return false;
}

/**
 * Retourne l'URL de redirection par défaut selon le rôle de l'utilisateur
 */
export function getDefaultPortalForRole(role: UserRole | null): string {
  if (!role) return '/login';

  switch (role) {
    case 'SUPER_ADMIN':
    case 'SCHOOL_ADMIN':
    case 'DIRECTOR':
    case 'SECRETARY':
    case 'ACCOUNTANT':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'PARENT':
      return '/parent';
    case 'STUDENT':
      return '/student';
    default:
      return '/admin';
  }
}

/**
 * Vérifie si l'utilisateur a le droit de consulter la fiche d'un élève
 */
export function canViewStudent(
  role: UserRole | null,
  studentId: string,
  parentChildIds: string[] = []
): boolean {
  if (!role) return false;
  if (['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY'].includes(role)) return true;
  if (role === 'PARENT') return parentChildIds.includes(studentId);
  return false;
}

/**
 * Vérifie si l'utilisateur a le droit d'accéder à un document donné
 */
export function canAccessDocument(
  role: UserRole | null,
  userProfileId: string,
  doc: {
    uploaded_by: string;
    document_category: string;
    entity_type: string | null;
    entity_id: string | null;
  },
  parentChildIds: string[] = []
): boolean {
  if (!role) return false;
  if (['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DIRECTOR'].includes(role)) return true;
  if (role === 'SECRETARY' && ['STUDENT', 'PARENT', 'SCHOOL', 'ACADEMIC', 'OTHER'].includes(doc.document_category)) return true;
  if (role === 'ACCOUNTANT' && doc.document_category === 'FINANCE') return true;

  // L'auteur du document a toujours accès
  if (doc.uploaded_by === userProfileId) return true;

  // Enseignant : ses propres documents RH ou documents de classe
  if (role === 'TEACHER') {
    if (doc.entity_type === 'teacher' && doc.entity_id === userProfileId) return true;
    if (doc.document_category === 'ACADEMIC' || doc.document_category === 'SCHOOL') return true;
    return false;
  }

  // Parent : documents de ses enfants ou ses propres justificatifs
  if (role === 'PARENT') {
    if (doc.entity_type === 'parent' && doc.entity_id === userProfileId) return true;
    if (doc.entity_type === 'student' && doc.entity_id && parentChildIds.includes(doc.entity_id)) return true;
    if (doc.document_category === 'SCHOOL') return true;
    return false;
  }

  // Élève : ses propres bulletins et certificats
  if (role === 'STUDENT') {
    if (doc.entity_type === 'student' && doc.entity_id === userProfileId) {
      return ['STUDENT', 'ACADEMIC', 'SCHOOL'].includes(doc.document_category);
    }
    return false;
  }

  return false;
}


