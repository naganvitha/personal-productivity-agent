# Personal Productivity AI Agent

An intelligent, full-stack AI-powered productivity system built with **Node.js, Express, MongoDB, React, Vite, and custom AI Agent decision algorithms**.

Unlike traditional static to-do applications, the **Personal Productivity AI Agent** actively perceives task deadlines, estimates workload effort, computes urgency matrices, recommends task priorities with clear human-readable rationales, generates time-blocked daily schedules with automatic break allocations, and provides an interactive context-aware chatbot assistant.

---

## 🌟 Key Features

1. **User Authentication**: Secure JWT-based registration, login, and user profile configuration.
2. **AI Priority Management**: Autonomous analysis of tasks based on deadline proximity, effort ratio, and urgency scores. Displays a clear **AI Rationale ("Why this priority was recommended")** for every single task.
3. **Smart Daily Scheduler**: Automatically generates time-blocked daily schedules with break intervals (15 min rest after 90 mins focus) tailored to the user's working hours window (e.g., 09:00 AM - 05:00 PM).
4. **AI Agent Chatbot Assistant**: Real-time context-aware assistant for queries such as:
   - *"What should I work on first?"*
   - *"What is my highest priority task?"*
   - *"Plan my day"*
   - *"Which tasks are due soon?"*
   - *"Can I postpone a task?"*
5. **5-Step AI Agent Architecture**:
   - **Step 1: Perception**: Collects tasks, deadlines, status, duration, and user schedule window.
   - **Step 2: Analysis**: Computes urgency matrix, hours remaining, and effort ratio.
   - **Step 3: Planning**: Generates priority recommendations & time-blocked timetable.
   - **Step 4: Action**: Displays clear AI rationales, schedule cards, and chatbot advice.
   - **Step 5: Feedback**: Dynamically recalculates priorities and schedules whenever tasks change state.
6. **Task Dashboard & Insights**: Live metrics for Total, Completed, Pending, and High Priority tasks, category distribution, and visual progress gauges.
7. **Custom Categories**: Supports default (Academic, Personal, Work, Health, Other) and custom user categories.

---

## 🏗️ Project Structure

```
personal-productivity-agent/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB config with automatic In-Memory fallback
│   ├── models/              # User, Task, Category, Schedule models
│   ├── routes/              # Auth, Task, Category, Schedule, AI routes
│   ├── controllers/         # Business logic controllers
│   ├── ai/                  # AI Agent Decision Engine Core
│   │   ├── priorityAnalyzer.js
│   │   ├── schedulerEngine.js
│   │   ├── llmIntegration.js
│   │   └── agentEngine.js
│   ├── scripts/
│   │   └── seed.js          # Demo dataset seeder script
│   └── server.js            # Backend entrypoint
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios client with JWT interceptor
    │   ├── context/         # AuthContext & TaskContext
    │   ├── components/      # Sidebar, Navbar, AI Cards, Task Cards, Timeline, Chatbot
    │   ├── pages/           # Dashboard, My Tasks, Daily Planner, AI Assistant, Insights, Profile
    │   ├── index.css        # Glassmorphic dark cyber-productivity design system
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

---

## 🌐 Live Demo

Try the live application here:

🔗 https://personal-productivity-agent.netlify.app

### 🔑 Demo Login

You can either:

- Create a new account using the **Register Now** option, or
- Click **Instant One-Click Demo Login** to explore the application instantly.

**Demo Credentials:**

- **Email:** `demo@productivity.ai`
- **Password:** `password123`
