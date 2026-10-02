import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createVocabItem } from '../api';
import { useTenses } from '../hooks/useTenses';

export default function AddVerb() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    word: '', type: 'verb', level: 'B1',
    primary_meaning: '', difficulty: '3', is_irregular: false,
    notes: '',
  });
  const [meanings, setMeanings] = useState(['']);
  const [contexts, setContexts] = useState([{ name: '', description: '', example: '' }]);
  const [forms, setForms] = useState({ past_simple: '', past_participle: '', present_participle: '', third_person: '' });
  const [sentences, setSentences] = useState([{ text: '', tense: '', translation: '' }]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.word.trim()) return;
    setSaving(true);
    try {
      const vocab = await createVocabItem({
        ...form,
        difficulty: parseInt(form.difficulty),
        studentId: student.id,
        meanings: meanings.filter(m => m.trim()),
        contexts: contexts.filter(c => c.name.trim()),
        forms: form.is_irregular ? forms : null,
      });
      navigate(`/vocabulary/${vocab.id}`);
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
      setSaving(false);
    }
  };

  if (!student) { navigate('/'); return null; }

  return (
    <div className="page" style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h2>➕ Novo Verbo / Palavra</h2>
        <p>Adicione um novo item ao seu vocabulário</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Dados básicos */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>📝 Dados Básicos</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Palavra / Verbo *</label>
              <input className="form-input" placeholder="Ex: avoid" value={form.word}
                onChange={e => set('word', e.target.value)} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                {[['verb','Verbo'],['noun','Substantivo'],['adjective','Adjetivo'],
                  ['adverb','Advérbio'],['phrasal_verb','Phrasal Verb'],['expression','Expressão'],
                  ['grammar','Gramática'],['other','Outro']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nível CEFR</label>
              <select className="form-select" value={form.level} onChange={e => set('level', e.target.value)}>
                {['A1','A2','B1','B2','C1'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dificuldade (1–5)</label>
              <select className="form-select" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                {[1,2,3,4,5].map(d => <option key={d} value={d}>{d} {'⭐'.repeat(d)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Significado Principal (PT)</label>
            <input className="form-input" placeholder="Ex: evitar" value={form.primary_meaning}
              onChange={e => set('primary_meaning', e.target.value)} />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
              <input type="checkbox" checked={form.is_irregular} onChange={e => set('is_irregular', e.target.checked)} />
              Verbo irregular
            </label>
          </div>
          {form.notes !== undefined && (
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea className="form-textarea" rows={2} placeholder="Observações, regras, uso..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          )}
        </div>

        {/* Formas irregulares */}
        {form.is_irregular && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>📋 Formas Verbais Irregulares</div>
            <div className="grid-2">
              {[['past_simple','Past Simple'],['past_participle','Past Participle'],
                ['present_participle','Gerúndio (-ing)'],['third_person','3ª pessoa (he/she/it)']].map(([k,l]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" value={forms[k]} onChange={e => setForms(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Significados */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>🌐 Significados em Português</div>
          {meanings.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input className="form-input" placeholder={`Significado ${i + 1}`} value={m}
                onChange={e => { const a = [...meanings]; a[i] = e.target.value; setMeanings(a); }} />
              {meanings.length > 1 && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMeanings(meanings.filter((_, j) => j !== i))}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMeanings([...meanings, ''])}>
            + Adicionar significado
          </button>
        </div>

        {/* Contextos */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>🌐 Contextos de Uso</div>
          {contexts.map((c, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input className="form-input" placeholder="Nome do contexto" value={c.name}
                  onChange={e => { const a = [...contexts]; a[i].name = e.target.value; setContexts(a); }} />
                {contexts.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setContexts(contexts.filter((_, j) => j !== i))}>✕</button>
                )}
              </div>
              <input className="form-input" placeholder="Descrição" value={c.description}
                onChange={e => { const a = [...contexts]; a[i].description = e.target.value; setContexts(a); }}
                style={{ marginBottom: '8px' }} />
              <input className="form-input" placeholder="Estrutura de exemplo" value={c.example}
                onChange={e => { const a = [...contexts]; a[i].example = e.target.value; setContexts(a); }} />
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm"
            onClick={() => setContexts([...contexts, { name: '', description: '', example: '' }])}>
            + Adicionar contexto
          </button>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ flex: 1 }}>
            {saving ? '⏳ Salvando...' : '✅ Salvar Verbo'}
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
