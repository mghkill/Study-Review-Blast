import { useState, useEffect } from 'react';
import { getTenses } from '../api';

const FALLBACK_TENSES = [
  { code: 'present_simple',             label: 'Present Simple'             },
  { code: 'present_continuous',         label: 'Present Continuous'         },
  { code: 'present_perfect',            label: 'Present Perfect'            },
  { code: 'present_perfect_continuous', label: 'Present Perfect Continuous' },
  { code: 'past_simple',                label: 'Past Simple'                },
  { code: 'past_continuous',            label: 'Past Continuous'            },
  { code: 'past_perfect',               label: 'Past Perfect'               },
  { code: 'future',                     label: 'Future'                     },
  { code: 'future_will',                label: 'Future with will'           },
  { code: 'going_to',                   label: 'Going to'                   },
  { code: 'modal_constructions',        label: 'Modal constructions'        },
  { code: 'conditionals',               label: 'Conditionals'               },
];

/**
 * Returns { tenses, loading } where tenses is an array of { code, label, sort_order }.
 * Falls back to a local copy so the UI never breaks while the server loads.
 */
export function useTenses() {
  const [tenses, setTenses] = useState(FALLBACK_TENSES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTenses()
      .then(rows => { if (!cancelled) setTenses(rows); })
      .catch(() => { /* keep fallback */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { tenses, loading };
}