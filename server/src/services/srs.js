/**
 * ALGORITMO DE REPETIÇÃO ESPAÇADA (SRS)
 * 
 * Fórmula de Prioridade:
 * priority = error_weight + recency_weight + difficulty_weight + overdue_weight + weakness_weight
 * 
 * Documentação de cada peso:
 * 
 * error_weight     (0-40): Baseado em taxa de erro e erros recentes.
 *                          Erros recentes pesam 2x mais. Sequência de erros multiplica o peso.
 * 
 * recency_weight   (0-20): Quanto mais tempo desde a última revisão, maior o peso.
 *                          Itens nunca revisados recebem peso máximo.
 * 
 * difficulty_weight(0-15): Baseado na dificuldade configurada do item (1-5).
 *                          Items mais difíceis têm maior prioridade base.
 * 
 * overdue_weight   (0-25): Baseado em quanto o item está atrasado em relação ao next_review_at.
 *                          Itens muito atrasados recebem prioridade máxima.
 * 
 * weakness_weight  (0-20): Baseado no mastery_level atual. Quanto menor o domínio, maior o peso.
 * 
 * Total máximo: 120 (escala normalizada internamente)
 */

/**
 * Calcula a prioridade de revisão de um item
 */
function calculatePriority(item) {
  const now = new Date();

  // ───────────────────────────────────────────────
  // 1. ERROR WEIGHT (0–40)
  // ───────────────────────────────────────────────
  const totalReviews = item.total_reviews || 0;
  const totalIncorrect = item.total_incorrect || 0;
  const totalCorrect = item.total_correct || 0;
  const recentErrors = item.recent_errors || 0;
  const consecutiveIncorrect = item.consecutive_incorrect || 0;

  let errorRate = 0;
  if (totalReviews > 0) {
    errorRate = totalIncorrect / totalReviews;
  }

  // Taxa de erro base (0-20)
  let errorWeight = errorRate * 20;

  // Erros recentes pesam mais (0-10 adicional)
  errorWeight += Math.min(recentErrors * 2, 10);

  // Sequência de erros consecutivos multiplica (0-10 adicional)
  if (consecutiveIncorrect >= 3) {
    errorWeight += Math.min(consecutiveIncorrect * 2, 10);
  }

  errorWeight = Math.min(errorWeight, 40);

  // ───────────────────────────────────────────────
  // 2. RECENCY WEIGHT (0–20)
  // ───────────────────────────────────────────────
  let recencyWeight = 0;
  if (!item.last_reviewed_at) {
    recencyWeight = 20; // Nunca revisado = prioridade máxima
  } else {
    const lastReview = new Date(item.last_reviewed_at);
    const daysSinceReview = (now - lastReview) / (1000 * 60 * 60 * 24);
    // Escala logarítmica: muita diferença nos primeiros dias
    recencyWeight = Math.min(Math.log2(daysSinceReview + 1) * 5, 20);
  }

  // ───────────────────────────────────────────────
  // 3. DIFFICULTY WEIGHT (0–15)
  // ───────────────────────────────────────────────
  const difficulty = item.difficulty || 3; // 1-5
  // Mapear 1-5 para 0-15 (itens mais difíceis têm base maior)
  const difficultyWeight = ((difficulty - 1) / 4) * 15;

  // ───────────────────────────────────────────────
  // 4. OVERDUE WEIGHT (0–25)
  // ───────────────────────────────────────────────
  let overdueWeight = 0;
  if (item.next_review_at) {
    const nextReview = new Date(item.next_review_at);
    const daysOverdue = (now - nextReview) / (1000 * 60 * 60 * 24);
    if (daysOverdue > 0) {
      // Progressivo: quanto mais atrasado, maior o peso
      overdueWeight = Math.min(daysOverdue * 3, 25);
    }
  } else {
    overdueWeight = 25; // Sem data = atrasado ao máximo
  }

  // ───────────────────────────────────────────────
  // 5. WEAKNESS WEIGHT (0–20)
  // ───────────────────────────────────────────────
  const masteryLevel = item.mastery_level || 0; // 0-5
  // Inverso do domínio: 0=domínio → peso 20; 5=dominado → peso 0
  const weaknessWeight = ((5 - masteryLevel) / 5) * 20;

  // ───────────────────────────────────────────────
  // SOMA TOTAL
  // ───────────────────────────────────────────────
  const total = errorWeight + recencyWeight + difficultyWeight + overdueWeight + weaknessWeight;

  return {
    priority: Math.round(total * 10) / 10,
    breakdown: {
      error_weight: Math.round(errorWeight * 10) / 10,
      recency_weight: Math.round(recencyWeight * 10) / 10,
      difficulty_weight: Math.round(difficultyWeight * 10) / 10,
      overdue_weight: Math.round(overdueWeight * 10) / 10,
      weakness_weight: Math.round(weaknessWeight * 10) / 10,
    }
  };
}

