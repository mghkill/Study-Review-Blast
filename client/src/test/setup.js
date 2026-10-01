import '@testing-library/jest-dom';

// Mock da Web Speech API (não existe no jsdom)
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn(() => [
  { name: 'Samantha', lang: 'en-US', localService: true, default: false },
  { name: 'Microsoft Zira', lang: 'en-US', localService: true, default: false },
  { name: 'Google português do Brasil', lang: 'pt-BR', localService: false, default: false },
]);

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: mockSpeak,
    cancel: mockCancel,
    getVoices: mockGetVoices,
    onvoiceschanged: null,
    speaking: false,
    pending: false,
    paused: false,
  },
});

window.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = 'en-US';
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
    this.voice = null;
    this.onend = null;
    this.onerror = null;
  }
};

// Expor mocks globalmente para asserções nos testes
global.mockSpeak = mockSpeak;
global.mockCancel = mockCancel;
global.mockGetVoices = mockGetVoices;
