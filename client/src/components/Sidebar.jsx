import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/study', icon: '🎯', label: 'Estudar Agora', highlight: true },
  { to: '/vocabulary', icon: '📚', label: 'Vocabulário' },
  { to: '/sentences', icon: '💬', label: 'Frases' },
  { to: '/paragraphs', icon: '📝', label: 'Parágrafos' },
  { to: '/progress', icon: '📈', label: 'Progresso' },
  { to: '/search', icon: '🔍', label: 'Buscar' },
];

export default function Sidebar({ pendingReviews = 0 }) {
  const { student, selectStudent } = useApp();
  const navigate = useNavigate();

  const handleChangeStudent = () => {
    selectStudent(null);
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>🇺🇸 English Study</h1>
        <p>Plataforma pessoal</p>
      </div>

      {student && (
        <div className="sidebar-student" onClick={handleChangeStudent} title="Trocar estudante">
          <div className="sidebar-student-name">👤 {student.name}</div>
          <span className="sidebar-student-level">{student.current_level}</span>
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navegação</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.to === '/study' && pendingReviews > 0 && (
              <span className="nav-badge">{pendingReviews}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-title" style={{ marginTop: 16 }}>Adicionar</div>
        <NavLink to="/add-verb" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">➕</span>
          Novo Verbo
        </NavLink>
      </nav>
    </aside>
  );
}
