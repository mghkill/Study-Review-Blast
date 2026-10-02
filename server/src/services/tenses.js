const TENSE_MAP = {
  'present simple': 'present_simple',
  'present_simple': 'present_simple',
  'present continuous': 'present_continuous',
  'present_continuous': 'present_continuous',
  'present perfect': 'present_perfect',
  'present_perfect': 'present_perfect',
  'present perfect continuous': 'present_perfect_continuous',
  'present_perfect_continuous': 'present_perfect_continuous',
  'past simple': 'past_simple',
  'past_simple': 'past_simple',
  'past continuous': 'past_continuous',
  'past_continuous': 'past_continuous',
  'past perfect': 'past_perfect',
  'past_perfect': 'past_perfect',
  'future': 'future',
  'future with will': 'future_will',
  'future_will': 'future_will',
  'going to': 'going_to',
  'going_to': 'going_to',
  'modal constructions': 'modal_constructions',
  'modal_constructions': 'modal_constructions',
  'conditionals': 'conditionals',
  'conditional': 'conditionals',
};

function tenseToCode(raw) {
  if (!raw || typeof raw !== 'string') return null;
  return TENSE_MAP[raw.trim().toLowerCase()] || null;
}

module.exports = {
  tenseToCode,
  TENSE_MAP,
};
