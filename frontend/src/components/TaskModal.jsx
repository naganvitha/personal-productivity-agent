import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import axiosClient from '../api/axiosClient';
import { X, Sparkles, Plus, Save, Bot } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, editingTask }) {
  const { categories, addTask, updateTask } = useContext(TaskContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [deadline, setDeadline] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [priority, setPriority] = useState('Medium');
  
  const [aiPreview, setAiPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'Work');
      
      if (editingTask.deadline) {
        const d = new Date(editingTask.deadline);
        const isoStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDeadline(isoStr);
      } else {
        setDeadline('');
      }

      setEstimatedDuration(editingTask.estimatedDuration || 60);
      setPriority(editingTask.priority || 'Medium');
      setAiPreview({
        aiRecommendedPriority: editingTask.aiRecommendedPriority,
        aiReason: editingTask.aiReason
      });
    } else {
      resetForm();
    }
  }, [editingTask, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(categories[0]?.categoryName || 'Work');
    
    // Default deadline: tomorrow same time
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const isoStr = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setDeadline(isoStr);

    setEstimatedDuration(60);
    setPriority('Medium');
    setAiPreview(null);
  };

  const handleAnalyzePreview = async () => {
    if (!title || !deadline) return;
    setAnalyzing(true);
    try {
      const res = await axiosClient.post('/tasks/analyze', {
        title,
        description,
        category,
        deadline,
        estimatedDuration,
        priority
      });
      if (res.data.success) {
        setAiPreview(res.data.analysis);
      }
    } catch (err) {
      console.error('Failed to preview AI priority:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !deadline) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        deadline,
        estimatedDuration: Number(estimatedDuration),
        priority
      };

      if (editingTask) {
        await updateTask(editingTask._id, payload);
      } else {
        await addTask(payload);
      }

      onClose();
    } catch (err) {
      console.error('Submit task error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--primary-cyan)' }}>
              <Bot size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {editingTask ? 'Edit Task & Re-analyze' : 'Create Task with AI Agent'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Complete DBMS Assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Brief task details, requirements, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat._id || cat.categoryName} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Initial User Priority</label>
              <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Deadline Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Estimated Duration (Minutes)</label>
              <input
                type="number"
                min={15}
                step={15}
                className="form-control"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                required
              />
            </div>
          </div>

          {/* AI Live Priority Preview Button */}
          <div style={{ margin: '1rem 0' }}>
            <button
              type="button"
              onClick={handleAnalyzePreview}
              className="btn-secondary"
              disabled={analyzing || !title || !deadline}
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--primary-cyan)' }}
            >
              <Sparkles size={16} style={{ color: 'var(--primary-cyan)' }} />
              <span>{analyzing ? 'AI Agent Analyzing...' : 'Analyze Priority with AI Agent'}</span>
            </button>
          </div>

          {/* AI Preview Result */}
          {aiPreview && (
            <div className="ai-reason-box" style={{ marginBottom: '1.25rem' }}>
              <div className="ai-reason-header">
                <Bot size={14} />
                <span>AI AGENT PREVIEW: {aiPreview.aiRecommendedPriority} PRIORITY</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {aiPreview.aiReason}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {editingTask ? <Save size={16} /> : <Plus size={16} />}
              <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
