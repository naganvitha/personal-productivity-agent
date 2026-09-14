import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, Coffee, RefreshCw, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ScheduleTimeline() {
  const { schedule, generateNewSchedule, loading } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  const [workStart, setWorkStart] = useState(user?.workStart || '09:00');
  const [workEnd, setWorkEnd] = useState(user?.workEnd || '17:00');
  const [generating, setGenerating] = useState(false);

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      await generateNewSchedule(workStart, workEnd);
    } catch (err) {
      console.error('Schedule generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const tasks = schedule?.scheduledTasks || [];

  return (
    <div>
      {/* Schedule Settings Header */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: 'var(--primary-cyan)' }} />
              Smart Daily Scheduler Setup
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Configure your daily availability. The AI Agent will automatically order urgent tasks and insert rest breaks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start:</span>
              <input
                type="time"
                className="form-control"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>End:</span>
              <input
                type="time"
                className="form-control"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
              />
            </div>

            <button
              onClick={handleRegenerate}
              className="btn-primary"
              disabled={generating || loading}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} className={generating ? 'spin' : ''} />
              <span>{generating ? 'Generating...' : 'Re-generate Schedule'}</span>
            </button>
          </div>
        </div>

        {/* AI Agent Schedule Commentary */}
        {schedule?.aiNotes && (
          <div className="ai-reason-box" style={{ marginTop: '1rem' }}>
            <div className="ai-reason-header">
              <Sparkles size={14} />
              <span>AI Scheduler Strategy</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              {schedule.aiNotes}
            </p>
          </div>
        )}
      </div>

      {/* Timeline view */}
      {tasks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Clock size={40} style={{ color: 'var(--primary-cyan)', marginBottom: '1rem', opacity: 0.5 }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Schedule Generated Yet</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Click "Re-generate Schedule" above to let the AI Agent align your tasks for today.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {tasks.map((block, idx) => {
            const isBreak = block.isBreak;
            const priorityClass = block.priority === 'High' ? 'badge-high' : block.priority === 'Medium' ? 'badge-medium' : 'badge-low';

            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderLeft: isBreak 
                    ? '4px solid var(--status-low)' 
                    : block.priority === 'High'
                    ? '4px solid var(--status-high)'
                    : '4px solid var(--primary-cyan)',
                  background: isBreak 
                    ? 'rgba(16, 185, 129, 0.05)' 
                    : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Time badge */}
                  <div style={{
                    minWidth: '130px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--primary-cyan)',
                    background: 'rgba(0, 242, 254, 0.08)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 242, 254, 0.15)'
                  }}>
                    {block.startTime} – {block.endTime}
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isBreak ? 'var(--status-low)' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {isBreak ? <Coffee size={18} /> : <CheckCircle2 size={18} style={{ color: 'var(--primary-cyan)' }} />}
                      {block.taskTitle}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Duration: {block.durationMinutes} mins • {block.category || 'General'}
                    </span>
                  </div>
                </div>

                <div>
                  {isBreak ? (
                    <span className="badge-priority badge-low">
                      RECOVERY BREAK
                    </span>
                  ) : (
                    <span className={`badge-priority ${priorityClass}`}>
                      <ShieldAlert size={12} />
                      {block.priority} PRIORITY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
