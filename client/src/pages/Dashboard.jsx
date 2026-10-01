import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getDashboard } from '../api';
import { Loading, StatusBadge, TTSButton } from '../components/UI';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { student } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) { navigate('/'); return; }
    getDashboard(student.id).then(setData).finally(() => setLoading(false));
  }, [student]);

  if (loading) return <div className="page"><Loading /></div>;
  if (!data) return null;

  const { stats, sentences, priorityItems, recentSessions, errorsByCategory, weeklyProgress, byLevel } = data;

  const totalVocab = parseInt(stats.total_vocab) || 0;
  const mastered = parseInt(stats.mastered) || 0;
  const learning = parseInt(stats.learning) || 0;
  const weak = parseInt(stats.weak) || 0;
  const pendingReviews = parseInt(stats.pending_reviews) || 0;

  const masteredPct = totalVocab ? Math.round((mastered / totalVocab) * 100) : 0;
  const learningPct = totalVocab ? Math.round((learning / totalVocab) * 100) : 0;
  const weakPct = totalVocab ? Math.round((weak / totalVocab) * 100) : 0;

  // Dados para gráfico semanal
  const weekLabels = weeklyProgress.map(w => {
    const d = new Date(w.week);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const donutData = {
    labels: ['🟢 Excelente', '🟡 Intermediário', '🔴 Fraco'],
    datasets: [{
      data: [mastered, learning, weak],
      backgroundColor: ['#2ea043CC', '#d29922CC', '#f85149CC'],
      borderColor: ['#2ea043', '#d29922', '#f85149'],
      borderWidth: 2,
    }]
  };

  const weeklyData = {
    labels: weekLabels.length ? weekLabels : ['Sem dados'],
    datasets: [{
      label: 'Revisões',
      data: weeklyProgress.map(w => w.reviews),
      borderColor: '#388bfd',
      backgroundColor: 'rgba(56,139,253,0.15)',
      fill: true,
      tension: 0.4,
    }, {
      label: 'Corretas',
      data: weeklyProgress.map(w => w.correct),
      borderColor: '#2ea043',
      backgroundColor: 'rgba(46,160,67,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8b949e', font: { family: 'Inter' } } } },
    scales: {
      x: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
      y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
    }
  };
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '65%',
    plugins: {
      legend: { position: 'right', labels: { color: '#8b949e', padding: 12, font: { family: 'Inter' } } },
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Dashboard</h2>
          <p>Olá, {student?.name} · Nível de estudo: <strong style={{ color: 'var(--accent-hover)' }}>{student?.current_level}</strong></p>
        </div>
        <Link to="/study" className="btn btn-primary btn-lg">
          🎯 Estudar Agora
          {pendingReviews > 0 && <span style={{ marginLeft: 4, background: 'rgba(255,255,255,0.2)', borderRadius: '99px', padding: '1px 8px', fontSize: '12px' }}>{pendingReviews}</span>}
        </Link>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Vocabulário Total</div>
          <div className="kpi-value">{totalVocab}</div>
          <div className="kpi-sub">{parseInt(stats.not_started) || 0} não iniciados</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Verbos Dominados</div>
          <div className="kpi-value">{stats.mastered_verbs || 0}</div>
          <div className="kpi-sub">de {stats.total_verbs || 0} verbos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Frases</div>
          <div className="kpi-value">{parseInt(sentences.total_sentences) || 0}</div>
          <div className="kpi-sub">{parseInt(sentences.mastered_sentences) || 0} dominadas</div>
        </div>
        <div className="kpi-card red" style={{ cursor: 'pointer' }} onClick={() => navigate('/study')}>
          <div className="kpi-label">Revisões Pendentes</div>
          <div className="kpi-value" style={{ color: pendingReviews > 0 ? 'var(--red-text)' : 'inherit' }}>{pendingReviews}</div>
          <div className="kpi-sub">Clique para revisar</div>
        </div>
      </div>

      {/* Domínio + Gráfico semanal */}
      <div className="grid-2" style={{ marginBottom: 'var(--gap-xl)' }}>
        {/* Distribuição de domínio */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Distribuição de Domínio</span>
          </div>
          <div style={{ height: '180px' }}>
            {totalVocab > 0 ? (
              <Doughnut data={donutData} options={donutOpts} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Adicione vocabulário para ver o gráfico
              </div>
            )}
          </div>
          <hr className="divider" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: '🟢 Excelente', count: mastered, pct: masteredPct, cls: 'green' },
              { label: '🟡 Intermediário', count: learning, pct: learningPct, cls: 'yellow' },
              { label: '🔴 Fraco', count: weak, pct: weakPct, cls: 'red' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{row.count} ({row.pct}%)</span>
                </div>
                <div className="progress-bar-container">
                  <div className={`progress-bar ${row.cls}`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progresso semanal */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Atividade Semanal</span>
          </div>
          <div style={{ height: '240px' }}>
            {weeklyProgress.length > 0 ? (
              <Line data={weeklyData} options={{ ...chartOpts, maintainAspectRatio: false }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Faça algumas revisões para ver o progresso
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revisões Prioritárias */}
      <div className="grid-2" style={{ marginBottom: 'var(--gap-xl)' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔥 Revisões Prioritárias</span>
            <Link to="/study" className="btn btn-sm btn-secondary">Ver todas</Link>
          </div>
          {priorityItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>Nenhuma revisão pendente 🎉</p>
          ) : (
            <div className="item-list">
              {priorityItems.slice(0, 8).map((item, i) => (
                <Link key={item.id} to={`/vocabulary/${item.id}`} className="item-row">
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', width: '20px' }}>{i + 1}.</span>
                  <span className="item-word">{item.word}</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>{item.level}</span>
                  <StatusBadge status={item.status} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⚡{Math.round(item.review_priority)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Erros por categoria */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">❌ Erros por Categoria</span>
          </div>
          {errorsByCategory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>Nenhum erro registrado ainda</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {errorsByCategory.map(e => {
                const labelMap = {
                  meaning: 'Significado', grammar: 'Gramática', tense: 'Tempo verbal',
                  conjugation: 'Conjugação', preposition: 'Preposição', pronunciation: 'Pronúncia',
                  collocation: 'Collocation', sentence_structure: 'Estrutura', context: 'Contexto',
                  spelling: 'Ortografia', word_choice: 'Escolha de palavra', other: 'Outros',
                };
                const maxCount = errorsByCategory[0]?.count || 1;
                return (
                  <div key={e.error_category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{labelMap[e.error_category] || e.error_category}</span>
                      <span style={{ color: 'var(--red-text)', fontWeight: 600 }}>{e.count}x</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '6px' }}>
                      <div className="progress-bar red" style={{ width: `${(e.count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Domínio por nível */}
      {byLevel.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Progresso por Nível CEFR</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clique no nível para treinar</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            {byLevel.map(lv => {
              const masteredPct = lv.total > 0 ? Math.round((lv.mastered / lv.total) * 100) : 0;
              const learningPct = lv.total > 0 ? Math.round((lv.learning / lv.total) * 100) : 0;
              const scorePct = lv.total > 0 ? Math.round(((lv.mastered * 1.0 + lv.learning * 0.5) / lv.total) * 100) : 0;
              const barClass = lv.mastered > 0 ? 'green' : lv.learning > 0 ? 'yellow' : 'red';

              return (
                <div
                  key={lv.level}
                  onClick={() => navigate(`/study?level=${lv.level}`)}
                  title={`Clique para treinar nível ${lv.level}`}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-hover)' }}>{lv.level}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: scorePct >= 70 ? 'var(--green-text)' : scorePct >= 30 ? 'var(--yellow-text)' : 'var(--text-muted)' }}>
                      {scorePct}%
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {lv.total} palavras no nível
                  </div>

                  <div className="progress-bar-container" style={{ marginBottom: '8px' }}>
                    <div className={`progress-bar ${barClass}`} style={{ width: `${Math.max(8, scorePct)}%` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>🟢 {lv.mastered}</span>
                    <span>🟡 {lv.learning}</span>
                    <span>🔴 {lv.weak}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