/**
 * Calcula o próximo intervalo de revisão (em dias)
 * 
 * Baseado em SM-2 adaptado:
 * - Correto: interval = interval * ease_factor
 * - Parcial: interval = interval * 0.75 (reduz um pouco)
 * - Incorreto: interval = 1 (reinicia, revisar amanhã)
 * - ease_factor ajustado conforme performance
 */
function calculateNextInterval(current, result, easeFactor = 2.5) {
  let newInterval;
  let newEaseFactor = easeFactor;

  switch (result) {
    case 'correct':
      // Aumenta intervalo
      if (current.review_interval_days <= 1) {
        newInterval = 1;
      } else if (current.review_interval_days <= 2) {
        newInterval = 4;
      } else {
        newInterval = Math.round(current.review_interval_days * easeFactor);
      }
      // Aumenta ease factor ligeiramente
      newEaseFactor = Math.min(easeFactor + 0.1, 3.5);
      break;

    case 'partial':
      // Reduz intervalo moderadamente
      newInterval = Math.max(1, Math.round(current.review_interval_days * 0.75));
      // Mantém ease factor
      newEaseFactor = easeFactor;
      break;

    case 'incorrect':
      // Reinicia
      newInterval = 1;
      // Reduz ease factor
      newEaseFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    default:
      newInterval = current.review_interval_days;
  }

  return { newInterval, newEaseFactor };
}

/**
 * Atualiza o mastery_level e status baseado no resultado
 * 
 * Progressão por repetição espaçada:
 * - 3+ acertos consecutivos: sobe 1 nível (máximo 5)
 * - Menos de 3 acertos: mantém o nível atual
 * - Erro: reduz 1 nível (mínimo 0)
 * 
 * Status visual:
 * - Nível >= 4 -> green (Dominado / Retenção avançada)
 * - Nível 2-3  -> yellow (Intermediário / Em consolidação)
 * - Nível 0-1  -> red (Fraco / Não consolidado)
 */
function updateMasteryLevel(currentLevel, result, consecutiveCorrect) {
  let newLevel = currentLevel || 0;

  if (result === 'correct') {
    if (consecutiveCorrect >= 3) {
      newLevel = Math.min(5, newLevel + 1);
    }
  } else if (result === 'partial') {
    newLevel = Math.max(0, Math.min(5, newLevel));
  } else if (result === 'incorrect') {
    newLevel = Math.max(0, newLevel - 1);
  }

  // Status visual:
  // Nível >= 4 -> green (Dominado / Retenção avançada)
  // Nível 2, 3 -> yellow (Intermediário / Em consolidação)
  // Nível 0, 1 -> red (Fraco / Não consolidado)
  let status;
  if (newLevel >= 4) status = 'green';
  else if (newLevel >= 2) status = 'yellow';
  else status = 'red';

  return { newLevel, status };
}

/**
 * Seleciona os itens para uma sessão de estudo
 * Implementa repetição intercalada e GARANTE prática contínua (nunca bloqueia o aluno)
 */
