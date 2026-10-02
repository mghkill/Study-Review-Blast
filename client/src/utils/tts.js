/**
 * Text-to-Speech — Web Speech API nativa + Áudio Nativo Americano HD
 *
 * Garante 100% de pronúncia em inglês nativo autêntico, eliminando
 * qualquer sotaque de leitura em português ou outra língua.
 *
 * Estratégia em 2 camadas:
 * 1. Web Speech API com busca flexível das melhores vozes nativas em inglês
 *    (Microsoft Natural Jenny/Guy/Aria, Google US English, Samantha, David Desktop, Zira Desktop).
 * 2. Fallback / Opção Áudio Nativo Americano HD (Google TTS en-US oficial)
 *    para pronúncia de dicionário impecável mesmo sem vozes instaladas no Windows.
 */

let _cachedVoices = [];
let _currentAudio = null;

// Chave do localStorage para preferência do usuário
const VOICE_PREF_KEY = 'english_study_voice_preference';

/**
 * Carrega a lista de vozes do browser
 */
function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const list = window.speechSynthesis.getVoices() || [];
  if (list.length > 0) {
    _cachedVoices = list;
  }
  return _cachedVoices;
}

// Inicializar ouvintes assim que o script carregar
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Padrões de vozes nativas em inglês com excelente pronúncia (em ordem de qualidade)
 */
const PREFERRED_PATTERNS = [
  /online\s*\(natural\)/i,    // Edge Natural Voices (Jenny, Guy, Aria, etc. — ultra realistas)
  /jenny/i,                   // Microsoft Jenny (Windows 11 / Edge)
  /guy/i,                     // Microsoft Guy
  /aria/i,                    // Microsoft Aria
  /google\s*us\s*english/i,   // Chrome Google US English
  /samantha/i,                // macOS Samantha (americana de referência)
  /zira/i,                    // Windows Microsoft Zira Desktop
  /david/i,                   // Windows Microsoft David Desktop
  /mark/i,                    // Windows Microsoft Mark
  /alex/i,                    // macOS Alex
  /daniel/i,                  // macOS Daniel (inglês britânico)
];

/**
 * Retorna true se a voz é de idioma inglês
 */
function isEnglishVoice(voice) {
  if (!voice) return false;
  const lang = (voice.lang || '').toLowerCase().replace('_', '-');
  return lang.startsWith('en');
}

/**
 * Seleciona a melhor voz em inglês disponível no sistema
 */
export function getBestEnglishVoice() {
  const voices = _cachedVoices.length > 0 ? _cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  // Filtrar apenas vozes legítimas em inglês (elimina pt-BR, es, etc.)
  const englishVoices = voices.filter(isEnglishVoice);
  if (englishVoices.length === 0) return null;

  // 0. Se o usuário escolheu uma voz específica por nome
  const userPref = getVoicePreference();
  if (userPref && userPref !== 'auto' && userPref !== 'native-hd') {
    const selected = englishVoices.find(v => v.name === userPref);
    if (selected) return selected;
  }

  // 1. Tentar por padrões de vozes de alta fidelidade
  for (const pattern of PREFERRED_PATTERNS) {
    const match = englishVoices.find(v => pattern.test(v.name));
    if (match) return match;
  }

  // 2. Qualquer en-US nativa
  const usVoice = englishVoices.find(v => {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    return l === 'en-us' && !v.name.toLowerCase().includes('espeak');
  });
  if (usVoice) return usVoice;

  // 3. Qualquer en-GB (britânica)
  const gbVoice = englishVoices.find(v => {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    return l === 'en-gb';
  });
  if (gbVoice) return gbVoice;

  // 4. Qualquer voz em inglês
  return englishVoices[0];
}

/**
 * Retorna a preferência de voz do usuário
 * @returns {'auto' | 'native-hd' | string}
 */
export function getVoicePreference() {
  if (typeof window === 'undefined' || !window.localStorage) return 'auto';
  return window.localStorage.getItem(VOICE_PREF_KEY) || 'auto';
}

