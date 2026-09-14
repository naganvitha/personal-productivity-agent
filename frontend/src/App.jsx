import React, { useState, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import DailyPlanner from './pages/DailyPlanner';
import AIAssistantPage from './pages/AIAssistantPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';

function MainApp() {
  const { user, loading } = useContext(AuthContext);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tasks', 'planner', 'assistant', 'insights', 'profile'

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)',
        color: 'var(--primary-cyan)',
        fontFamily: 'var(--font-sans)',
        fontSize: '1.2rem',
        fontWeight: 700
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse-dot" style={{ width: 16, height: 16, margin: '0 auto 1rem auto' }}></div>
          Initializing Personal Productivity AI Agent...
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  const tabTitles = {
    dashboard: 'Dashboard',
    tasks: 'My Tasks',
    planner: 'Daily Planner',
    assistant: 'AI Assistant',
    insights: 'Productivity Insights',
    profile: 'Profile & Settings'
  };

  return (
    <TaskProvider>
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="main-content">
          <Navbar activeTabTitle={tabTitles[activeTab]} />
          
          <main className="page-body">
            {activeTab === 'dashboard' && <Dashboard onNavigateTab={setActiveTab} />}
            {activeTab === 'tasks' && <MyTasks />}
            {activeTab === 'planner' && <DailyPlanner />}
            {activeTab === 'assistant' && <AIAssistantPage />}
            {activeTab === 'insights' && <InsightsPage />}
            {activeTab === 'profile' && <ProfilePage />}
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
