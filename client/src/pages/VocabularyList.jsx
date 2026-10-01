import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getVocabulary } from '../api';
import { Loading, StatusBadge, LevelBadge, EmptyState, TTSButton } from '../components/UI';

export default function VocabularyList() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', level: '', status: '', q: '' });

  useEffect(() => {
    if (!student) { navigate('/'); return; }
    setLoading(true);
    getVocabulary({ studentId: student.id, ...filters })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [student, filters]);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>📚 Vocabulário</h2>
          <p>Todos os itens cadastrados</p>
        </div>
        <Link to="/add-verb" className="btn btn-primary">➕ Novo Verbo</Link>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ maxWidth: '200px' }}
          placeholder="🔍 Buscar palavra..."
          value={filters.q}
          onChange={e => setFilter('q', e.target.value)}
        />
        <select className="form-select" style={{ width: 'auto' }} value={filters.type} onChange={e => setFilter('type', e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="verb">Verbos</option>
          <option value="noun">Substantivos</option>
          <option value="adjective">Adjetivos</option>
          <option value="phrasal_verb">Phrasal Verbs</option>
          <option value="expression">Expressões</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filters.level} onChange={e => setFilter('level', e.target.value)}>
          <option value="">Todos os níveis</option>
          {['A1','A2','B1','B2','C1'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filters.status} onChange={e => setFilter('status', e.target.value)}>
          <option value="">Todos os status</option>
          <option value="green">🟢 Excelente</option>
          <option value="yellow">🟡 Intermediário</option>
          <option value="red">🔴 Fraco</option>
        </select>
      </div>

      {loading ? <Loading /> : items.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Nenhum item encontrado"
          subtitle="Adicione seu primeiro verbo para começar"
          action={<Link to="/add-verb" className="btn btn-primary" style={{ marginTop: '16px' }}>➕ Adicionar Verbo</Link>}
        />
      ) : (
        <div className="item-list">
          {items.map(item => {
            const accuracy = item.total_reviews > 0
              ? Math.round((item.total_correct / item.total_reviews) * 100)
              : null;

            return (
              <Link key={item.id} to={`/vocabulary/${item.id}`} className="item-row">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span className="item-word">{item.word}</span>
                    <LevelBadge level={item.level} />
                    <span className="badge badge-gray" style={{ fontSize: '10px' }}>{item.type}</span>
                  </div>
                  {item.primary_meaning && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.primary_meaning}</span>
                  )}
                </div>

                <TTSButton text={item.word} label="🔊" />

                {accuracy !== null && (
                  <span style={{ fontSize: '12px', color: accuracy >= 75 ? 'var(--green-text)' : accuracy >= 50 ? 'var(--yellow-text)' : 'var(--red-text)', fontWeight: 600 }}>
                    {accuracy}%
                  </span>
                )}

                <StatusBadge status={item.status || 'red'} />

                {item.review_priority > 60 && (
                  <span style={{ fontSize: '11px', color: 'var(--red-text)' }}>⚡ Alta prioridade</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
