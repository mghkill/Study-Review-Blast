import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

let activeStudentId = null;

export const setApiStudentId = (id) => {
  activeStudentId = id ? String(id) : null;
};

export const getApiStudentId = () => {
  if (activeStudentId) return activeStudentId;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem('currentStudent');
      if (raw) {
        const student = JSON.parse(raw);
        return student?.id ? String(student.id) : null;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Interceptor para injetar X-Student-Id automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const explicitHeader = config.headers?.['X-Student-Id'] || config.headers?.['x-student-id'];
  const studentId = explicitHeader || config.params?.studentId || getApiStudentId();
  if (studentId) {
    config.headers['X-Student-Id'] = String(studentId);
  }
  return config;
});

// ─── Students ─────────────────────────────────────
export const getStudents = () => api.get('/students').then(r => r.data);
export const createStudent = (data) => api.post('/students', data).then(r => r.data);
export const updateStudent = (id, data) => api.patch(`/students/${id}`, data).then(r => r.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`).then(r => r.data);

// ─── Dashboard ────────────────────────────────────
export const getDashboard = (studentId) => {
  const headers = studentId ? { 'X-Student-Id': String(studentId) } : {};
  return api.get('/dashboard', { headers, params: { studentId } }).then(r => r.data);
};

// ─── Vocabulary ───────────────────────────────────
export const getVocabulary = (params) => api.get('/vocabulary', { params }).then(r => r.data);
export const getVocabItem = (id, studentId) => {
  const headers = studentId ? { 'X-Student-Id': String(studentId) } : {};
  return api.get(`/vocabulary/${id}`, { headers, params: { studentId } }).then(r => r.data);
};
export const createVocabItem = (data) => api.post('/vocabulary', data).then(r => r.data);
export const updateVocabItem = (id, data) => api.patch(`/vocabulary/${id}`, data).then(r => r.data);
export const deleteVocabItem = (id) => api.delete(`/vocabulary/${id}`).then(r => r.data);
export const addSentence = (vocabId, data) => api.post(`/vocabulary/${vocabId}/sentences`, data).then(r => r.data);
export const updateSentence = (vocabId, sentenceId, data) => api.patch(`/vocabulary/${vocabId}/sentences/${sentenceId}`, data).then(r => r.data);
export const deleteSentence = (vocabId, sentenceId) => api.delete(`/vocabulary/${vocabId}/sentences/${sentenceId}`).then(r => r.data);
export const addContext = (vocabId, data) => api.post(`/vocabulary/${vocabId}/contexts`, data).then(r => r.data);
export const updateMeaning = (vocabId, meaningId, data) => api.patch(`/vocabulary/${vocabId}/meanings/${meaningId}`, data).then(r => r.data);

// ─── Reviews / SRS ────────────────────────────────
export const getReviewQueue = (params) => api.get('/reviews/queue', { params }).then(r => r.data);
export const submitReview = (data) => api.post('/reviews', data).then(r => r.data);
export const getReviewHistory = (params) => api.get('/reviews/history', { params }).then(r => r.data);
export const getErrorStats = (studentId) => {
  const headers = studentId ? { 'X-Student-Id': String(studentId) } : {};
  return api.get('/reviews/errors', { headers, params: { studentId } }).then(r => r.data);
};
export const submitStudentSentence = (data) => api.post('/reviews/student-sentence', data).then(r => r.data);

// ─── Sessions ─────────────────────────────────────
export const startSession = (data) => api.post('/sessions', data).then(r => r.data);
export const endSession = (id, data) => api.patch(`/sessions/${id}`, data).then(r => r.data);
export const getSessions = (params) => api.get('/sessions', { params }).then(r => r.data);

// ─── Sentences ────────────────────────────────────
export const getSentences = (params) => api.get('/sentences', { params }).then(r => r.data);
export const createSentence = (data) => api.post('/sentences', data).then(r => r.data);
export const getParagraphs = (studentId) => {
  const headers = studentId ? { 'X-Student-Id': String(studentId) } : {};
  return api.get('/sentences/paragraphs', { headers, params: { studentId } }).then(r => r.data);
};
export const createParagraph = (data) => api.post('/sentences/paragraphs', data).then(r => r.data);

export default api;
