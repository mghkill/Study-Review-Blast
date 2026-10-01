import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import { getDashboard } from './api';

// Pages
import StudentSelect from './pages/StudentSelect';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import VocabularyList from './pages/VocabularyList';
import VocabDetail from './pages/VocabDetail';
import AddVerb from './pages/AddVerb';
import SentencesPage from './pages/SentencesPage';
import ParagraphsPage from './pages/ParagraphsPage';
import SearchPage from './pages/SearchPage';
import ProgressPage from './pages/ProgressPage';

function ProtectedLayout({ children }) {
  const { student } = useApp();
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    if (!student) return;
    getDashboard(student.id)
      .then(d => setPendingReviews(parseInt(d.stats.pending_reviews) || 0))
      .catch(() => {});
  }, [student]);

  if (!student) return <Navigate to="/" replace />;

  return (
    <div className="app-layout">
      <Sidebar pendingReviews={pendingReviews} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const { student } = useApp();

  return (
    <Routes>
      <Route path="/" element={student ? <Navigate to="/dashboard" replace /> : <StudentSelect />} />
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/study" element={<ProtectedLayout><StudySession /></ProtectedLayout>} />
      <Route path="/vocabulary" element={<ProtectedLayout><VocabularyList /></ProtectedLayout>} />
      <Route path="/vocabulary/:id" element={<ProtectedLayout><VocabDetail /></ProtectedLayout>} />
      <Route path="/add-verb" element={<ProtectedLayout><AddVerb /></ProtectedLayout>} />
      <Route path="/sentences" element={<ProtectedLayout><SentencesPage /></ProtectedLayout>} />
      <Route path="/paragraphs" element={<ProtectedLayout><ParagraphsPage /></ProtectedLayout>} />
      <Route path="/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
      <Route path="/progress" element={<ProtectedLayout><ProgressPage /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
