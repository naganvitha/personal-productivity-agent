/**
 * Smart Daily Scheduler Engine
 * Generates an optimized daily schedule with automatic time blocks and breaks based on task priorities.
 */

function timeStringToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTimeString(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${mStr} ${period}`;
}

function generateSmartSchedule(tasks, options = {}) {
  const workStart = options.workStart || '09:00';
  const workEnd = options.workEnd || '17:00';
  const breakMinutes = options.preferredBreakMinutes || 15;

  let currentMinutes = timeStringToMinutes(workStart);
  const endMinutes = timeStringToMinutes(workEnd);
  const totalAvailableMinutes = endMinutes - currentMinutes;

  // Filter pending or in progress tasks
  const activeTasks = tasks.filter(t => t.status !== 'Completed');

  // Sort tasks by priority (High -> Medium -> Low) & Urgency Score
  const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const sortedTasks = [...activeTasks].sort((a, b) => {
    const weightA = priorityWeight[a.aiRecommendedPriority || a.priority] || 2;
    const weightB = priorityWeight[b.aiRecommendedPriority || b.priority] || 2;
    
    if (weightA !== weightB) return weightB - weightA;
    if ((b.urgencyScore || 0) !== (a.urgencyScore || 0)) return (b.urgencyScore || 0) - (a.urgencyScore || 0);
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const scheduledBlocks = [];
  let minutesSinceLastBreak = 0;
  let scheduledTasksCount = 0;

  for (const task of sortedTasks) {
    if (currentMinutes >= endMinutes) break;

    const taskDuration = task.estimatedDuration || 60;
    
    // Check if we need to insert a break before starting this task (after ~90 mins of work)
    if (minutesSinceLastBreak >= 90 && (currentMinutes + breakMinutes) < endMinutes) {
      const breakStart = currentMinutes;
      currentMinutes += breakMinutes;
      scheduledBlocks.push({
        taskId: null,
        taskTitle: 'Coffee & Stretch Break ☕',
        category: 'Health',
        startTime: minutesToTimeString(breakStart),
        endTime: minutesToTimeString(currentMinutes),
        durationMinutes: breakMinutes,
        isBreak: true,
        breakLabel: 'Rest & Refresh',
        priority: 'Low',
        status: 'Completed'
      });
      minutesSinceLastBreak = 0;
    }

    // Assign time block for task
    const startTimeStr = minutesToTimeString(currentMinutes);
    let durationToAssign = taskDuration;
    
    // Cap duration if exceeding work end
    if (currentMinutes + durationToAssign > endMinutes) {
      durationToAssign = endMinutes - currentMinutes;
    }

    if (durationToAssign <= 0) break;

    const endTimeMinutes = currentMinutes + durationToAssign;
    const endTimeStr = minutesToTimeString(endTimeMinutes);

    scheduledBlocks.push({
      taskId: task._id,
      taskTitle: task.title,
      category: task.category || 'Work',
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationMinutes: durationToAssign,
      isBreak: false,
      priority: task.aiRecommendedPriority || task.priority,
      status: task.status
    });

    currentMinutes = endTimeMinutes;
    minutesSinceLastBreak += durationToAssign;
    scheduledTasksCount++;
  }

  // Construct AI Summary Note
  let aiNotes = `Schedule generated for ${Math.round(totalAvailableMinutes / 60)} hours window (${workStart} - ${workEnd}). `;
  if (scheduledTasksCount > 0) {
    aiNotes += `Prioritized ${scheduledTasksCount} active task(s). High urgency items are scheduled earliest in the day when focus is highest.`;
  } else {
    aiNotes += `All current tasks are completed! You have free time available today.`;
  }

  return {
    scheduledTasks: scheduledBlocks,
    availableHours: Math.round((totalAvailableMinutes / 60) * 10) / 10,
    workStart,
    workEnd,
    aiNotes
  };
}

module.exports = { generateSmartSchedule };
