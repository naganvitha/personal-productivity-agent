import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Tag, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const [showAiReason, setShowAiReason] = useState(false);

  const isCompleted = task.status === 'Completed';
  const priority = task.aiRecommendedPriority || task.priority;
  const badgeClass = priority === 'High' ? 'badge-high' : priority === 'Medium' ? 'badge-medium' : 'badge-low';

  const formatDeadline = (deadlineStr) => {
    const d = new Date(deadlineStr);
    const now = new Date();
    const diffHours = (d - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { text: `Overdue by ${Math.abs(Math.round(diffHours))}h`, overdue: true };
    } else if (diffHours < 24) {
      return { text: `Due in ${Math.round(diffHours)}h`, urgent: true };
    } else {
      return {
        text: d.toLocaleString('en-IN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        }),
        normal: true
      };
    }
  };

  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <div className={`glass-card ${isCompleted ? 'task-completed' : ''}`} style={{ opacity: isCompleted ? 0.75 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <button
            onClick={() => onToggleComplete(task._id)}
            style={{ background: 'none', border: 'none', color: isCompleted ? 'var(--status-low)' : 'var(--text-dim)', marginTop: '0.2rem' }}
            title={isCompleted ? "Mark Pending" : "Mark Completed"}
          >
            {isCompleted ? <CheckCircle size={22} /> : <Circle size={22} />}
          </button>

          <div>
            <h4 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'var(--text-muted)' : '#fff',
              marginBottom: '0.35rem'
            }}>
              {task.title}
            </h4>

            {task.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                {task.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
              <span className={`badge-priority ${badgeClass}`}>
                {priority} Priority
              </span>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Tag size={12} />
                {task.category || 'Work'}
              </span>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: deadlineInfo.overdue ? 'var(--status-high)' : deadlineInfo.urgent ? 'var(--status-med)' : 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {deadlineInfo.overdue && <AlertTriangle size={12} />}
                <Clock size={12} />
                {deadlineInfo.text}
              </span>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                ⏱️ {task.estimatedDuration || 60} min
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {onEdit && (
            <button onClick={() => onEdit(task)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }} title="Edit Task">
              <Edit3 size={15} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(task._id)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--status-high)' }} title="Delete Task">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable AI Reason Card */}
      <div style={{ marginTop: '0.85rem', borderTop: '1px dashed var(--border-glass)', paddingTop: '0.6rem' }}>
        <button
          onClick={() => setShowAiReason(!showAiReason)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-cyan)',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: 0
          }}
        >
          <Sparkles size={13} />
          <span>{showAiReason ? 'Hide AI Reasoning' : 'View AI Priority Reason'}</span>
          {showAiReason ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAiReason && (
          <div className="ai-reason-box">
            <div className="ai-reason-header">
              <Sparkles size={13} />
              <span>AI Agent Rationale</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              {task.aiReason || 'Analyzed deadline proximity, duration impact, and workload bottlenecks.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
