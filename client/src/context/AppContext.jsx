import React, { createContext, useContext, useState, useEffect } from 'react';
import { setApiStudentId } from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('currentStudent'));
      if (stored?.id) {
        setApiStudentId(stored.id);
        return stored;
      }
      return null;
    } catch {
      return null;
    }
  });

  const selectStudent = (s) => {
    if (s && s.id) {
      setStudent(s);
      localStorage.setItem('currentStudent', JSON.stringify(s));
      setApiStudentId(s.id);
    } else {
      setStudent(null);
      localStorage.removeItem('currentStudent');
      setApiStudentId(null);
    }
  };

  useEffect(() => {
    if (student?.id) {
      setApiStudentId(student.id);
    } else {
      setApiStudentId(null);
    }
  }, [student]);

  return (
    <AppContext.Provider value={{ student, selectStudent }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

