import React from 'react';
import ScheduleTimeline from '../components/ScheduleTimeline';
import { Calendar, Sparkles } from 'lucide-react';

export default function DailyPlanner() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Smart Daily Planner</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Automated time-blocking engine prioritizing high-urgency deadlines and allocating focus rest breaks.
        </p>
      </div>

      <ScheduleTimeline />
    </div>
  );
}
