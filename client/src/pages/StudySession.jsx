import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getReviewQueue, submitReview, startSession, endSession, submitStudentSentence, getVocabulary } from '../api';
import { Loading, TTSButton, StatusBadge } from '../components/UI';

const ERROR_CATEGORIES = [
  'meaning','grammar','tense','conjugation','preposition',
  'collocation','sentence_structure','context','pronunciation','spelling','word_choice'
];
const ERROR_LABELS = {
  meaning: 'Significado', grammar: 'Gramática', tense: 'Tempo verbal',
  conjugation: 'Conjugação', preposition: 'Preposição', collocation: 'Collocation',
  sentence_structure: 'Estrutura', context: 'Contexto', pronunciation: 'Pronúncia',
  spelling: 'Ortografia', word_choice: 'Escolha de palavra',
};

function maskWord(text, word) {
  if (!text || !word) return text;
  const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
  const masked = text.replace(regex, '[ _______ ]');
  return masked !== text ? masked : text.replace(/\b\w+\b/, '[ _______ ]');
}

// ────────────────────────────────────────────────────────────────
// Modal de Quiz Personalizado
// O professor digita a pergunta que vai aparecer no card.
// ────────────────────────────────────────────────────────────────
function CustomQuizSetup({ vocabs, onStart, onCancel }) {
  const [questions, setQuestions] = useState([{ prompt: '', vocabId: '' }]);
  const [blockSize, setBlockSize] = useState(5);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => setQuestions(q => [...q, { prompt: '', vocabId: '' }]);
  const removeQuestion = (i) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, val) =>
    setQuestions(q => q.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const valid = questions.every(q => q.prompt.trim() && q.vocabId);

  const handleStart = () => {
    if (!valid) return;
    setSaving(true);
    // Montar "deck" combinando os dados do vocab com a pergunta personalizada
    const deck = questions.map(q => {
      const vocab = vocabs.find(v => String(v.id) === String(q.vocabId));
      return { ...vocab, custom_prompt: q.prompt };
    });
    onStart(deck);
  };

  return (
    <div style={{ maxWidth: '760px', padding: '0 0 40px 0' }}>
      <div className="page-header">
        <h2>🃏 Quiz Personalizado</h2>
        <p>Monte seu próprio quiz. Você define a pergunta — o sistema mostra a resposta e registra no SRS.</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-title" style={{ marginBottom: '14px' }}>⚙️ Configuração</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tamanho dos blocos:</label>
          {[5, 10].map(n => (
            <button
              key={n}
              className={`btn btn-sm ${blockSize === n ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setBlockSize(n)}
            >{n} questões</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        {questions.map((q, i) => (
          <div key={i} className="card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '14px' }}>Questão {i + 1}</span>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(i)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
                >✕</button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Verbo alvo */}
              <select
                className="form-select"
                value={q.vocabId}
                onChange={e => updateQuestion(i, 'vocabId', e.target.value)}
              >
                <option value="">Selecione o verbo / item...</option>
                {vocabs.map(v => {
                  const dot = v.status === 'green' ? '🟢' : v.status === 'yellow' ? '🟡' : '🔴';
                  return (
                    <option key={v.id} value={v.id}>
                      {dot} {v.word} ({v.level}) — {v.primary_meaning || ''}
                    </option>
                  );
                })}
              </select>

              {/* Pergunta customizada */}
              <textarea
                className="form-textarea"
                rows={2}
                placeholder={`Ex: "Como usar '${q.vocabId ? vocabs.find(v=>String(v.id)===String(q.vocabId))?.word || '...' : '...'}' no Past Perfect?" ou "Traduza: Eu evitava encontrá-la."`}
                value={q.prompt}
                onChange={e => updateQuestion(i, 'prompt', e.target.value)}
              />

              {/* Sugestões de Contextos para a Pergunta */}
              {(() => {
                const target = vocabs.find(v => String(v.id) === String(q.vocabId));
                if (!target) return null;
                const ctxList = Array.isArray(target.contexts) ? target.contexts : [];
                if (ctxList.length === 0) return null;
                return (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>💡 Inserir contexto:</span>
                    {ctxList.map(c => {
                      const name = c.name || c.context_name || c;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => updateQuestion(i, 'prompt', `Como aplicar "${target.word}" no contexto de "${name}"? Crie uma frase.`)}
                          className="badge badge-blue"
                          style={{ cursor: 'pointer', border: '1px solid rgba(56,139,253,0.4)', background: 'rgba(56,139,253,0.1)' }}
                        >
                          + {name}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={addQuestion}>
          ➕ Adicionar questão
        </button>
        <button
          className="btn btn-primary"
          disabled={!valid || saving}
          onClick={handleStart}
        >
          {saving ? '…' : `▶ Iniciar quiz (${questions.length} questões)`}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Tela do card do Quiz Personalizado
// ────────────────────────────────────────────────────────────────
function CustomQuizCard({ item, index, total, sessionResults, onSubmit, submitting, submitError }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [studentSentence, setStudentSentence] = useState('');
  const [errorCategories, setErrorCategories] = useState([]);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [selectedTense, setSelectedTense] = useState('');

  const sample = Array.isArray(item.sample_sentences) ? item.sample_sentences : [];
  const meanings = Array.isArray(item.meanings) ? item.meanings : [];
  const contexts = Array.isArray(item.contexts) ? item.contexts : [];

  const toggleError = (cat) =>
    setErrorCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const handleResult = (result) => {
    onSubmit(result, { studentSentence, errorCategories, teacherNotes, tensePracticed: selectedTense });
    setShowAnswer(false);
    setStudentSentence('');
    setErrorCategories([]);
    setTeacherNotes('');
    setSelectedTense('');
  };

  const progress = Math.round((index / total) * 100);

  return (
    <div className="page" style={{ maxWidth: '720px' }}>
      {/* Progresso */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>{index + 1} / {total}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar blue" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card da pergunta */}
      <div className="flashcard" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge badge-blue">{item.level}</span>
          <span className="badge badge-gray">{item.type}</span>
          <StatusBadge status={item.status} />
          <span style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
            🃏 Quiz Personalizado
          </span>
        </div>

        <div className="flashcard-word">{item.word}</div>
        <TTSButton text={item.word} label="Ouvir" />

        {/* Pergunta do professor */}
        <div style={{
          background: 'var(--bg-hover)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginTop: '12px',
          width: '100%',
          textAlign: 'left',
          borderLeft: '3px solid var(--accent)',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
            📋 Pergunta
          </div>
          <div style={{ fontSize: '16px', color: 'var(--text-primary)', lineHeight: '1.5', fontWeight: 500 }}>
            {item.custom_prompt}
          </div>
        </div>

        {/* Resposta revelada */}
        {showAnswer && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {meanings.length > 0 && (
              <div style={{ background: 'var(--bg-hover)', borderRadius: '10px', padding: '14px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Significado</div>
                <div style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {meanings.map(m => m.text || m.meaning_text).join(' · ')}
                </div>
              </div>
            )}
            {contexts.length > 0 && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Contextos de Uso</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {contexts.map(c => (
                    <span key={c.id || c.name || c} className="badge badge-gray">{c.name || c.context_name || c}</span>
                  ))}
                </div>
              </div>
            )}
            {sample.slice(0, 2).map((s, i) => (
              <div key={i} className="flashcard-sentence">
                {s.sentence_text}
                <TTSButton text={s.sentence_text} label="🔊" />
              </div>
            ))}
          </div>
        )}

        {!showAnswer && (
          <button onClick={() => setShowAnswer(true)} className="btn btn-secondary btn-lg" style={{ marginTop: '12px' }}>
            👁️ Revelar Resposta
          </button>
        )}
      </div>

      {/* Avaliação após revelação */}
      {showAnswer && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Frase criada */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>✍️ Sua resposta (opcional)</div>
            <textarea
              className="form-textarea"
              placeholder="Escreva sua resposta ou use o verbo em uma frase..."
              value={studentSentence}
              onChange={e => setStudentSentence(e.target.value)}
              rows={2}
            />
            {studentSentence && <TTSButton text={studentSentence} label="Ouvir minha resposta" />}
          </div>

          {/* Tempo verbal */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>⏰ Tempo verbal praticado</div>
            <select className="form-select" value={selectedTense} onChange={e => setSelectedTense(e.target.value)}>
              <option value="">Selecionar...</option>
              {['Present Simple','Present Continuous','Past Simple','Past Continuous',
                'Present Perfect','Past Perfect','Future','Future with will','Going to',
                'Modal constructions','Conditionals'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Categorias de erro */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>❌ Categorias de Erro (se houver)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ERROR_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleError(cat)}
                  className={`btn btn-sm ${errorCategories.includes(cat) ? 'btn-danger' : 'btn-ghost'}`}
                >
                  {ERROR_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>📝 Observação (opcional)</div>
            <input
              className="form-input"
              placeholder='"Use depend on, not depend of."'
              value={teacherNotes}
              onChange={e => setTeacherNotes(e.target.value)}
            />
          </div>

          {/* Botões de resultado */}
          <div style={{ marginTop: '4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '4px' }}>
              Como foi o desempenho?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '14px' }}>
              Avalie honestamente — isso alimenta o algoritmo SRS
            </p>

            {submitError && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid var(--red-border, #ef4444)',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
                color: 'var(--red-text, #ef4444)', fontSize: '13px', textAlign: 'center',
              }}>
                ⚠️ {submitError}
              </div>
            )}

            <div className="result-grid">
              <button className="result-btn result-btn-hard" disabled={submitting} onClick={() => handleResult('incorrect')}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                <span style={{ fontSize: '24px' }}>🔴</span>
                <span style={{ fontWeight: 700 }}>Difícil / Erro</span>
              </button>
              <button className="result-btn result-btn-partial" disabled={submitting} onClick={() => handleResult('partial')}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                <span style={{ fontSize: '24px' }}>🟡</span>
                <span style={{ fontWeight: 700 }}>Parcial</span>
              </button>
              <button className="result-btn result-btn-easy" disabled={submitting} onClick={() => handleResult('correct')}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                <span style={{ fontSize: '24px' }}>🟢</span>
                <span style={{ fontWeight: 700 }}>Fácil / Correto</span>
              </button>
            </div>

            {submitting && (
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                ⏳ Registrando no SRS...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Componente Principal
// ────────────────────────────────────────────────────────────────
export default function StudySession() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('mixed');
  const [queue, setQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('choose'); // choose | custom_setup | custom_quiz | front | answer | evaluate | result | done
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [availableVocabs, setAvailableVocabs] = useState([]);
  const [selectedVerbId, setSelectedVerbId] = useState('');
  const [selectedCefrFilter, setSelectedCefrFilter] = useState('all');

  // Avaliação (modo padrão)
  const [showAnswer, setShowAnswer] = useState(false);
  const [studentSentence, setStudentSentence] = useState('');
  const [pronunciationCorrect, setPronunciationCorrect] = useState(null);
  const [pronunciationRating, setPronunciationRating] = useState('');
  const [errorCategories, setErrorCategories] = useState([]);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [selectedTense, setSelectedTense] = useState('');
  const [sessionResults, setSessionResults] = useState([]);
  const [emptyNotice, setEmptyNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showContextHint, setShowContextHint] = useState(false);
  const [showClozeHint, setShowClozeHint] = useState(false);

  const currentItem = queue[currentIdx];

  // Carregar vocabulários disponíveis
  useEffect(() => {
    if (!student) return;
    getVocabulary({ studentId: student.id })
      .then(items => setAvailableVocabs(items || []))
      .catch(() => {});
  }, [student]);

  // Parâmetros de URL
  useEffect(() => {
    if (!student) return;
    const urlVocabId = searchParams.get('vocabId');
    const urlLevel = searchParams.get('level');
    const urlMode = searchParams.get('mode');

    if (urlVocabId) {
      setSelectedVerbId(urlVocabId);
      startStudy('specific_verb', { vocabId: urlVocabId });
    } else if (urlLevel) {
      setSelectedCefrFilter(urlLevel);
      startStudy('mixed', { level: urlLevel });
    } else if (urlMode) {
      startStudy(urlMode);
    }
  }, [searchParams, student]);

  const startStudy = async (selectedMode, extraParams = {}) => {
    setLoading(true);
    setEmptyNotice(null);
    setSubmitError(null);
    setMode(selectedMode);
    try {
      const sessionType = extraParams.vocabId ? 'specific_verb' : selectedMode;
      const session = await startSession({ studentId: student.id, sessionType });
      setSessionId(session.id);

      const queueParams = {
        studentId: student.id,
        mode: selectedMode,
        limit: 13,
        ...extraParams,
      };

      const queueData = await getReviewQueue(queueParams);
      if (!queueData?.items || queueData.items.length === 0) {
        setEmptyNotice('Nenhum item encontrado com os filtros selecionados. Tente a "Sessão Completa" ou outro verbo!');
        setPhase('choose');
        setLoading(false);
        return;
      }
      setQueue(queueData.items);
      setCurrentIdx(0);
      setPhase('front');
    } catch (err) {
      console.error(err);
      setEmptyNotice('Erro ao iniciar a sessão: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Inicia sessão de quiz personalizado com o deck construído pelo professor
  const startCustomQuiz = async (deck) => {
    setLoading(true);
    try {
      const session = await startSession({ studentId: student.id, sessionType: 'custom_quiz' });
      setSessionId(session.id);
      setQueue(deck);
      setCurrentIdx(0);
      setPhase('custom_quiz');
    } catch (err) {
      console.error(err);
      setEmptyNotice('Erro ao iniciar quiz: ' + (err.response?.data?.error || err.message));
      setPhase('choose');
    } finally {
      setLoading(false);
    }
  };

  const submitResult = async (result, extra = {}) => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const item = currentItem;
    const difficultyMap = { correct: 'easy', partial: 'medium', incorrect: 'hard' };

    try {
      await submitReview({
        studentId: student.id,
        vocabularyItemId: item.vocabulary_item_id || item.id,
        sessionId,
        result,
        difficultyRating: difficultyMap[result],
        teacherNotes: (extra.teacherNotes || teacherNotes) || undefined,
        pronunciationCorrect: extra.pronunciationCorrect ?? pronunciationCorrect ?? undefined,
        pronunciationRating: (extra.pronunciationRating || pronunciationRating) || undefined,
        tensePracticed: (extra.tensePracticed || selectedTense) || undefined,
        errorCategories: extra.errorCategories || errorCategories,
        selectionReason: item.selection_reason,
        studentAnswer: (extra.studentSentence || studentSentence) || undefined,
      });

      const sentence = extra.studentSentence || studentSentence;
      const tense = extra.tensePracticed || selectedTense;
      if (sentence?.trim()) {
        await submitStudentSentence({
          studentId: student.id,
          vocabularyItemId: item.vocabulary_item_id || item.id,
          sentenceText: sentence,
          tense,
          teacherResult: result === 'correct' ? 'correct' : result === 'partial' ? 'partial' : 'incorrect',
          teacherNotes: extra.teacherNotes || teacherNotes,
        }).catch(() => {});
      }

      setSessionResults(prev => [...prev, { item, result }]);

      // Reset
      setShowAnswer(false);
      setStudentSentence('');
      setPronunciationCorrect(null);
      setPronunciationRating('');
      setErrorCategories([]);
      setTeacherNotes('');
      setSelectedTense('');
      setShowContextHint(false);
      setShowClozeHint(false);

      if (currentIdx + 1 >= queue.length) {
        if (sessionId) await endSession(sessionId).catch(() => {});
        setPhase('done');
      } else {
        setCurrentIdx(i => i + 1);
        if (phase === 'custom_quiz') {
          setPhase('custom_quiz'); // mantém modo quiz
        } else {
          setPhase('front');
        }
      }
    } catch (err) {
      console.error('Erro ao salvar revisão:', err);
      setSubmitError('Erro ao registrar a resposta: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleErrorCategory = (cat) => {
    setErrorCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (!student) { navigate('/'); return null; }

  // ── SETUP DO QUIZ PERSONALIZADO ───────────────────────────────
  if (phase === 'custom_setup') {
    return (
      <div className="page">
        <CustomQuizSetup
          vocabs={availableVocabs}
          onStart={startCustomQuiz}
          onCancel={() => setPhase('choose')}
        />
        {loading && <Loading text="Iniciando quiz..." />}
      </div>
    );
  }

  // ── QUIZ PERSONALIZADO (cards) ────────────────────────────────
  if (phase === 'custom_quiz' && currentItem) {
    return (
      <CustomQuizCard
        item={currentItem}
        index={currentIdx}
        total={queue.length}
        sessionResults={sessionResults}
        onSubmit={submitResult}
        submitting={submitting}
        submitError={submitError}
      />
    );
  }

  // ── TELA INICIAL ──────────────────────────────────────────────
  if (phase === 'choose') {
    return (
      <div className="page">
        <div className="page-header">
          <h2>🎯 Estudar Agora</h2>
          <p>Escolha como deseja estudar hoje</p>
        </div>

        {emptyNotice && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--accent)',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
            maxWidth: '800px', color: 'var(--text-primary)', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>💡 {emptyNotice}</span>
            <button
              onClick={() => setEmptyNotice(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
            >✕</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', maxWidth: '850px', marginBottom: '28px' }}>
          {[
            { mode: 'mixed', icon: '🔀', title: 'Sessão Completa', desc: 'Algoritmo inteligente: revisões + novas + reforço contínuo' },
            { mode: 'weak', icon: '🔴', title: 'Foco nos Fracos', desc: 'Treinar apenas palavras no vermelho ou com erros' },
            { mode: 'yellow', icon: '🟡', title: 'Consolidação', desc: 'Transformar palavras intermediárias em verdes' },
            { mode: 'green', icon: '🟢', title: 'Manutenção / Fluência', desc: 'Exercitar o que você já domina para retenção' },
            { mode: 'all', icon: '⚡', title: 'Treino Livre Sem Fim', desc: 'Praticar todo o vocabulário sem limites de data' },
          ].map(m => (
            <button
              key={m.mode}
              onClick={() => startStudy(m.mode, selectedCefrFilter !== 'all' ? { level: selectedCefrFilter } : {})}
              disabled={loading}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '20px', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.2s', color: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
            >
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{m.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{m.desc}</div>
            </button>
          ))}

          {/* Card do Quiz Personalizado */}
          <button
            onClick={() => setPhase('custom_setup')}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.1) 100%)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: '14px', padding: '20px', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.2s', color: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.1) 100%)'; }}
          >
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🃏</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#a78bfa', marginBottom: '4px' }}>Quiz Personalizado</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Você define a pergunta — o sistema mostra a resposta e registra no SRS (estilo Anki)
            </div>
          </button>
        </div>

        {/* Escolher Verbo Específico */}
        <div className="card" style={{ maxWidth: '850px', marginBottom: '24px' }}>
          <div className="card-title" style={{ marginBottom: '6px' }}>🎯 Treinar um Verbo Específico</div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Quer focar em uma palavra até ficar 100% seguro? Escolha o verbo abaixo e pratique imediatamente:
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ flex: 1, minWidth: '220px' }}
              value={selectedVerbId}
              onChange={e => setSelectedVerbId(e.target.value)}
            >
              <option value="">Selecione um verbo para treinar...</option>
              {availableVocabs.map(v => {
                const statusDot = v.status === 'green' ? '🟢' : v.status === 'yellow' ? '🟡' : '🔴';
                return (
                  <option key={v.id} value={v.id}>
                    {statusDot} {v.word} ({v.level}) — {v.primary_meaning || ''}
                  </option>
                );
              })}
            </select>

            <button
              className="btn btn-primary"
              disabled={!selectedVerbId || loading}
              onClick={() => { if (selectedVerbId) startStudy('specific_verb', { vocabId: selectedVerbId }); }}
            >
              ▶ Treinar Este Verbo
            </button>
          </div>
        </div>

        {/* Filtro por Nível CEFR */}
        <div className="card" style={{ maxWidth: '850px' }}>
          <div className="card-title" style={{ marginBottom: '6px' }}>🎓 Filtrar por Nível CEFR</div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Escolha o nível que deseja focar nas sessões:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedCefrFilter(lvl)}
                className={`btn btn-sm ${selectedCefrFilter === lvl ? 'btn-primary' : 'btn-ghost'}`}
              >
                {lvl === 'all' ? '🌐 Todos os Níveis' : `Nível ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{ marginTop: '32px' }}><Loading text="Preparando sessão..." /></div>}
      </div>
    );
  }

  // ── CONCLUÍDO ─────────────────────────────────────────────────
  if (phase === 'done') {
    const correct = sessionResults.filter(r => r.result === 'correct').length;
    const partial = sessionResults.filter(r => r.result === 'partial').length;
    const incorrect = sessionResults.filter(r => r.result === 'incorrect').length;
    const total = sessionResults.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="page" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Sessão Concluída!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ótimo trabalho! Aqui está o resumo:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '32px 0' }}>
            {[
              { label: '✅ Corretas', count: correct, color: 'var(--green-text)' },
              { label: '🟡 Parciais', count: partial, color: 'var(--yellow-text)' },
              { label: '❌ Erradas', count: incorrect, color: 'var(--red-text)' },
            ].map(r => (
              <div key={r.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: r.color }}>{r.count}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{r.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px', marginBottom: '32px',
          }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: pct >= 75 ? 'var(--green-text)' : 'var(--yellow-text)' }}>
              {pct}%
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Taxa de acerto ({total} itens)</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => { setPhase('choose'); setQueue([]); setSessionResults([]); }} className="btn btn-primary">
              🔄 Nova sessão
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              📊 Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) return <Loading />;

  const progress = Math.round(((currentIdx) / queue.length) * 100);
  const sample = Array.isArray(currentItem.sample_sentences) ? currentItem.sample_sentences : [];
  const meanings = Array.isArray(currentItem.meanings) ? currentItem.meanings : [];
  const contexts = Array.isArray(currentItem.contexts) ? currentItem.contexts : [];

  // ── FLASHCARD PADRÃO ──────────────────────────────────────────
  return (
    <div className="page" style={{ maxWidth: '720px' }}>
      {/* Progress */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>{currentIdx + 1} / {queue.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar blue" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Audit box */}
      {currentItem.audit_lines && (
        <details className="audit-box" style={{ marginBottom: '16px' }}>
          <summary>🔍 Por que este item está aqui?</summary>
          {currentItem.audit_lines.map((line, i) => (
            <div key={i} className="audit-line">{line}</div>
          ))}
        </details>
      )}

      {/* Flashcard */}
      <div className="flashcard" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge badge-blue">{currentItem.level}</span>
          <span className="badge badge-gray">{currentItem.type}</span>
          <StatusBadge status={currentItem.status} />
        </div>

        <div className="flashcard-word">{currentItem.word}</div>
        <TTSButton text={currentItem.word} label="Ouvir" />

        {!showAnswer && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              O que significa este {currentItem.type === 'verb' ? 'verbo' : 'item'}? Como usá-lo?
            </p>

            {/* Dica de Contextos de Uso */}
            {showContextHint && contexts.length > 0 && (
              <div style={{ background: 'rgba(56, 139, 253, 0.08)', border: '1px solid rgba(56, 139, 253, 0.3)', borderRadius: '10px', padding: '12px 16px', width: '100%', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  🌐 Contextos de Uso (Pistas de Relembrança):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {contexts.map(c => (
                    <span key={c.id || c.name} className="badge badge-blue">
                      {c.name || c.context_name || c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dica de Frase com Lacuna (Cloze Test) */}
            {showClozeHint && sample.length > 0 && (
              <div style={{ background: 'rgba(210, 153, 34, 0.08)', border: '1px solid rgba(210, 153, 34, 0.3)', borderRadius: '10px', padding: '12px 16px', width: '100%', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'var(--yellow-text)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  🧩 Complete a Frase de Contexto:
                </div>
                <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{maskWord(sample[0].sentence_text, currentItem.word)}"
                </div>
                {sample[0].tense && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Tempo verbal: <strong>{sample[0].tense}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Botões de ativação de pistas contextuais */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
              {contexts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowContextHint(h => !h)}
                  className="btn btn-sm btn-ghost"
                  style={{ border: '1px solid var(--border)', fontSize: '12px' }}
                >
                  {showContextHint ? '🙈 Ocultar Contextos' : '🌐 Relembrar por Contextos'}
                </button>
              )}
              {sample.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClozeHint(c => !c)}
                  className="btn btn-sm btn-ghost"
                  style={{ border: '1px solid var(--border)', fontSize: '12px' }}
                >
                  {showClozeHint ? '🙈 Ocultar Frase' : '🧩 Relembrar por Frase'}
                </button>
              )}
            </div>

            <button onClick={() => setShowAnswer(true)} className="btn btn-secondary btn-lg" style={{ marginTop: '8px' }}>
              👁️ Mostrar Resposta
            </button>
          </div>
        )}
      </div>

      {/* Avaliação */}
      {showAnswer && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Frase do aluno */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>✍️ Crie uma frase (opcional)</div>
            <textarea
              className="form-textarea"
              placeholder={`Use "${currentItem.word}" em uma frase...`}
              value={studentSentence}
              onChange={e => setStudentSentence(e.target.value)}
              rows={2}
            />
            {studentSentence && <TTSButton text={studentSentence} label="Ouvir minha frase" />}
          </div>

          {/* Tempo verbal */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>⏰ Tempo verbal praticado</div>
            <select className="form-select" value={selectedTense} onChange={e => setSelectedTense(e.target.value)}>
              <option value="">Selecionar...</option>
              {['Present Simple','Present Continuous','Past Simple','Past Continuous',
                'Present Perfect','Past Perfect','Future','Future with will','Going to',
                'Modal constructions','Conditionals'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Pronúncia */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>🔊 Avaliação de Pronúncia (professor)</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {[{ v: true, l: '✓ Correta' }, { v: false, l: '✗ Incorreta' }].map(opt => (
                <button
                  key={String(opt.v)}
                  onClick={() => setPronunciationCorrect(opt.v)}
                  className={`btn ${pronunciationCorrect === opt.v ? (opt.v ? 'btn-success' : 'btn-danger') : 'btn-ghost'}`}
                  style={{ flex: 1 }}
                >
                  {opt.l}
                </button>
              ))}
            </div>
            {pronunciationCorrect === false && (
              <select className="form-select" value={pronunciationRating} onChange={e => setPronunciationRating(e.target.value)}>
                <option value="">Avaliação...</option>
                <option value="needs_improvement">Precisa melhorar</option>
                <option value="very_weak">Muito fraca</option>
              </select>
            )}
            {pronunciationCorrect === true && (
              <select className="form-select" value={pronunciationRating} onChange={e => setPronunciationRating(e.target.value)}>
                <option value="">Avaliação...</option>
                <option value="excellent">Excelente</option>
                <option value="good">Boa</option>
              </select>
            )}
          </div>

          {/* Categorias de erro */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>❌ Categorias de Erro (se houver)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ERROR_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleErrorCategory(cat)}
                  className={`btn btn-sm ${errorCategories.includes(cat) ? 'btn-danger' : 'btn-ghost'}`}
                >
                  {ERROR_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>📝 Observação do professor (opcional)</div>
            <input
              className="form-input"
              placeholder='"Use depend on, not depend of."'
              value={teacherNotes}
              onChange={e => setTeacherNotes(e.target.value)}
            />
          </div>

          {/* Resultado */}
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '4px' }}>
              Como foi o desempenho geral?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '14px' }}>
              Clique em uma das opções abaixo para registrar a resposta e avançar:
            </p>

            {submitError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--red-border, #ef4444)',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
                color: 'var(--red-text, #ef4444)', fontSize: '13px', textAlign: 'center',
              }}>
                ⚠️ {submitError}
              </div>
            )}

            <div className="result-grid">
              <button className="result-btn result-btn-hard" disabled={submitting}
                onClick={() => submitResult('incorrect')}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                <span style={{ fontSize: '24px' }}>🔴</span>
                <span style={{ fontWeight: 700 }}>Difícil / Erro</span>
              </button>
              <button className="result-btn result-btn-partial" disabled={submitting}
                onClick={() => submitResult('partial')}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                <span style={{ fontSize: '24px' }}>🟡</span>
                <span style={{ fontWeight: 700 }}>Parcial</span>
              </button>
              <button className="result-btn result-btn-easy" disabled={submitting}
                onClick={() => submitResult('correct')}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
                <span style={{ fontSize: '24px' }}>🟢</span>
                <span style={{ fontWeight: 700 }}>Fácil / Correto</span>
              </button>
            </div>

            {submitting && (
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                ⏳ Registrando avaliação e calculando próximo intervalo SRS...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
