import React, { useState, useContext, useRef, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Bot, Send, User, Sparkles, CornerDownLeft } from 'lucide-react';

export default function ChatBotWidget() {
  const { sendAIChat, tasks } = useContext(TaskContext);
  
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: `Hello! I am your **Personal Productivity AI Agent**. I am currently tracking **${tasks.filter(t => t.status !== 'Completed').length} active tasks** in your system.\n\nHow can I help optimize your day? Ask me questions like *"What should I work on first?"* or *"Plan my day"*!`
    }
  ]);
  
  const [inputMsg, setInputMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "What should I work on first?",
    "What is my highest priority task?",
    "Plan my day",
    "Which tasks are due soon?",
    "Can I postpone a task?",
    "Help me organize my tasks"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputMsg;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputMsg('');
    setTyping(true);

    try {
      const res = await sendAIChat(textToSend);
      if (res.success) {
        setMessages(prev => [...prev, { sender: 'agent', text: res.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'agent', text: "Sorry, I encountered an issue processing your request." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: "Connection error. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  const renderFormattedText = (text) => {
    // Basic bold/list formatting
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formattedLine = line;

      if (formattedLine.startsWith('• ') || formattedLine.startsWith('* ')) {
        return <li key={idx} style={{ marginLeft: '1.2rem', marginBottom: '0.3rem' }}>{formattedLine.substring(2)}</li>;
      }

      return (
        <p key={idx} style={{ marginBottom: idx === lines.length - 1 ? 0 : '0.5rem', lineHeight: 1.5 }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '620px',
      maxHeight: '80vh',
      padding: '1.25rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-cyan), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <Bot size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>AI Agent Chatbot Assistant</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6 }}></span>
            Context Aware • Real-time Task Perception
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, idx) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignSelf: isAgent ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}
            >
              {isAgent && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-cyan)',
                  flexShrink: 0
                }}>
                  <Bot size={18} />
                </div>
              )}

              <div style={{
                background: isAgent ? 'rgba(30, 41, 59, 0.85)' : 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
                border: isAgent ? '1px solid var(--border-glass)' : 'none',
                borderRadius: isAgent ? '0 14px 14px 14px' : '14px 0 14px 14px',
                padding: '0.85rem 1.1rem',
                fontSize: '0.9rem',
                color: '#fff',
                boxShadow: isAgent ? 'none' : '0 4px 15px rgba(0, 242, 254, 0.2)'
              }}>
                {renderFormattedText(msg.text)}
              </div>

              {!isAgent && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  <User size={18} />
                </div>
              )}
            </div>
          );
        })}

        {typing && (
          <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-cyan)'
            }}>
              <Bot size={18} />
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '0.75rem 1rem', borderRadius: '0 14px 14px 14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              🤖 Agent thinking & analyzing task priorities...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}>
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '0.76rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-cyan)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.6rem' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Ask your AI Agent anything about your tasks or schedule..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={!inputMsg.trim() || typing} style={{ padding: '0.75rem 1.25rem' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
