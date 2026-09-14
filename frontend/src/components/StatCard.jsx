import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color }) {
  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
          <div className="stat-val">{value}</div>
          {trend && (
            <span style={{ fontSize: '0.75rem', color: color || 'var(--primary-cyan)', fontWeight: 600 }}>
              {trend}
            </span>
          )}
        </div>

        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: color ? `${color}20` : 'rgba(0, 242, 254, 0.1)',
          color: color || 'var(--primary-cyan)',
          border: `1px solid ${color ? `${color}40` : 'rgba(0, 242, 254, 0.2)'}`
        }}>
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </div>
  );
}
