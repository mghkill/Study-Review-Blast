import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getDashboard, getErrorStats, getSessions } from '../api';
import { Loading } from '../components/UI';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function ProgressPage() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) { navigate('/'); return; }
    Promise.all([
      getDashboard(student.id),
      getErrorStats(student.id),
      getSessions({ studentId: student.id, limit: 14 }),
    ]).then(([d, e, s]) => { setData(d); setErrors(e); setSessions(s); })
      .finally(() => setLoading(false));
  }, [student]);

  if (loading) return <div className="page"><Loading /></div>;
  if (!data) return null;

  const { weeklyProgress, byLevel } = data;
  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8b949e', font: { family: 'Inter' } } } },
    scales: {
      x: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
      y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' }, beginAtZero: true },
    }
  };

  const errorLabels = {
    meaning: 'Significado', grammar: 'Gramática', tense: 'Tempo verbal',
    conjugation: 'Conjugação', preposition: 'Preposição', pronunciation: 'Pronúncia',
    collocation: 'Collocation', sentence_structure: 'Estrutura', context: 'Contexto',
    spelling: 'Ortografia', word_choice: 'Escolha de palavra', other: 'Outros',
  };

  const errorChartData = {
    labels: errors.map(e => errorLabels[e.error_category] || e.error_category),
    datasets: [{
      label: 'Erros',
      data: errors.map(e => e.count ?? e.total_count ?? 0),
      backgroundColor: '#f85149CC',
      borderColor: '#f85149',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const weeklyChartData = {
    labels: weeklyProgress.map(w => {
      const d = new Date(w.week);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }),
    datasets: [
      { label: 'Total', data: weeklyProgress.map(w => w.reviews), backgroundColor: '#388bfdCC', borderRadius: 4 },
      { label: 'Corretas', data: weeklyProgress.map(w => w.correct), backgroundColor: '#2ea043CC', borderRadius: 4 },
    ]
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>📈 Progresso</h2>
        <p>Histórico detalhado de aprendizado</p>
      </div>

      {/* Gráfico de revisões semanais */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title" style={{ marginBottom: '16px' }}>📅 Revisões por Semana</div>
        <div style={{ height: '250px' }}>
          {weeklyProgress.length > 0 ? (
            <Bar data={weeklyChartData} options={chartOpts} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Nenhum dado ainda. Comece a estudar!
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de erros por categoria */}
      {errors.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>❌ Erros por Categoria (últimos 30 dias)</div>
          <div style={{ height: '220px' }}>
            <Bar data={errorChartData} options={{ ...chartOpts, indexAxis: 'y' }} />
          </div>
        </div>
      )}

      {/* Domínio por nível */}
      {byLevel.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>🎓 Domínio por Nível CEFR</div>
          {byLevel.map(lv => {
            const total = parseInt(lv.total);
            const mastered = parseInt(lv.mastered);
            const learning = parseInt(lv.learning);
            const weak = parseInt(lv.weak);
            return (
              <div key={lv.level} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-hover)' }}>{lv.level}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {total} palavras — 🟢{mastered} 🟡{learning} 🔴{weak}
                  </span>
                </div>
                <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', background: 'var(--bg-hover)' }}>
                  <div style={{ width: `${total ? (mastered/total)*100 : 0}%`, background: 'var(--green-light)', transition: 'width 0.5s' }} />
                  <div style={{ width: `${total ? (learning/total)*100 : 0}%`, background: 'var(--yellow-light)' }} />
                  <div style={{ width: `${total ? (weak/total)*100 : 0}%`, background: 'var(--red-light)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Histórico de sessões */}
      {sessions.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>🕐 Sessões Recentes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map(s => (
              <div key={s.id} style={{
                background: 'var(--bg-surface)', borderRadius: '10px', padding: '14px',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {new Date(s.started_at).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {s.session_type} · {s.items_reviewed || 0} itens
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: parseInt(s.accuracy_pct) >= 75 ? 'var(--green-text)' : 'var(--yellow-text)' }}>
                    {s.accuracy_pct || 0}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ✅{s.correct || 0} ❌{s.incorrect || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
