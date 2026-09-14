import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState('ACTIVE');

  useEffect(() => {
    if (token) {
      loadAllData();
    } else {
      setTasks([]);
      setCategories([]);
      setSchedule(null);
      setInsights(null);
    }
  }, [token]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTasks(),
        fetchCategories(),
        fetchTodaySchedule(),
        fetchInsights()
      ]);
    } catch (err) {
      console.error('Failed to load productivity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    const res = await axiosClient.get('/tasks');
    if (res.data.success) {
      setTasks(res.data.tasks);
    }
  };

  const fetchCategories = async () => {
    const res = await axiosClient.get('/categories');
    if (res.data.success) {
      setCategories(res.data.categories);
    }
  };

  const fetchTodaySchedule = async () => {
    const res = await axiosClient.get('/schedule/today');
    if (res.data.success) {
      setSchedule(res.data.schedule);
    }
  };

  const fetchInsights = async () => {
    const res = await axiosClient.get('/ai/insights');
    if (res.data.success) {
      setInsights(res.data.insights);
    }
  };

  const addTask = async (taskData) => {
    const res = await axiosClient.post('/tasks', taskData);
    if (res.data.success) {
      await loadAllData();
    }
    return res.data;
  };

  const updateTask = async (id, taskData) => {
    const res = await axiosClient.put(`/tasks/${id}`, taskData);
    if (res.data.success) {
      await loadAllData();
    }
    return res.data;
  };

  const deleteTask = async (id) => {
    const res = await axiosClient.delete(`/tasks/${id}`);
    if (res.data.success) {
      await loadAllData();
    }
    return res.data;
  };

  const toggleTaskComplete = async (id) => {
    const res = await axiosClient.patch(`/tasks/${id}/complete`);
    if (res.data.success) {
      await loadAllData();
    }
    return res.data;
  };

  const generateNewSchedule = async (workStart, workEnd) => {
    const res = await axiosClient.post('/schedule/generate', { workStart, workEnd });
    if (res.data.success) {
      setSchedule(res.data.schedule);
      await fetchInsights();
    }
    return res.data;
  };

  const addCategory = async (categoryName, color) => {
    const res = await axiosClient.post('/categories', { categoryName, color });
    if (res.data.success) {
      await fetchCategories();
    }
    return res.data;
  };

  const deleteCategory = async (id) => {
    const res = await axiosClient.delete(`/categories/${id}`);
    if (res.data.success) {
      await fetchCategories();
    }
    return res.data;
  };

  const sendAIChat = async (message) => {
    const res = await axiosClient.post('/ai/chat', { query: message });
    return res.data;
  };

  const recalculateAIPlan = async () => {
    const res = await axiosClient.post('/ai/recalculate');
    if (res.data.success) {
      await loadAllData();
    }
    return res.data;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        schedule,
        insights,
        loading,
        agentStatus,
        loadAllData,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        generateNewSchedule,
        addCategory,
        deleteCategory,
        sendAIChat,
        recalculateAIPlan
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
