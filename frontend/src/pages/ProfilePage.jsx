import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { User, Clock, Tag, Plus, Trash2, Bot, Save, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useContext(AuthContext);
  const { categories, addCategory, deleteCategory } = useContext(TaskContext);

  const [name, setName] = useState(user?.name || '');
  const [workStart, setWorkStart] = useState(user?.workStart || '09:00');
  const [workEnd, setWorkEnd] = useState(user?.workEnd || '17:00');
  const [preferredBreakMinutes, setPreferredBreakMinutes] = useState(user?.preferredBreakMinutes || 15);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#00f2fe');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await updateProfile({ name, workStart, workEnd, preferredBreakMinutes });
      setProfileMsg('Profile and schedule preferences updated successfully!');
    } catch (err) {
      setProfileMsg('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await addCategory(newCatName.trim(), newCatColor);
      setNewCatName('');
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile & AI Agent Settings</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Manage your account preferences, default daily working window, and custom task categories.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* User Info & Schedule Preferences */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <User size={20} style={{ color: 'var(--primary-cyan)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>User Profile Preferences</h3>
          </div>

          {profileMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--status-low)',
              padding: '0.75rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.7 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Daily Work Start</label>
                <input
                  type="time"
                  className="form-control"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Daily Work End</label>
                <input
                  type="time"
                  className="form-control"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Break Interval (Minutes)</label>
              <input
                type="number"
                min={5}
                max={60}
                className="form-control"
                value={preferredBreakMinutes}
                onChange={(e) => setPreferredBreakMinutes(Number(e.target.value))}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={savingProfile} style={{ marginTop: '0.5rem' }}>
              <Save size={16} />
              <span>{savingProfile ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>

        {/* Custom Categories Manager */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Tag size={20} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Category Manager</h3>
          </div>

          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="New category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <input
              type="color"
              style={{ width: '42px', height: '42px', border: 'none', background: 'none', cursor: 'pointer' }}
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
            />
            <button type="submit" className="btn-secondary" disabled={!newCatName.trim()}>
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {categories.map(cat => (
              <div
                key={cat._id || cat.categoryName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color || 'var(--primary-cyan)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat.categoryName}</span>
                  {cat.isDefault && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      Default
                    </span>
                  )}
                </div>

                {!cat.isDefault && (
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--status-high)', cursor: 'pointer' }}
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Engine Status Info */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Bot size={20} style={{ color: 'var(--primary-cyan)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Agent Engine Status</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="agent-badge-pill" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              <div className="pulse-dot"></div>
              <span>ENGINE MODE: RULE-BASED & HEURISTIC ENGINE (ACTIVE)</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Supports instant zero-config priority determination, intelligent daily scheduling, and context-aware chatbot answers out of the box. Optional LLM API keys can be supplied in `.env`.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
