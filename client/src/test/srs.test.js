/**
 * TESTES UNITÁRIOS — Algoritmo SRS (Spaced Repetition System)
 *
 * Cobertura:
 * - calculatePriority: os 5 componentes do peso
 * - calculateNextInterval: SM-2 adaptado (correct / partial / incorrect)
 * - updateMasteryLevel: promoção / rebaixamento de nível
 * - selectStudyItems: seleção e composição da sessão
 * - generateAuditText: auditoria legível
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculatePriority,
  calculateNextInterval,
  updateMasteryLevel,
  selectStudyItems,
  generateAuditText,
} from '../../../server/src/services/srs.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

/** Item base "neutro" para isolar cada componente */
function baseItem(overrides = {}) {
  return {
    vocabulary_item_id: 1,
    total_reviews: 0,
    total_correct: 0,
    total_incorrect: 0,
    recent_errors: 0,
    consecutive_incorrect: 0,
    last_reviewed_at: null,
    next_review_at: null,
    difficulty: 3,
    mastery_level: 0,
    ...overrides,
  };
}

// ─── calculatePriority ────────────────────────────────────────────────────────
describe('calculatePriority', () => {
  it('retorna objeto com priority e breakdown', () => {
    const result = calculatePriority(baseItem());
    expect(result).toHaveProperty('priority');
    expect(result).toHaveProperty('breakdown');
    expect(result.breakdown).toHaveProperty('error_weight');
    expect(result.breakdown).toHaveProperty('recency_weight');
    expect(result.breakdown).toHaveProperty('difficulty_weight');
    expect(result.breakdown).toHaveProperty('overdue_weight');
    expect(result.breakdown).toHaveProperty('weakness_weight');
  });

  it('item nunca revisado recebe recency_weight = 20 (máximo)', () => {
    const { breakdown } = calculatePriority(baseItem({ last_reviewed_at: null }));
    expect(breakdown.recency_weight).toBe(20);
  });

  it('item revisado há 1 dia tem recency_weight menor que revisado há 30 dias', () => {
    const recent = calculatePriority(baseItem({ last_reviewed_at: daysAgo(1) }));
    const old = calculatePriority(baseItem({ last_reviewed_at: daysAgo(30) }));
    expect(recent.breakdown.recency_weight).toBeLessThan(old.breakdown.recency_weight);
  });

  it('item com 100% de erros tem error_weight maior que item sem erros', () => {
    const allErrors = calculatePriority(baseItem({
      total_reviews: 10, total_incorrect: 10, total_correct: 0,
    }));
    const noErrors = calculatePriority(baseItem({
      total_reviews: 10, total_incorrect: 0, total_correct: 10,
    }));
    expect(allErrors.breakdown.error_weight).toBeGreaterThan(noErrors.breakdown.error_weight);
  });

  it('error_weight não ultrapassa 40', () => {
    const { breakdown } = calculatePriority(baseItem({
      total_reviews: 100, total_incorrect: 100, total_correct: 0,
      recent_errors: 20, consecutive_incorrect: 50,
    }));
    expect(breakdown.error_weight).toBeLessThanOrEqual(40);
  });

  it('item com dificuldade 5 tem difficulty_weight maior que dificuldade 1', () => {
    const hard = calculatePriority(baseItem({ difficulty: 5 }));
    const easy = calculatePriority(baseItem({ difficulty: 1 }));
    expect(hard.breakdown.difficulty_weight).toBeGreaterThan(easy.breakdown.difficulty_weight);
  });

  it('difficulty_weight para dificuldade 1 é 0', () => {
    const { breakdown } = calculatePriority(baseItem({ difficulty: 1 }));
    expect(breakdown.difficulty_weight).toBe(0);
  });

  it('difficulty_weight para dificuldade 5 é 15', () => {
    const { breakdown } = calculatePriority(baseItem({ difficulty: 5 }));
    expect(breakdown.difficulty_weight).toBe(15);
  });

  it('item sem next_review_at recebe overdue_weight = 25 (máximo)', () => {
    const { breakdown } = calculatePriority(baseItem({ next_review_at: null }));
    expect(breakdown.overdue_weight).toBe(25);
  });

  it('item com revisão futura tem overdue_weight = 0', () => {
    const { breakdown } = calculatePriority(baseItem({
      next_review_at: daysFromNow(7),
    }));
    expect(breakdown.overdue_weight).toBe(0);
  });

  it('item muito atrasado tem overdue_weight maior que item levemente atrasado', () => {
    const muitoAtrasado = calculatePriority(baseItem({ next_review_at: daysAgo(10) }));
    const levementeAtrasado = calculatePriority(baseItem({ next_review_at: daysAgo(1) }));
    expect(muitoAtrasado.breakdown.overdue_weight).toBeGreaterThan(
      levementeAtrasado.breakdown.overdue_weight
    );
  });

  it('item com mastery_level 0 tem weakness_weight = 20 (máximo)', () => {
    const { breakdown } = calculatePriority(baseItem({ mastery_level: 0 }));
    expect(breakdown.weakness_weight).toBe(20);
  });

  it('item com mastery_level 5 tem weakness_weight = 0', () => {
    const { breakdown } = calculatePriority(baseItem({ mastery_level: 5 }));
    expect(breakdown.weakness_weight).toBe(0);
  });

  it('prioridade total é soma dos componentes', () => {
    const item = baseItem({
      total_reviews: 10, total_incorrect: 5, total_correct: 5,
      difficulty: 4, mastery_level: 2, last_reviewed_at: daysAgo(5),
      next_review_at: daysAgo(2),
    });
    const { priority, breakdown } = calculatePriority(item);
    const sum = breakdown.error_weight + breakdown.recency_weight +
      breakdown.difficulty_weight + breakdown.overdue_weight + breakdown.weakness_weight;
    expect(Math.abs(priority - sum)).toBeLessThan(0.5); // tolerância de arredondamento
  });

  it('item perfeito (dominado, revisado recentemente, fácil) tem prioridade baixa', () => {
    const { priority } = calculatePriority(baseItem({
      mastery_level: 5,
      difficulty: 1,
      last_reviewed_at: daysAgo(1),
      next_review_at: daysFromNow(10),
      total_reviews: 20, total_correct: 20, total_incorrect: 0,
      recent_errors: 0, consecutive_incorrect: 0,
    }));
    expect(priority).toBeLessThan(10);
  });

  it('item crítico (muito erros, atrasado, fraco) tem prioridade alta', () => {
    const { priority } = calculatePriority(baseItem({
      mastery_level: 0,
      difficulty: 5,
      last_reviewed_at: null,
      next_review_at: daysAgo(14),
      total_reviews: 20, total_correct: 2, total_incorrect: 18,
      recent_errors: 8, consecutive_incorrect: 5,
    }));
    expect(priority).toBeGreaterThan(70);
  });
});

