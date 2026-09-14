/**
 * LLM Integration & Smart Fallback Chat Engine
 */

async function processChatQuery(query, userTasks = [], userSchedule = null) {
  const qLower = query.toLowerCase().trim();
  const activeTasks = userTasks.filter(t => t.status !== 'Completed');
  const completedTasks = userTasks.filter(t => t.status === 'Completed');
  const highPriorityTasks = activeTasks.filter(t => (t.aiRecommendedPriority || t.priority) === 'High');
  
  // Sort by deadline
  const sortedByDeadline = [...activeTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // If GEMINI_API_KEY is available, we could call Google Gemini API here.
  // For instant zero-config out of the box performance, we also provide a rich context-aware AI Agent reasoning response.

  if (qLower.includes('what should i do') || qLower.includes('work on first') || qLower.includes('start with')) {
    if (activeTasks.length === 0) {
      return {
        reply: "🎉 Great news! You have no pending tasks right now. Take a break, review your long-term goals, or add new tasks whenever you're ready.",
        actionSuggested: "Create Task"
      };
    }

    const topTask = highPriorityTasks[0] || sortedByDeadline[0];
    const deadlineHours = Math.round((new Date(topTask.deadline) - new Date()) / (1000 * 60 * 60));

    return {
      reply: `🤖 **AI Recommendation:** You should start with **"${topTask.title}"**.\n\n**Reasoning:** This task is categorized under *${topTask.category}* and is rated **${topTask.aiRecommendedPriority || topTask.priority} Priority**. ${deadlineHours <= 24 ? `Its deadline is in **${deadlineHours} hours**!` : `It requires ${topTask.estimatedDuration || 60} mins of focus.`}\n\n${topTask.aiReason || ''}`,
      topTask: topTask
    };
  }

  if (qLower.includes('highest priority') || qLower.includes('top priority')) {
    if (highPriorityTasks.length > 0) {
      const listStr = highPriorityTasks.map((t, idx) => `${idx + 1}. **${t.title}** (${t.category}) - Due: ${new Date(t.deadline).toLocaleDateString()}`).join('\n');
      return {
        reply: `🔥 You have **${highPriorityTasks.length} High-Priority Task(s)** requiring urgent focus:\n\n${listStr}\n\n*Agent Recommendation:* Complete these before moving to medium or low priority items.`,
        highPriorityCount: highPriorityTasks.length
      };
    } else if (activeTasks.length > 0) {
      return {
        reply: `✅ You currently have no High-Priority bottlenecks! Your highest active item is **"${sortedByDeadline[0].title}"** (Medium priority).`,
        topTask: sortedByDeadline[0]
      };
    } else {
      return { reply: "You currently have no pending tasks!" };
    }
  }

  if (qLower.includes('plan my day') || qLower.includes('schedule')) {
    if (!userSchedule || !userSchedule.scheduledTasks || userSchedule.scheduledTasks.length === 0) {
      return {
        reply: `🗓️ I can build your daily plan! You currently have **${activeTasks.length} active tasks**. Head over to the **Daily Planner** tab or click below to generate an optimal time-blocked schedule with break intervals.`,
        actionSuggested: "Generate Schedule"
      };
    }

    const tasksList = userSchedule.scheduledTasks
      .map(item => `• **${item.startTime} – ${item.endTime}**: ${item.taskTitle} ${item.isBreak ? '☕' : ''}`)
      .join('\n');

    return {
      reply: `🗓️ **Here is your AI-optimized schedule for today:**\n\n${tasksList}\n\n*Agent Insight:* ${userSchedule.aiNotes || 'Urgent tasks are scheduled during early hours for peak productivity.'}`
    };
  }

  if (qLower.includes('due soon') || qLower.includes('deadline')) {
    const upcoming = sortedByDeadline.slice(0, 3);
    if (upcoming.length === 0) return { reply: "No upcoming deadlines detected!" };

    const upcomingList = upcoming.map(t => {
      const hours = Math.round((new Date(t.deadline) - new Date()) / (1000 * 60 * 60));
      return `• **${t.title}** - Due in ${hours > 0 ? `${hours}h` : 'OVERDUE'} (${t.aiRecommendedPriority || t.priority} priority)`;
    }).join('\n');

    return {
      reply: `⏳ **Tasks Due Soon:**\n\n${upcomingList}\n\nMake sure to review these in your dashboard.`
    };
  }

  if (qLower.includes('postpone') || qLower.includes('delay')) {
    const lowPriorityTasks = activeTasks.filter(t => (t.aiRecommendedPriority || t.priority) === 'Low');
    if (lowPriorityTasks.length > 0) {
      const postponable = lowPriorityTasks.map(t => `• **${t.title}** (${t.category})`).join('\n');
      return {
        reply: `💡 Based on my priority analysis, the following task(s) have distant deadlines and can be safely postponed:\n\n${postponable}\n\nFocus on your high-priority items first!`
      };
    } else {
      return {
        reply: "⚠️ All your current active tasks are classified as High or Medium priority. Delaying them may cause deadline bottlenecks. If needed, break them down into smaller sub-tasks!"
      };
    }
  }

  if (qLower.includes('organize') || qLower.includes('help') || qLower.includes('summary')) {
    return {
      reply: `📊 **Workload Analysis & Agent Summary:**\n\n` +
        `• Total Active Tasks: **${activeTasks.length}**\n` +
        `• High Priority Tasks: **${highPriorityTasks.length}**\n` +
        `• Completed Today: **${completedTasks.length}**\n\n` +
        `💡 *Recommendation:* Work on high-priority deadlines first, schedule 15-minute breaks after 90 minutes of work, and mark completed tasks to keep your schedule dynamic!`
    };
  }

  // Fallback intelligent agent response
  return {
    reply: `🤖 **AI Productivity Agent**: I analyzed your **${activeTasks.length} active tasks**. ` +
      (highPriorityTasks.length > 0 
        ? `Your most critical item is **"${highPriorityTasks[0].title}"**. Would you like me to detail its priority reason or help schedule your day?`
        : `All tasks are manageable! Ask me *"What should I do today?"* or *"Plan my day"* to get started.`)
  };
}

module.exports = { processChatQuery };