function selectStudyItems(allItems, options = {}) {
  const {
    newCount = 3,
    reviewCount = 7,
    reinforceCount = 3,
    totalMax = 13,
  } = options;

  if (!allItems || allItems.length === 0) return [];

  const now = new Date();

  // Categorizar itens
  const overdue = allItems.filter(i => {
    const next = new Date(i.next_review_at);
    return next <= now && i.total_reviews > 0;
  });

  const newItems = allItems.filter(i => (i.total_reviews || 0) === 0);

  const weak = allItems.filter(i => {
    return i.status === 'red' || i.consecutive_incorrect >= 1 || (i.recent_errors >= 2);
  });

  // Ordenar por prioridade
  const sortedOverdue = overdue
    .map(i => ({ ...i, ...calculatePriority(i) }))
    .sort((a, b) => b.priority - a.priority);

  const sortedWeak = weak
    .map(i => ({ ...i, ...calculatePriority(i) }))
    .sort((a, b) => b.priority - a.priority);

  const selected = new Set();
  const result = [];

  // 1. Prioridade máxima: atrasados
  for (const item of sortedOverdue.slice(0, reviewCount)) {
    if (!selected.has(item.vocabulary_item_id)) {
      selected.add(item.vocabulary_item_id);
      const { priority, breakdown } = calculatePriority(item);
      result.push({
        ...item,
        selection_reason: {
          reason: 'overdue_review',
          label: 'Revisão agendada',
          priority,
          breakdown,
        }
      });
    }
  }

  // 2. Reforço: itens fracos
  for (const item of sortedWeak.slice(0, reinforceCount)) {
    if (!selected.has(item.vocabulary_item_id)) {
      selected.add(item.vocabulary_item_id);
      const { priority, breakdown } = calculatePriority(item);
      result.push({
        ...item,
        selection_reason: {
          reason: 'weak_item',
          label: 'Reforço — item que precisa melhorar',
          priority,
          breakdown,
        }
      });
    }
  }

  // 3. Novas aquisições
  for (const item of newItems.slice(0, newCount)) {
    if (!selected.has(item.vocabulary_item_id)) {
      selected.add(item.vocabulary_item_id);
      result.push({
        ...item,
        selection_reason: {
          reason: 'new_acquisition',
          label: 'Nova aquisição',
          priority: 0,
          breakdown: {},
        }
      });
    }
  }

  // 4. PRÁTICA CONTÍNUA (FALLBACK SE A FILA NÃO ATINGIU O LIMITE)
  // Permite ao aluno continuar treinando sem parar, mesmo que não haja revisões estritamente "atrasadas"
  if (result.length < totalMax) {
    const remainingItems = allItems
      .filter(i => !selected.has(i.vocabulary_item_id))
      .map(i => ({ ...i, ...calculatePriority(i) }))
      .sort((a, b) => {
        // Priorizar menor nível de domínio primeiro, depois data de última revisão
        if ((a.mastery_level || 0) !== (b.mastery_level || 0)) {
          return (a.mastery_level || 0) - (b.mastery_level || 0);
        }
        return (new Date(a.last_reviewed_at || 0)) - (new Date(b.last_reviewed_at || 0));
      });

    for (const item of remainingItems) {
      if (result.length >= totalMax) break;
      selected.add(item.vocabulary_item_id);
      result.push({
        ...item,
        selection_reason: {
          reason: 'continuous_practice',
          label: item.status === 'green' ? 'Manutenção de fluência' : 'Treino contínuo de fixação',
          priority: item.priority || 10,
          breakdown: item.breakdown || {},
        }
      });
    }
  }

  return result.slice(0, totalMax);
}

/**
 * Gera texto de auditoria legível (por que este item foi escolhido?)
 */
function generateAuditText(selectionReason, item) {
  const lines = [];
  const br = selectionReason.breakdown || {};

  if (selectionReason.reason === 'new_acquisition') {
    return ['📚 Nova aquisição — ainda não foi revisado.'];
  }

  lines.push(`📊 Prioridade total: ${selectionReason.priority}`);

  if (br.overdue_weight > 10) lines.push(`⏰ Revisão muito atrasada (+${br.overdue_weight})`);
  if (br.error_weight > 15) lines.push(`❌ Alta taxa de erros (+${br.error_weight})`);
  if (br.weakness_weight > 10) lines.push(`⚠️ Domínio baixo (+${br.weakness_weight})`);
  if (br.recency_weight > 10) lines.push(`📅 Longa ausência (+${br.recency_weight})`);
  if (br.difficulty_weight > 8) lines.push(`🎯 Item difícil (+${br.difficulty_weight})`);

  if (item.consecutive_incorrect >= 2) {
    lines.push(`🔴 ${item.consecutive_incorrect} erros consecutivos`);
  }
  if (item.total_reviews > 0) {
    const rate = Math.round((item.total_incorrect / item.total_reviews) * 100);
    lines.push(`📈 Taxa de erro: ${rate}% (${item.total_incorrect}/${item.total_reviews})`);
  }

  return lines;
}

module.exports = {
  calculatePriority,
  calculateNextInterval,
  updateMasteryLevel,
  selectStudyItems,
  generateAuditText,
};
