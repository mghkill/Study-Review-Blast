import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getParagraphs, createParagraph, getVocabulary } from '../api';
import { Loading, TTSButton, EmptyState } from '../components/UI';

export default function ParagraphsPage() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [paragraphs, setParagraphs] = useState([]);
  const [vocab, setVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ paragraph_text: '', notes: '', vocabularyIds: [] });

  const load = () => {
    setLoading(true);
    Promise.all([
      getParagraphs(student?.id),
      getVocabulary({ studentId: student?.id }),
    ]).then(([p, v]) => { setParagraphs(p); setVocab(v); }).finally(() => setLoading(false));
  };

  useEffect(() => { if (!student) { navigate('/'); return; } load(); }, [student]);

  const toggleVocab = (id) => {
    setForm(prev => ({
      ...prev,
      vocabularyIds: prev.vocabularyIds.includes(id)
        ? prev.vocabularyIds.filter(v => v !== id)
        : [...prev.vocabularyIds, id],
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await createParagraph({ ...form, studentId: student.id });
    setForm({ paragraph_text: '', notes: '', vocabularyIds: [] });
    setShowAdd(false);
    load();
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>📝 Parágrafos</h2>
          <p>Textos completos usando múltiplos vocabulários</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancelar' : '➕ Novo Parágrafo'}
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>✍️ Novo Parágrafo</div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea className="form-textarea" placeholder="Texto em inglês..." rows={5}
              value={form.paragraph_text} onChange={e => setForm(p => ({ ...p, paragraph_text: e.target.value }))} required />
            <input className="form-input" placeholder="Notas (vocabulários utilizados, contexto...)"
              value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            <div>
              <label className="form-label">Vocabulários utilizados neste parágrafo</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {vocab.map(v => (
                  <button type="button" key={v.id}
                    onClick={() => toggleVocab(v.id)}
                    className={`btn btn-sm ${form.vocabularyIds.includes(v.id) ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {v.word}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">✅ Salvar Parágrafo</button>
          </form>
        </div>
      )}

      {loading ? <Loading /> : paragraphs.length === 0 ? (
        <EmptyState icon="📝" title="Nenhum parágrafo cadastrado" subtitle="Crie textos usando múltiplos verbos aprendidos" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {paragraphs.map(p => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '15px', flex: 1 }}>
                  {p.paragraph_text}
                </div>
                <TTSButton text={p.paragraph_text} label="🔊 Ouvir" />
              </div>
              {p.notes && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>📌 {p.notes}</div>}
              {p.vocabulary?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {p.vocabulary.map(v => v && (
                    <span key={v.id} className="badge badge-blue">{v.word}</span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
                {new Date(p.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
