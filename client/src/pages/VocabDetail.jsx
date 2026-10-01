import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getVocabItem, updateVocabItem, deleteVocabItem, addSentence, updateSentence, deleteSentence, addContext, updateMeaning } from '../api';
import { Loading, StatusBadge, LevelBadge, TTSButton } from '../components/UI';

const STATUS_LABEL = { green: '🟢 Excelente', yellow: '🟡 Intermediário', red: '🔴 Fraco' };
const TENSES = [
  'Present Simple','Present Continuous','Past Simple','Past Continuous',
  'Present Perfect','Past Perfect','Future','Future with will',
  'Going to','Modal constructions','Conditionals',
];

// ── Componente de edição inline de frase ──────────────────────
function SentenceRow({ sentence, vocabId, onSaved, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    text: sentence.sentence_text,
    translation: sentence.translation || '',
    tense: sentence.tense || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSentence(vocabId, sentence.id, {
        sentence_text: form.text,
        translation: form.translation || null,
        tense: form.tense || null,
      });
      onSaved(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteSentence(vocabId, sentence.id);
      onDeleted(sentence.id);
    } finally {
      setSaving(false);
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div className="flashcard-sentence" style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
        <textarea
          className="form-textarea"
          value={form.text}
          onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          rows={2}
          style={{ fontSize: '14px' }}
        />
        <input
          className="form-input"
          placeholder="Tradução (opcional)"
          value={form.translation}
          onChange={e => setForm(p => ({ ...p, translation: e.target.value }))}
        />
        <select
          className="form-select"
          value={form.tense}
          onChange={e => setForm(p => ({ ...p, tense: e.target.value }))}
        >
          <option value="">Tempo verbal...</option>
          {TENSES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !form.text.trim()}>
            {saving ? '…' : '✓ Salvar'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancelar</button>
        </div>
      </div>
    );
  }

  if (deleting) {
    return (
      <div className="flashcard-sentence" style={{ gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--red-text)', fontSize: '13px' }}>⚠️ Excluir esta frase?</span>
        <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={saving}>
          {saving ? '…' : 'Confirmar'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setDeleting(false)}>Cancelar</button>
      </div>
    );
  }

  return (
    <div className="flashcard-sentence">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ flex: 1 }}>{sentence.sentence_text}</span>
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <TTSButton text={sentence.sentence_text} label="🔊" />
            <button
              onClick={() => setEditing(true)}
              title="Editar frase"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)', padding: '2px 4px' }}
            >✏️</button>
            <button
              onClick={() => setDeleting(true)}
              title="Excluir frase"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)', padding: '2px 4px' }}
            >🗑️</button>
          </div>
        </div>
        {sentence.translation && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>🇧🇷 {sentence.translation}</div>
        )}
        {sentence.tense && (
          <div style={{ marginTop: '6px' }}><span className="badge badge-gray">{sentence.tense}</span></div>
        )}
      </div>
    </div>
  );
}

// ── Componente de edição inline de significado ─────────────────
function MeaningRow({ meaning, vocabId, index, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(meaning.meaning_text);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const updated = await updateMeaning(vocabId, meaning.id, { meaning_text: text });
      onSaved(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div style={{ display: 'flex', gap: '8px', padding: '8px', background: 'var(--bg-surface)', borderRadius: '8px', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', minWidth: '20px' }}>{index + 1}.</span>
        <input
          className="form-input"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flex: 1, fontSize: '14px' }}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
        />
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !text.trim()}>
          {saving ? '…' : '✓'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setText(meaning.meaning_text); setEditing(false); }}>✕</button>
      </div>
    );
  }

  return (
    <div
      style={{ display: 'flex', gap: '10px', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '8px', alignItems: 'center', cursor: 'default' }}
    >
      <span style={{ color: 'var(--text-muted)', fontSize: '12px', minWidth: '20px' }}>{index + 1}.</span>
      <span style={{ color: 'var(--text-primary)', flex: 1 }}>{meaning.meaning_text}</span>
      <button
        onClick={() => setEditing(true)}
        title="Editar significado"
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)', padding: '2px 4px', flexShrink: 0 }}
      >✏️</button>
    </div>
  );
}

