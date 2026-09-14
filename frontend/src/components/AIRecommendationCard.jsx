import React from 'react';
import { Bot, Sparkles, ArrowRight, ShieldAlert, Clock } from 'lucide-react';

export default function AIRecommendationCard({ topTask, onFocusTask }) {
  if (!topTask) {
    return (
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(121, 40, 202, 0.08))', borderColor: 'var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles style={{ color: 'var(--primary-cyan)' }} size={24} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Agent Workload Briefing</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All active tasks are complete! Great job staying on top of your schedule.</p>
          </div>
        </div>
      </div>
    );
  }

  const priority = topTask.aiRecommendedPriority || topTask.priority;
  const badgeClass = priority === 'High' ? 'badge-high' : priority === 'Medium' ? 'badge-medium' : 'badge-low';

  return (
    <div className="glass-card" style={{
      background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(121, 40, 202, 0.12))',
      border: '1px solid rgba(0, 242, 254, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Bot size={18} style={{ color: 'var(--primary-cyan)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', color: 'var(--primary-cyan)', textTransform: 'uppercase' }}>
              AI AGENT RECOMMENDATION OF THE DAY
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', color: '#fff' }}>
            {topTask.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.75rem' }}>
            <span className={`badge-priority ${badgeClass}`}>
              <ShieldAlert size={12} />
              RECOMMENDED: {priority} PRIORITY
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} />
              Due: {new Date(topTask.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
              Est. Duration: {topTask.estimatedDuration || 60}m
            </span>
          </div>
        </div>

        {onFocusTask && (
          <button onClick={() => onFocusTask(topTask)} className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            <span>Focus Now</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Clear AI Reason Banner */}
      <div className="ai-reason-box">
        <div className="ai-reason-header">
          <Sparkles size={13} />
          <span>AI Decision Rationale</span>
        </div>
        <div>
          {topTask.aiReason || "Analyzed deadline proximity, duration impact, and workload bottlenecks."}
        </div>
      </div>
    </div>
  );
}
