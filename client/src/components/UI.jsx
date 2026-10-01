import React, { useState, useCallback } from 'react';
import { speak, stopSpeaking, isTTSAvailable } from '../utils/tts';

export function TTSButton({ text, size = 'sm', label = 'Ouvir' }) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = useCallback(() => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    // Web Speech API não expõe promise, usar evento onend
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    // Delegar ao módulo TTS para seleção de voz
    speak(text);
    // Fallback: reset após tempo estimado (caso onend não dispare)
    setTimeout(() => setSpeaking(false), Math.max(2000, text.length * 80));
  }, [text, speaking]);

  if (!isTTSAvailable()) return null;

  return (
    <button
      className="tts-btn"
      onClick={handleClick}
      title={speaking ? 'Parar' : 'Ouvir pronúncia em inglês'}
      style={speaking ? { background: 'var(--accent)', color: 'white' } : {}}
    >
      {speaking ? '⏹ Parar' : `🔊 ${label}`}
    </button>
  );
}

export function StatusBadge({ status, level }) {
  const s = status || (level >= 4 ? 'green' : level >= 2 ? 'yellow' : 'red');
  const labels = { green: '🟢 Excelente', yellow: '🟡 Intermediário', red: '🔴 Fraco' };
  return <span className={`badge badge-${s}`}>{labels[s] || s}</span>;
}

export function MasteryDot({ status }) {
  const dots = { green: '🟢', yellow: '🟡', red: '🔴' };
  return <span>{dots[status] || '⚪'}</span>;
}

export function LevelBadge({ level }) {
  return <span className="badge badge-blue">{level}</span>;
}

export function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {action}
    </div>
  );
}

export function ErrorBadge({ category }) {
  const labels = {
    meaning: '❓ Significado', grammar: '📐 Gramática', tense: '⏰ Tempo verbal',
    conjugation: '🔄 Conjugação', preposition: '📍 Preposição', collocation: '🔗 Collocation',
    sentence_structure: '🏗️ Estrutura', context: '🌐 Contexto', pronunciation: '🔊 Pronúncia',
    spelling: '✏️ Ortografia', word_choice: '🎯 Escolha de palavra', other: '❗ Outro',
  };
  return <span className="badge badge-red">{labels[category] || category}</span>;
}
