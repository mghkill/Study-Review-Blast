import { describe, it, expect, beforeEach } from 'vitest';
import { api, setApiStudentId, getApiStudentId } from '../api';

describe('T-027 — Cliente: Injeção de X-Student-Id e Limpeza de Estado', () => {
  beforeEach(() => {
    localStorage.clear();
    setApiStudentId(null);
  });

  it('getApiStudentId retorna null quando não há estudante ativo', () => {
    expect(getApiStudentId()).toBe(null);
  });

  it('setApiStudentId define o estudante ativo em memória', () => {
    setApiStudentId(42);
    expect(getApiStudentId()).toBe('42');
  });

  it('getApiStudentId lê do localStorage se setApiStudentId não foi chamado', () => {
    localStorage.setItem('currentStudent', JSON.stringify({ id: 99, name: 'Alice' }));
    expect(getApiStudentId()).toBe('99');
  });

  it('Interceptor do Axios adiciona header X-Student-Id baseado no estudante ativo', () => {
    setApiStudentId(15);

    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    const modifiedConfig = requestHandler(config);

    expect(modifiedConfig.headers['X-Student-Id']).toBe('15');
  });

  it('Interceptor respeita header explícito quando já fornecido', () => {
    setApiStudentId(15);

    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: { 'X-Student-Id': '77' } };
    const modifiedConfig = requestHandler(config);

    expect(modifiedConfig.headers['X-Student-Id']).toBe('77');
  });

  it('Limpeza do estudante ativo remove o header', () => {
    setApiStudentId(15);
    setApiStudentId(null);
    localStorage.removeItem('currentStudent');

    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    const modifiedConfig = requestHandler(config);

    expect(modifiedConfig.headers['X-Student-Id']).toBeUndefined();
  });
});
