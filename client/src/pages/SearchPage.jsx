import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getVocabulary } from '../api';
import { StatusBadge, LevelBadge, TTSButton } from '../components/UI';

export default function SearchPage() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    const r = await getVocabulary({ studentId: student?.id, q });
    setResults(r);
    setLoading(false);
  };

  if (!student) { navigate('/'); return null; }

  return (
    <div className="page">
      <div className="page-header">
        <h2>🔍 Buscar</h2>
        <p>Encontre qualquer palavra, frase ou expressão</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', maxWidth: '500px' }}>
        <input
          className="form-input"
          placeholder="Digite uma palavra..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
          autoFocus
        />
        <button className="btn btn-primary" onClick={doSearch} disabled={loading}>
          {loading ? '⏳' : '🔍'} Buscar
        </button>
      </div>

      {searched && !loading && results.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p>Nenhum resultado para "<strong>{q}</strong>"</p>
          <Link to="/add-verb" className="btn btn-primary" style={{ marginTop: '16px' }}>
            ➕ Adicionar este verbo
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{results.length} resultado(s) encontrado(s)</p>
          {results.map(item => {
            const accuracy = item.total_reviews > 0
              ? Math.round((item.total_correct / item.total_reviews) * 100)
              : null;
            const contexts = Array.isArray(item.contexts) ? item.contexts : [];
            const meanings = Array.isArray(item.meanings) ? item.meanings : [];

            return (
              <Link key={item.id} to={`/vocabulary/${item.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.word}</span>
                    <LevelBadge level={item.level} />
                    <span className="badge badge-gray">{item.type}</span>
                    <StatusBadge status={item.status || 'red'} />
                    <div style={{ marginLeft: 'auto' }}>
                      <TTSButton text={item.word} label="🔊" />
                    </div>
                  </div>

                  {meanings.length > 0 && (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {meanings.map(m => m.text || m.meaning_text).join(' · ')}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {contexts.slice(0,4).map(c => (
                      <span key={c.id || c.name} className="badge badge-gray">{c.name}</span>
                    ))}
                    {accuracy !== null && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {item.total_reviews} revisões · {accuracy}% acerto
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
