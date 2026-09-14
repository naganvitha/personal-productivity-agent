const { analyzeTaskPriority } = require('./priorityAnalyzer');
const { generateSmartSchedule } = require('./schedulerEngine');
const { processChatQuery } = require('./llmIntegration');

/**
 * 5-Step AI Agent Architecture Core
 */
class ProductivityAgentEngine {
  
  // Step 1 & 2: Perception & Analysis
  static analyzeTasks(tasks) {
    return tasks.map(task => {
      const analysis = analyzeTaskPriority(task);
      return {
        ...task.toObject ? task.toObject() : task,
        aiRecommendedPriority: analysis.aiRecommendedPriority,
        aiReason: analysis.aiReason,
        urgencyScore: analysis.urgencyScore,
        hoursRemaining: analysis.hoursRemaining
      };
    });
  }

  // Step 3: Planning
  static planDailySchedule(tasks, userSettings) {
    const analyzedTasks = this.analyzeTasks(tasks);
    return generateSmartSchedule(analyzedTasks, userSettings);
  }

  // Step 4: Action (Chat / Insights / Briefing)
  static async interact(query, userTasks, userSchedule) {
    const analyzedTasks = this.analyzeTasks(userTasks);
    return await processChatQuery(query, analyzedTasks, userSchedule);
  }

  // Step 5: Feedback & Insights Generation
  static generateInsights(tasks, userSchedule) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const active = tasks.filter(t => t.status !== 'Completed');
    const highPriority = active.filter(t => (t.aiRecommendedPriority || t.priority) === 'High').length;

    // Calculate Category productivity distribution
    const categoryCount = {};
    tasks.forEach(t => {
      const cat = t.category || 'Work';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    let topCategory = 'None';
    let maxCount = 0;
    Object.entries(categoryCount).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const keyInsights = [];
    keyInsights.push(`You have completed ${completed} out of ${total} tasks (${completionRate}% completion rate).`);
    
    if (highPriority > 0) {
      keyInsights.push(`You have ${highPriority} high-priority task(s) remaining. Prioritize these to clear critical bottlenecks.`);
    } else {
      keyInsights.push(`No critical high-priority bottlenecks remaining. Excellent task management!`);
    }

    if (topCategory !== 'None') {
      keyInsights.push(`Your most active category is "${topCategory}" with ${maxCount} task(s).`);
    }

    keyInsights.push(`Remember to take 15-minute rest breaks after 90 minutes of intensive work.`);

    return {
      agentStatus: 'ACTIVE',
      perceptionSummary: {
        totalTasks: total,
        activeTasks: active.length,
        completedTasks: completed,
        highPriorityCount: highPriority,
        completionRate: `${completionRate}%`,
        topCategory
      },
      agentInsights: keyInsights,
      architectureSteps: [
        { step: 1, name: 'Perception', description: 'Gathers tasks, deadlines, status, and work hours from database.' },
        { step: 2, name: 'Analysis', description: 'Evaluates urgency scores, deadline proximity, and effort ratios.' },
        { step: 3, name: 'Planning', description: 'Constructs priority matrices and generates time-blocked daily schedules.' },
        { step: 4, name: 'Action', description: 'Delivers priority recommendations, detailed rationales, and schedule blocks.' },
        { step: 5, name: 'Feedback', description: 'Dynamically recalculates priority and plans when tasks change state.' }
      ]
    };
  }
}

module.exports = ProductivityAgentEngine;
