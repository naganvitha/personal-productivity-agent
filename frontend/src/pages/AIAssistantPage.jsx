import React from 'react';
import ChatBotWidget from '../components/ChatBotWidget';

export default function AIAssistantPage() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Agent Assistant</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Converse directly with your agent for task recommendations, priority explanations, and schedule adjustments.
        </p>
      </div>

      <ChatBotWidget />
    </div>
  );
}
