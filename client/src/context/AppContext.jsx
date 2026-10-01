import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentStudent')) || null; } catch { return null; }
  });

  const selectStudent = (s) => {
    setStudent(s);
    localStorage.setItem('currentStudent', JSON.stringify(s));
  };

  return (
    <AppContext.Provider value={{ student, selectStudent }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