// ── Página Principal ───────────────────────────────────────────
export default function VocabDetail() {
  const { id } = useParams();
  const { student } = useApp();
  const navigate = useNavigate();
  const [vocab, setVocab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSentence, setShowAddSentence] = useState(false);
  const [showAddContext, setShowAddContext] = useState(false);
  const [newSentence, setNewSentence] = useState({ text: '', translation: '', tense: '', notes: '' });
  const [newContext, setNewContext] = useState({ name: '', description: '', example: '' });

  const load = () => {
    setLoading(true);
    getVocabItem(id, student?.id).then(setVocab).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!student) { navigate('/'); return; }
    load();
  }, [id, student]);

  const handleAddSentence = async (e) => {
    e.preventDefault();
    await addSentence(id, {
      sentence_text: newSentence.text,
      translation: newSentence.translation,
      tense: newSentence.tense,
      notes: newSentence.notes,
      studentId: student.id,
    });
    setNewSentence({ text: '', translation: '', tense: '', notes: '' });
    setShowAddSentence(false);
    load();
  };

  const handleAddContext = async (e) => {
    e.preventDefault();
    await addContext(id, {
      context_name: newContext.name,
      description: newContext.description,
      example_structure: newContext.example,
    });
    setNewContext({ name: '', description: '', example: '' });
    setShowAddContext(false);
    load();
  };

  const [showEditVerb, setShowEditVerb] = useState(false);
  const [verbForm, setVerbForm] = useState({
    word: '',
    primary_meaning: '',
    level: 'B1',
    difficulty: 3,
    is_irregular: false,
    notes: '',
  });
  const [savingVerb, setSavingVerb] = useState(false);
  const [deletingVerb, setDeletingVerb] = useState(false);

  const startEditVerb = () => {
    setVerbForm({
      word: vocab.word || '',
      primary_meaning: vocab.primary_meaning || '',
      level: vocab.level || 'B1',
      difficulty: vocab.difficulty || 3,
      is_irregular: !!vocab.is_irregular,
      notes: vocab.notes || '',
    });
    setShowEditVerb(true);
  };

  const handleSaveVerb = async (e) => {
    e.preventDefault();
    setSavingVerb(true);
    try {
      const updated = await updateVocabItem(id, verbForm);
      setVocab(v => ({ ...v, ...updated }));
      setShowEditVerb(false);
    } catch (err) {
      alert('Erro ao atualizar verbo: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingVerb(false);
    }
  };

  const handleDeleteVerb = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o verbo "${vocab.word}"? Esta ação removerá as frases e o histórico associados.`)) return;
    setDeletingVerb(true);
    try {
      await deleteVocabItem(id);
      navigate('/vocabulary');
    } catch (err) {
      alert('Erro ao excluir verbo: ' + (err.response?.data?.error || err.message));
      setDeletingVerb(false);
    }
  };

  // Atualiza frase localmente após edição
  const handleSentenceSaved = (updated) => {
    setVocab(v => ({
      ...v,
      sentences: v.sentences.map(s => s.id === updated.id ? { ...s, ...updated } : s),
    }));
  };

  // Remove frase localmente após exclusão
  const handleSentenceDeleted = (sentenceId) => {
    setVocab(v => ({
      ...v,
      sentences: v.sentences.filter(s => s.id !== sentenceId),
    }));
  };

  // Atualiza significado localmente após edição
  const handleMeaningSaved = (updated) => {
    setVocab(v => ({
      ...v,
      meanings: v.meanings.map(m => m.id === updated.id ? { ...m, ...updated } : m),
    }));
  };

  if (loading) return <div className="page"><Loading /></div>;
  if (!vocab) return <div className="page"><p>Verbo não encontrado.</p></div>;

  const accuracy = vocab.total_reviews > 0
    ? Math.round((vocab.total_correct / vocab.total_reviews) * 100)
    : null;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              {vocab.word}
            </h2>
            <LevelBadge level={vocab.level} />
            <StatusBadge status={vocab.status || 'red'} />
          </div>
          {vocab.primary_meaning && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>{vocab.primary_meaning}</p>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
            <TTSButton text={vocab.word} label="Ouvir pronúncia" />
            <span className="badge badge-gray">{vocab.type}</span>
            {vocab.is_irregular && <span className="badge badge-yellow">Irregular</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button onClick={startEditVerb} className="btn btn-secondary">✏️ Editar verbo</button>
          <button
            onClick={handleDeleteVerb}
            disabled={deletingVerb}
            className="btn btn-secondary"
            style={{ color: 'var(--red-text)', borderColor: 'var(--red-dim)' }}
          >
            {deletingVerb ? '…' : '🗑️ Excluir'}
          </button>
          <Link to={`/study?vocabId=${vocab.id}`} className="btn btn-primary">🎯 Estudar este verbo</Link>
        </div>
      </div>

      {/* Formulário de edição dos dados principais do verbo */}
      {showEditVerb && (
        <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--accent)' }}>
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <span className="card-title">✏️ Editar Dados do Verbo</span>
            <button onClick={() => setShowEditVerb(false)} className="btn btn-sm btn-ghost">✕ Fechar</button>
          </div>
          <form onSubmit={handleSaveVerb} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Palavra / Verbo (Inglês):</label>
                <input
                  className="form-input"
                  value={verbForm.word}
                  onChange={e => setVerbForm(p => ({ ...p, word: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Significado Principal (Português):</label>
                <input
                  className="form-input"
                  value={verbForm.primary_meaning}
                  onChange={e => setVerbForm(p => ({ ...p, primary_meaning: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid-3" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Nível CEFR:</label>
                <select
                  className="form-select"
                  value={verbForm.level}
                  onChange={e => setVerbForm(p => ({ ...p, level: e.target.value }))}
                >
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Dificuldade (1 a 5):</label>
                <select
                  className="form-select"
                  value={verbForm.difficulty}
                  onChange={e => setVerbForm(p => ({ ...p, difficulty: parseInt(e.target.value) }))}
                >
                  {[1, 2, 3, 4, 5].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Verbo irregular?</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '40px', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="edit_is_irregular"
                    checked={verbForm.is_irregular}
                    onChange={e => setVerbForm(p => ({ ...p, is_irregular: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="edit_is_irregular" style={{ fontSize: '13px', cursor: 'pointer' }}>
                    Sim, irregular
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Notas / Dicas de uso:</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={verbForm.notes}
                onChange={e => setVerbForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Ex: Seguido sempre de gerúndio (avoid doing), evitar preposição 'to'..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowEditVerb(false)} className="btn btn-ghost">Cancelar</button>
              <button type="submit" disabled={savingVerb} className="btn btn-primary">
                {savingVerb ? 'Salvando…' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
        {/* Estatísticas */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>📊 Estatísticas</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { l: 'Revisões', v: vocab.total_reviews || 0 },
              { l: 'Acertos', v: vocab.total_correct || 0 },
              { l: 'Erros', v: vocab.total_incorrect || 0 },
              { l: 'Taxa de acerto', v: accuracy !== null ? `${accuracy}%` : '—' },
              { l: 'Domínio', v: `${vocab.mastery_level || 0}/5` },
              { l: 'Prioridade', v: Math.round(vocab.review_priority || 0) },
            ].map(s => (
              <div key={s.l} style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.l}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{s.v}</div>
              </div>
            ))}
          </div>
          {vocab.next_review_at && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Próxima revisão: <strong style={{ color: 'var(--text-secondary)' }}>
                {new Date(vocab.next_review_at).toLocaleDateString('pt-BR')}
              </strong>
            </div>
          )}
        </div>

        {/* Formas verbais */}
        {vocab.is_irregular && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>📋 Formas Verbais</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { l: 'Base', v: vocab.word },
                { l: 'Past Simple', v: vocab.past_simple },
                { l: 'Past Participle', v: vocab.past_participle },
                { l: '3ª pessoa', v: vocab.third_person_singular },
                { l: 'Gerúndio', v: vocab.present_participle },
              ].filter(f => f.v).map(f => (
                <div key={f.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.l}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{f.v}</span>
                    {f.v && <TTSButton text={f.v} label="🔊" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Significados — com edição inline */}
        {vocab.meanings?.length > 0 && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>
              🌐 Significados <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>— clique ✏️ para editar</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {vocab.meanings.map((m, i) => (
                <MeaningRow
                  key={m.id || i}
                  meaning={m}
                  vocabId={id}
                  index={i}
                  onSaved={handleMeaningSaved}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tempos verbais */}
      {vocab.type === 'verb' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>⏰ Domínio por Tempo Verbal</div>
          <div className="tense-grid">
            {TENSES.map(tense => {
              const tp = vocab.tenses?.find(t => t.tense === tense);
              const st = tp?.status || 'red';
              const acc = tp && tp.total_reviews > 0
                ? Math.round((tp.total_correct / tp.total_reviews) * 100)
                : null;
              return (
                <div key={tense} className="tense-item">
                  <span className="tense-name">{tense}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {acc !== null && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{acc}%</span>}
                    <span>{st === 'green' ? '🟢' : st === 'yellow' ? '🟡' : '⚪'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contextos */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">🌐 Contextos de Uso</span>
          <button onClick={() => setShowAddContext(!showAddContext)} className="btn btn-sm btn-secondary">
            {showAddContext ? 'Cancelar' : '➕ Adicionar'}
          </button>
        </div>

        {showAddContext && (
          <form onSubmit={handleAddContext} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input className="form-input" placeholder="Nome do contexto (ex: avoid people)" value={newContext.name} onChange={e => setNewContext(p => ({ ...p, name: e.target.value }))} required />
            <input className="form-input" placeholder="Descrição" value={newContext.description} onChange={e => setNewContext(p => ({ ...p, description: e.target.value }))} />
            <input className="form-input" placeholder="Estrutura de exemplo" value={newContext.example} onChange={e => setNewContext(p => ({ ...p, example: e.target.value }))} />
            <button type="submit" className="btn btn-primary">Salvar contexto</button>
          </form>
        )}

        {vocab.contexts?.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {vocab.contexts.map(c => (
              <div key={c.id} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px 14px',
              }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{c.context_name}</div>
                {c.description && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{c.description}</div>}
                {c.example_structure && (
                  <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '3px', fontStyle: 'italic' }}>
                    Ex: {c.example_structure}
                  </div>
                )}
                <div style={{ marginTop: '8px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge badge-${c.context_status || 'gray'}`}>{STATUS_LABEL[c.context_status] || '⚪ Não praticado'}</span>
                  <Link to={`/study?vocabId=${id}`} className="btn btn-sm btn-ghost" style={{ padding: '2px 8px', fontSize: '11px' }}>
                    🎯 Praticar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nenhum contexto cadastrado.</p>
        )}
      </div>

      {/* Frases — com edição e exclusão inline */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">💬 Frases ({vocab.sentences?.length || 0})</span>
          <button onClick={() => setShowAddSentence(!showAddSentence)} className="btn btn-sm btn-secondary">
            {showAddSentence ? 'Cancelar' : '➕ Adicionar'}
          </button>
        </div>

        {showAddSentence && (
          <form onSubmit={handleAddSentence} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea className="form-textarea" placeholder="Frase em inglês" value={newSentence.text} onChange={e => setNewSentence(p => ({ ...p, text: e.target.value }))} required rows={2} />
            <input className="form-input" placeholder="Tradução (opcional)" value={newSentence.translation} onChange={e => setNewSentence(p => ({ ...p, translation: e.target.value }))} />
            <select className="form-select" value={newSentence.tense} onChange={e => setNewSentence(p => ({ ...p, tense: e.target.value }))}>
              <option value="">Tempo verbal...</option>
              {TENSES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Salvar frase</button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {vocab.sentences?.slice(0, 20).map(s => (
            <SentenceRow
              key={s.id}
              sentence={s}
              vocabId={id}
              onSaved={handleSentenceSaved}
              onDeleted={handleSentenceDeleted}
            />
          ))}
          {!vocab.sentences?.length && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nenhuma frase cadastrada.</p>}
        </div>
      </div>

      {/* Histórico de erros */}
      {vocab.errorSummary?.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '12px' }}>❌ Histórico de Erros</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {vocab.errorSummary.map(e => (
              <div key={e.error_category} style={{ background: 'var(--red-dim)', borderRadius: '8px', padding: '8px 12px' }}>
                <span style={{ color: 'var(--red-text)', fontWeight: 600 }}>{e.error_category}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '6px' }}>× {e.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
