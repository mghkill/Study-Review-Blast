/**
 * TESTES UNITÁRIOS — Módulo TTS (Text-to-Speech)
 *
 * Cobre:
 * - Disponibilidade da API
 * - Chamada de speak() com texto
 * - Seleção correta de voz em inglês
 * - Comportamento de stopSpeaking()
 * - listEnglishVoices() retorna somente vozes en-*
 * - getSelectedVoiceName() retorna string
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speak, stopSpeaking, isTTSAvailable, listEnglishVoices, getSelectedVoiceName } from '../utils/tts.js';

describe('TTS — isTTSAvailable', () => {
  it('retorna true quando speechSynthesis está disponível', () => {
    expect(isTTSAvailable()).toBe(true);
  });
});

describe('TTS — speak()', () => {
  beforeEach(() => {
    mockSpeak.mockClear();
    mockCancel.mockClear();
  });

  it('chama window.speechSynthesis.cancel() antes de falar (evita sobreposição)', () => {
    speak('run');
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('chama window.speechSynthesis.speak() com um utterance', () => {
    speak('avoid');
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance).toBeInstanceOf(window.SpeechSynthesisUtterance);
  });

  it('utterance tem lang = en-US', () => {
    speak('make');
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.lang).toMatch(/^en/);
  });

  it('retorna false para texto vazio', () => {
    const result = speak('');
    expect(result).toBe(false);
  });

  it('retorna false para texto undefined/null', () => {
    expect(speak(null)).toBe(false);
    expect(speak(undefined)).toBe(false);
  });

  it('retorna true para texto válido', () => {
    const result = speak('take');
    expect(result).toBe(true);
  });

  it('faz trim do texto antes de falar', () => {
    speak('  depend   ');
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('depend');
  });
});

describe('TTS — stopSpeaking()', () => {
  beforeEach(() => mockCancel.mockClear());

  it('chama speechSynthesis.cancel()', () => {
    stopSpeaking();
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});

describe('TTS — listEnglishVoices()', () => {
  it('retorna apenas vozes en-*', () => {
    const voices = listEnglishVoices();
    voices.forEach(v => expect(v.lang).toMatch(/^en/));
  });

  it('retorna array de objetos com name, lang, local', () => {
    const voices = listEnglishVoices();
    if (voices.length > 0) {
      expect(voices[0]).toHaveProperty('name');
      expect(voices[0]).toHaveProperty('lang');
      expect(voices[0]).toHaveProperty('local');
    }
  });

  it('exclui vozes pt-BR', () => {
    const voices = listEnglishVoices();
    const hasPtBR = voices.some(v => v.lang === 'pt-BR');
    expect(hasPtBR).toBe(false);
  });
});

describe('TTS — getSelectedVoiceName()', () => {
  it('retorna uma string não-vazia', () => {
    const name = getSelectedVoiceName();
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  it('quando há vozes en-US, não retorna "Padrão do sistema"', () => {
    const name = getSelectedVoiceName();
    // Há vozes en-US no mock, então deve selecionar uma
    expect(name).not.toBe('Padrão do sistema');
  });
});