/**
 * Define a preferência de voz do usuário
 * @param {'auto' | 'native-hd' | string} pref
 */
export function setVoicePreference(pref) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(VOICE_PREF_KEY, pref);
  }
}

/**
 * Toca áudio nativo americano em alta definição via stream de áudio oficial
 */
export function playNativeAudio(text) {
  if (!text || !text.trim()) return Promise.resolve(false);
  const clean = text.trim();

  stopSpeaking();

  return new Promise((resolve) => {
    try {
      // Endpoint oficial público de pronúncia em inglês americano (en-US)
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean.slice(0, 180))}&tl=en&client=tw-ob`;
      const audio = new Audio(url);
      _currentAudio = audio;

      audio.onended = () => {
        _currentAudio = null;
        resolve(true);
      };

      audio.onerror = () => {
        _currentAudio = null;
        // Fallback para Web Speech API se o áudio online falhar
        speakViaSpeechSynthesis(clean, {});
        resolve(true);
      };

      audio.play().catch(() => {
        _currentAudio = null;
        speakViaSpeechSynthesis(clean, {});
        resolve(true);
      });
    } catch {
      speakViaSpeechSynthesis(clean, {});
      resolve(true);
    }
  });
}

/**
 * Executa a síntese via SpeechSynthesis garantindo en-US
 */
function speakViaSpeechSynthesis(text, options = {}) {
  if (!('speechSynthesis' in window)) return false;

  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = 'en-US';
  utterance.rate = options.rate ?? 0.88;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  const voice = getBestEnglishVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'en-US';
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Fala um texto em inglês garantindo pronúncia americana nativa correta
 * @param {string} text — texto a ser pronunciado
 * @param {object} options — { rate, pitch, volume, forceAudio, onEnd }
 */
export function speak(text, options = {}) {
  if (!text || !text.trim()) return false;

  // Interromper qualquer áudio anterior
  stopSpeaking();

  const userPref = getVoicePreference();

  // Se o usuário preferir Áudio Nativo HD explicitamente
  if (userPref === 'native-hd' || options.forceAudio) {
    playNativeAudio(text);
    return true;
  }

  // Se tivermos Web Speech API disponível
  if ('speechSynthesis' in window) {
    const voice = getBestEnglishVoice();

    // Se NÃO existe nenhuma voz em inglês no sistema do usuário (ex: Windows que só tem PT-BR instalado):
    // Usar automaticamente o Áudio Nativo Americano HD para não ler em português!
    if (!voice && typeof Audio !== 'undefined') {
      playNativeAudio(text);
      return true;
    }

    return speakViaSpeechSynthesis(text, options);
  }

  // Caso contrário, tenta áudio direto se suportado
  if (typeof Audio !== 'undefined') {
    playNativeAudio(text);
    return true;
  }

  return false;
}

/**
 * Para qualquer fala ou áudio em andamento
 */
export function stopSpeaking() {
  if (_currentAudio) {
    try {
      _currentAudio.pause();
      _currentAudio.currentTime = 0;
    } catch {}
    _currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Retorna true se algum mecanismo de TTS estiver disponível
 */
export function isTTSAvailable() {
  return (typeof window !== 'undefined' && 'speechSynthesis' in window) || typeof Audio !== 'undefined';
}

/**
 * Lista todas as vozes em inglês disponíveis no browser
 */
export function listEnglishVoices() {
  const voices = _cachedVoices.length > 0 ? _cachedVoices : loadVoices();
  return (voices || [])
    .filter(isEnglishVoice)
    .map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService,
      default: v.default,
    }));
}

/**
 * Retorna o nome da voz que será usada
 */
export function getSelectedVoiceName() {
  const pref = getVoicePreference();
  if (pref === 'native-hd') {
    return 'Áudio Nativo Americano HD (Online)';
  }
  const voice = getBestEnglishVoice();
  if (voice) {
    return `${voice.name} (${voice.lang})`;
  }
  return 'Áudio Nativo Americano HD';
}
