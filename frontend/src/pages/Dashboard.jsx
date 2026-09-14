import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import StatCard from '../components/StatCard';
import AIRecommendationCard from '../components/AIRecommendationCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import AgentProcessVisualizer from '../components/AgentProcessVisualizer';
import { CheckSquare, CheckCircle, Clock, ShieldAlert, Plus, Sparkles, AlertTriangle } from 'lucide-react';

export default function Dashboard({ onNavigateTab }) {
  const { tasks, toggleTaskComplete, deleteTask, insights } = useContext(TaskContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const activeTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const highPriorityTasks = activeTasks.filter(t => (t.aiRecommendedPriority || t.priority) === 'High');

  // Sorted by deadline
  const upcomingTasks = [...activeTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  
  // Pick top task for AI Agent Recommendation banner
  const topTask = highPriorityTasks[0] || upcomingTasks[0];

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Top Banner & Quick Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Productivity Agent Hub</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Real-time perception & autonomous priority optimization active.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn-primary">
          <Plus size={18} />
          <span>New Task with AI</span>
        </button>
      </div>

      {/* AI Recommendation Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <AIRecommendationCard topTask={topTask} onFocusTask={(t) => handleEditTask(t)} />
      </div>

      {/* Task Statistics Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={CheckSquare}
          trend={`${activeTasks.length} Pending`}
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks.length}
          icon={CheckCircle}
          trend={`${tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}% Done`}
          color="var(--status-low)"
        />
        <StatCard
          title="Pending Tasks"
          value={activeTasks.length}
          icon={Clock}
          trend="In Pipeline"
          color="var(--status-med)"
        />
        <StatCard
          title="High Priority Urgent"
          value={highPriorityTasks.length}
          icon={ShieldAlert}
          trend="Requires Action"
          color="var(--status-high)"
        />
      </div>

      {/* 5-Step AI Process Visualizer */}
      <AgentProcessVisualizer steps={insights?.architectureSteps} />

      {/* Dashboard Main 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* High Priority & Today's Urgent Focus */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} style={{ color: 'var(--status-high)' }} />
              High Priority Tasks ({highPriorityTasks.length})
            </h3>
            <button onClick={() => onNavigateTab('tasks')} style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', fontSize: '0.82rem', fontWeight: 600 }}>
              View All
            </button>
          </div>

          {highPriorityTasks.length === 0 ? (
            <div className="glass-card" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <Sparkles size={32} style={{ color: 'var(--status-low)', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No urgent high-priority bottlenecks remaining!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {highPriorityTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--primary-cyan)' }} />
              Upcoming Deadlines ({upcomingTasks.length})
            </h3>
            <button onClick={() => onNavigateTab('planner')} style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', fontSize: '0.82rem', fontWeight: 600 }}>
              Daily Planner
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="glass-card" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <CheckCircle size={32} style={{ color: 'var(--primary-cyan)', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No pending deadlines. Enjoy your day!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTask={editingTask}
      />
    </div>
  );
}