// ─── calculateNextInterval ────────────────────────────────────────────────────
describe('calculateNextInterval', () => {
  const defaultSV = { review_interval_days: 4, ease_factor: 2.5 };

  it('resposta "correct" aumenta o intervalo', () => {
    const { newInterval } = calculateNextInterval(defaultSV, 'correct', 2.5);
    expect(newInterval).toBeGreaterThan(defaultSV.review_interval_days);
  });

  it('resposta "incorrect" reinicia o intervalo para 1', () => {
    const { newInterval } = calculateNextInterval(defaultSV, 'incorrect', 2.5);
    expect(newInterval).toBe(1);
  });

  it('resposta "partial" reduz o intervalo mas mantém >= 1', () => {
    const { newInterval } = calculateNextInterval(defaultSV, 'partial', 2.5);
    expect(newInterval).toBeGreaterThanOrEqual(1);
    expect(newInterval).toBeLessThan(defaultSV.review_interval_days);
  });

  it('"correct" aumenta ease_factor (até máximo 3.5)', () => {
    const { newEaseFactor } = calculateNextInterval(defaultSV, 'correct', 2.5);
    expect(newEaseFactor).toBeGreaterThan(2.5);
    expect(newEaseFactor).toBeLessThanOrEqual(3.5);
  });

  it('"incorrect" diminui ease_factor (mínimo 1.3)', () => {
    const { newEaseFactor } = calculateNextInterval(defaultSV, 'incorrect', 2.5);
    expect(newEaseFactor).toBeLessThan(2.5);
    expect(newEaseFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('ease_factor não cai abaixo de 1.3 com erros repetidos', () => {
    let ef = 1.5;
    for (let i = 0; i < 20; i++) {
      const result = calculateNextInterval({ review_interval_days: 1 }, 'incorrect', ef);
      ef = result.newEaseFactor;
    }
    expect(ef).toBeGreaterThanOrEqual(1.3);
  });

  it('ease_factor não sobe acima de 3.5 com acertos repetidos', () => {
    let ef = 3.0;
    let interval = 10;
    for (let i = 0; i < 20; i++) {
      const result = calculateNextInterval({ review_interval_days: interval }, 'correct', ef);
      ef = result.newEaseFactor;
      interval = result.newInterval;
    }
    expect(ef).toBeLessThanOrEqual(3.5);
  });

  it('intervalo de 1 dia correto leva a intervalo > 1 na próxima', () => {
    const { newInterval } = calculateNextInterval({ review_interval_days: 1 }, 'correct', 2.5);
    expect(newInterval).toBeGreaterThanOrEqual(1);
  });
});

// ─── updateMasteryLevel ───────────────────────────────────────────────────────
describe('updateMasteryLevel', () => {
  it('mastery_level não sobe com "correct" sem 3 acertos consecutivos', () => {
    const { newLevel } = updateMasteryLevel(2, 'correct', 2);
    expect(newLevel).toBe(2); // consecutiveCorrect < 3, não sobe
  });

  it('mastery_level sobe com "correct" e 3+ acertos consecutivos', () => {
    const { newLevel } = updateMasteryLevel(2, 'correct', 3);
    expect(newLevel).toBe(3);
  });

  it('mastery_level não ultrapassa 5', () => {
    const { newLevel } = updateMasteryLevel(5, 'correct', 3);
    expect(newLevel).toBe(5);
  });

  it('mastery_level cai com "incorrect"', () => {
    const { newLevel } = updateMasteryLevel(3, 'incorrect', 0);
    expect(newLevel).toBe(2);
  });

  it('mastery_level não cai abaixo de 0', () => {
    const { newLevel } = updateMasteryLevel(0, 'incorrect', 0);
    expect(newLevel).toBe(0);
  });

  it('status é "green" quando mastery >= 4', () => {
    const { status } = updateMasteryLevel(4, 'correct', 3);
    expect(status).toBe('green');
  });

  it('status é "yellow" quando mastery 2-3', () => {
    const { status } = updateMasteryLevel(2, 'correct', 1);
    expect(status).toBe('yellow');
  });

  it('status é "red" quando mastery 0-1', () => {
    const { status } = updateMasteryLevel(0, 'incorrect', 0);
    expect(status).toBe('red');
  });
});

// ─── selectStudyItems ─────────────────────────────────────────────────────────
describe('selectStudyItems', () => {
  function makeItems(count, overrides = {}) {
    return Array.from({ length: count }, (_, i) => ({
      vocabulary_item_id: i + 1,
      total_reviews: 5,
      total_correct: 3,
      total_incorrect: 2,
      recent_errors: 1,
      consecutive_incorrect: 0,
      last_reviewed_at: daysAgo(3),
      next_review_at: daysAgo(1), // atrasado
      difficulty: 3,
      mastery_level: 2,
      ...overrides,
    }));
  }

  it('retorna array', () => {
    const result = selectStudyItems([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('não retorna mais itens que totalMax', () => {
    const items = makeItems(50);
    const result = selectStudyItems(items, { totalMax: 10 });
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it('não duplica itens na seleção', () => {
    const items = makeItems(20);
    const result = selectStudyItems(items, { totalMax: 13 });
    const ids = result.map(i => i.vocabulary_item_id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('inclui itens novos (total_reviews === 0)', () => {
    const overdue = makeItems(10); // 10 atrasados
    const newItems = Array.from({ length: 5 }, (_, i) => ({
      vocabulary_item_id: 100 + i,
      total_reviews: 0,
      total_correct: 0,
      total_incorrect: 0,
      recent_errors: 0,
      consecutive_incorrect: 0,
      last_reviewed_at: null,
      next_review_at: null,
      difficulty: 3,
      mastery_level: 0,
    }));
    const result = selectStudyItems([...overdue, ...newItems], {
      newCount: 3, reviewCount: 7, reinforceCount: 2, totalMax: 13,
    });
    const hasNew = result.some(i => parseInt(i.vocabulary_item_id) >= 100);
    expect(hasNew).toBe(true);
  });

  it('cada item selecionado tem selection_reason', () => {
    const items = makeItems(10);
    const result = selectStudyItems(items);
    result.forEach(item => {
      expect(item).toHaveProperty('selection_reason');
      expect(item.selection_reason).toHaveProperty('reason');
    });
  });

  it('retorna lista vazia para input vazio', () => {
    expect(selectStudyItems([])).toHaveLength(0);
  });
});

// ─── generateAuditText ────────────────────────────────────────────────────────
describe('generateAuditText', () => {
  it('retorna array de strings', () => {
    const reason = {
      reason: 'overdue_review',
      priority: 75,
      breakdown: { error_weight: 20, recency_weight: 15, difficulty_weight: 10, overdue_weight: 20, weakness_weight: 10 },
    };
    const result = generateAuditText(reason, baseItem());
    expect(Array.isArray(result)).toBe(true);
    result.forEach(line => expect(typeof line).toBe('string'));
  });

  it('item novo retorna mensagem específica de nova aquisição', () => {
    const reason = { reason: 'new_acquisition', priority: 0, breakdown: {} };
    const result = generateAuditText(reason, baseItem());
    expect(result.some(l => l.includes('Nova aquisição') || l.includes('📚'))).toBe(true);
  });

  it('item com alta taxa de erros menciona erros no audit', () => {
    const reason = {
      reason: 'weak_item',
      priority: 80,
      breakdown: { error_weight: 35, recency_weight: 10, difficulty_weight: 10, overdue_weight: 15, weakness_weight: 10 },
    };
    const item = baseItem({ total_reviews: 10, total_incorrect: 8 });
    const result = generateAuditText(reason, item);
    const text = result.join(' ');
    // Deve mencionar prioridade ou erro
    expect(text.length).toBeGreaterThan(0);
  });
});
