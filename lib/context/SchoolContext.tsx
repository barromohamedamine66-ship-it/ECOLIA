'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSchoolsList, type SchoolRow } from '../services/schools';

interface SchoolContextType {
  currentSchool: SchoolRow;
  allSchools: SchoolRow[];
  setCurrentSchool: (school: SchoolRow) => void;
  selectSchoolById: (schoolId: string) => void;
  refreshSchools: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_SCHOOL: SchoolRow = {
  id: 'a0000000-0000-0000-0000-000000000001',
  code: 'HORIZON-ABJ',
  name: 'Groupe Scolaire Horizon',
  motto: 'Discipline • Travail • Excellence',
  logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
  country: 'Côte d\'Ivoire',
  city: 'Abidjan',
  commune: 'Cocody Riviera',
  address: 'Boulevard François Mitterrand',
  phone: '+225 27 22 44 55 66',
  email: 'contact@horizon-abidjan.ci',
  currency: 'FCFA',
  education_types: ['COLLEGE', 'LYCEE'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const SchoolContext = createContext<SchoolContextType>({
  currentSchool: DEFAULT_SCHOOL,
  allSchools: [DEFAULT_SCHOOL],
  setCurrentSchool: () => {},
  selectSchoolById: () => {},
  refreshSchools: async () => {},
  isLoading: true,
});

const STORAGE_KEY = 'ecolia_active_school_id';

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [allSchools, setAllSchools] = useState<SchoolRow[]>([DEFAULT_SCHOOL]);
  const [currentSchool, setCurrentSchoolState] = useState<SchoolRow>(DEFAULT_SCHOOL);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSchools = async () => {
    try {
      const res = await getSchoolsList();
      if (res.data && res.data.length > 0) {
        setAllSchools(res.data);
        const savedId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        const matching = res.data.find(s => s.id === savedId) || res.data[0];
        setCurrentSchoolState(matching);
      }
    } catch (err) {
      console.error('Error loading schools in context:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSchools();
  }, []);

  const setCurrentSchool = (school: SchoolRow) => {
    setCurrentSchoolState(school);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, school.id);
    }
  };

  const selectSchoolById = (schoolId: string) => {
    const school = allSchools.find(s => s.id === schoolId);
    if (school) {
      setCurrentSchool(school);
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        currentSchool,
        allSchools,
        setCurrentSchool,
        selectSchoolById,
        refreshSchools,
        isLoading,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  return useContext(SchoolContext);
}
