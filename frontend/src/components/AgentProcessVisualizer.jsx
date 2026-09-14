import React from 'react';
import { Eye, Cpu, Calendar, Zap, RefreshCw, ArrowRight } from 'lucide-react';

export default function AgentProcessVisualizer({ steps }) {
  const defaultSteps = [
    { step: 1, name: 'Perception', icon: Eye, desc: 'Scans task deadlines, duration, status & work window' },
    { step: 2, name: 'Analysis', icon: Cpu, desc: 'Calculates urgency matrix, effort ratio & bottleneck risk' },
    { step: 3, name: 'Planning', icon: Calendar, desc: 'Prioritizes high-impact items & time-blocks breaks' },
    { step: 4, name: 'Action', icon: Zap, desc: 'Emits priority recommendations, AI reasons & schedule' },
    { step: 5, name: 'Feedback', icon: RefreshCw, desc: 'Recalculates plan dynamically on task completion/updates' },
  ];

  const displaySteps = steps || defaultSteps;

  const getStepIcon = (stepNum) => {
    switch (stepNum) {
      case 1: return Eye;
      case 2: return Cpu;
      case 3: return Calendar;
      case 4: return Zap;
      case 5: return RefreshCw;
      default: return Cpu;
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', background: 'rgba(13, 18, 30, 0.8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
          🤖 5-Step AI Agent Architecture Pipeline
        </h3>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-cyan)', letterSpacing: '0.5px' }}>
          AUTONOMOUS DECISION PROCESS
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        position: 'relative'
      }}>
        {displaySteps.map((s, idx) => {
          const Icon = s.icon || getStepIcon(s.step);
          return (
            <div
              key={s.step}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '1rem',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--primary-cyan)',
                  background: 'rgba(0, 242, 254, 0.1)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  STEP 0{s.step}
                </span>

                <div style={{ color: 'var(--primary-cyan)' }}>
                  <Icon size={18} />
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem', color: '#fff' }}>
                {s.name}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {s.description || s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
