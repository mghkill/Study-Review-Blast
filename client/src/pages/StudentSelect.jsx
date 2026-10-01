import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getStudents, createStudent, deleteStudent } from '../api';
import { Loading } from '../components/UI';

export default function StudentSelect() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState('B1');
  const { selectStudent } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    getStudents().then(setStudents).finally(() => setLoading(false));
  }, []);

  const handleSelect = (s) => {
    selectStudent(s);
    navigate('/dashboard');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const s = await createStudent({ name: newName.trim(), current_level: newLevel });
      setStudents(prev => [...prev, s]);
      setShowAdd(false);
      setNewName('');
      handleSelect(s);
    } catch (err) {
      alert('Erro ao criar estudante: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteStudent = async (e, id, name) => {
    e.stopPropagation();
    if (!window.confirm(`Tem certeza que deseja excluir o estudante "${name}"?`)) return;
    try {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      const cur = JSON.parse(localStorage.getItem('currentStudent') || 'null');
      if (cur?.id === id) localStorage.removeItem('currentStudent');
    } catch (err) {
      alert('Erro ao excluir estudante: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
      <Loading text="Carregando estudantes..." />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🇺🇸</div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          English Study
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
          Sua plataforma pessoal de aprendizado de inglês
        </p>
      </div>

      {/* Student selection */}
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
          Selecione o Estudante
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {students.map(s => (
            <div
              key={s.id}
              onClick={() => handleSelect(s)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '18px 24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s',
                textAlign: 'left',
                width: '100%',
                color: 'inherit',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
            >
              <div style={{
                width: '48px', height: '48px',
                background: 'var(--accent-dim)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Nível <span style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>{s.current_level}</span>
                  {s.total_vocab > 0 && ` · ${s.total_vocab} palavras`}
                  {s.pending_reviews > 0 && (
                    <span style={{ color: 'var(--red-text)', marginLeft: '8px' }}>
                      {s.pending_reviews} revisões pendentes
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  title="Excluir estudante"
                  onClick={(e) => handleDeleteStudent(e, s.id, s.name)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '15px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--red-text)'; e.currentTarget.style.background = 'var(--red-dim)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  🗑️
                </button>
                <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>›</span>
              </div>
            </div>
          ))}

          {/* Add student */}
          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                background: 'transparent',
                border: '1px dashed var(--border)',
                borderRadius: '14px',
                padding: '18px 24px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                width: '100%',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              ➕ Adicionar estudante
            </button>
          ) : (
            <form onSubmit={handleAdd} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--accent)',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px' }}>Novo Estudante</p>
              <input
                className="form-input"
                placeholder="Nome"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
                required
              />
              <select className="form-select" value={newLevel} onChange={e => setNewLevel(e.target.value)}>
                {['A1','A2','B1','B2','C1'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Criar e entrar</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '48px', textAlign: 'center' }}>
        Sem login · Sem internet · 100% local
      </p>
    </div>
  );
}
