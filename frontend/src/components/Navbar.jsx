import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';

export default function Navbar({ activeTabTitle }) {
  const { recalculateAIPlan, loading } = useContext(TaskContext);

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {activeTabTitle}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="agent-badge-pill">
          <div className="pulse-dot"></div>
          <Bot size={16} />
          <span>AI AGENT ONLINE</span>
        </div>

        <button 
          onClick={recalculateAIPlan} 
          className="btn-secondary" 
          disabled={loading}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          title="Trigger 5-Step AI Agent Feedback Loop & Recalculate Priorities"
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Sync AI Plan</span>
        </button>
      </div>
    </header>
  );
}
