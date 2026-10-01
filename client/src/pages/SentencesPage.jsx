import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSentences, createSentence, getVocabulary } from '../api';
import { Loading, TTSButton, EmptyState } from '../components/UI';

const TENSES = ['Present Simple','Present Continuous','Past Simple','Past Continuous',
  'Present Perfect','Past Perfect','Future','Future with will','Going to','Modal constructions','Conditionals'];

export default function SentencesPage() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [sentences, setSentences] = useState([]);
  const [vocab, setVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({
    sentence_text: '', translation: '', tense: '', vocabularyItemId: '', notes: '',
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      getSentences({ studentId: student?.id, q }),
      getVocabulary({ studentId: student?.id }),
    ]).then(([s, v]) => { setSentences(s); setVocab(v); }).finally(() => setLoading(false));
  };

  useEffect(() => { if (!student) { navigate('/'); return; } load(); }, [student, q]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createSentence({ ...form, studentId: student.id, source: 'teacher' });
    setForm({ sentence_text: '', translation: '', tense: '', vocabularyItemId: '', notes: '' });
    setShowAdd(false);
    load();
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>💬 Banco de Frases</h2>
          <p>{sentences.length} frases cadastradas</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancelar' : '➕ Nova Frase'}
        </button>
      </div>

      {/* Formulário de adição */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>✍️ Nova Frase</div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea className="form-textarea" placeholder="Frase em inglês" rows={3}
              value={form.sentence_text} onChange={e => setForm(p => ({ ...p, sentence_text: e.target.value }))} required />
            <input className="form-input" placeholder="Tradução (opcional)"
              value={form.translation} onChange={e => setForm(p => ({ ...p, translation: e.target.value }))} />
            <div className="grid-2">
              <select className="form-select" value={form.tense} onChange={e => setForm(p => ({ ...p, tense: e.target.value }))}>
                <option value="">Tempo verbal...</option>
                {TENSES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="form-select" value={form.vocabularyItemId} onChange={e => setForm(p => ({ ...p, vocabularyItemId: e.target.value }))}>
                <option value="">Associar verbo...</option>
                {vocab.map(v => <option key={v.id} value={v.id}>{v.word}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">✅ Salvar Frase</button>
          </form>
        </div>
      )}

      {/* Busca */}
      <div className="search-bar" style={{ marginBottom: '16px' }}>
        <span className="search-icon">🔍</span>
        <input placeholder="Buscar frases..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {loading ? <Loading /> : sentences.length === 0 ? (
        <EmptyState icon="💬" title="Nenhuma frase encontrada" subtitle="Adicione frases ao seu banco de estudos" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sentences.map(s => (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '6px' }}>
                    "{s.sentence_text}"
                  </div>
                  {s.translation && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🇧🇷 {s.translation}</div>
                  )}
                </div>
                <TTSButton text={s.sentence_text} label="🔊" />
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {s.word && (
                  <Link to={`/vocabulary/${s.vocabulary_item_id}`}>
                    <span className="badge badge-blue">{s.word}</span>
                  </Link>
                )}
                {s.tense && <span className="badge badge-gray">{s.tense}</span>}
                {s.context_name && <span className="badge badge-gray">{s.context_name}</span>}
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {new Date(s.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
