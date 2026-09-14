import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import AgentProcessVisualizer from '../components/AgentProcessVisualizer';
import { TrendingUp, Cpu, PieChart, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';

export default function InsightsPage() {
  const { insights, tasks } = useContext(TaskContext);

  const perception = insights?.perceptionSummary || {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status !== 'Completed').length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
    highPriorityCount: tasks.filter(t => (t.aiRecommendedPriority || t.priority) === 'High' && t.status !== 'Completed').length,
    completionRate: `${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0}%`,
    topCategory: 'Work'
  };

  const agentInsights = insights?.agentInsights || [
    "You have completed your recent high-priority tasks on schedule.",
    "Your highest active focus area is Academic work.",
    "Schedule 15-minute breaks after 90 minutes of continuous focus."
  ];

  // Calculate category breakdown
  const categoryMap = {};
  tasks.forEach(t => {
    const cat = t.category || 'Work';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Productivity Insights & Agent Architecture</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Detailed view of your AI Agent's 5-step perception-action pipeline and performance metrics.
        </p>
      </div>

      {/* 5-Step AI Agent Architecture Component */}
      <AgentProcessVisualizer steps={insights?.architectureSteps} />

      {/* Insights Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Agent Generated Key Bullet Insights */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--primary-cyan)' }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Agent Productivity Insights</h3>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {agentInsights.map((insight, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', lineHeight: 1.4 }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary-cyan)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Category Distribution Bar chart visualization */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(121, 40, 202, 0.15)', color: 'var(--accent-purple)' }}>
              <PieChart size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Category Distribution</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {Object.entries(categoryMap).length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No tasks categorized yet.</p>
            ) : (
              Object.entries(categoryMap).map(([cat, count]) => {
                const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} tasks ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--primary-cyan), var(--accent-purple))',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
