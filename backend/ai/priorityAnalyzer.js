/**
 * AI Priority Management Engine
 * Calculates task urgency score, recommended priority, and human-readable reasoning.
 */

function analyzeTaskPriority(task) {
  const now = new Date();
  const deadline = new Date(task.deadline);
  
  // Calculate hours remaining until deadline
  const timeDiffMs = deadline.getTime() - now.getTime();
  const hoursRemaining = timeDiffMs / (1000 * 60 * 60);
  const durationHours = (task.estimatedDuration || 60) / 60;
  
  let score = 50; // base score
  let recommendedPriority = 'Medium';
  let reasoningParts = [];
  
  // 1. Deadline Proximity Analysis
  if (hoursRemaining <= 0) {
    score += 45;
    recommendedPriority = 'High';
    reasoningParts.push(`This task is OVERDUE by ${Math.abs(Math.round(hoursRemaining))} hours! Immediate attention required.`);
  } else if (hoursRemaining <= 24) {
    score += 35;
    recommendedPriority = 'High';
    reasoningParts.push(`The deadline is approaching very soon (within ${Math.round(hoursRemaining)} hours).`);
  } else if (hoursRemaining <= 72) { // within 3 days
    score += 15;
    if (durationHours >= 3) {
      recommendedPriority = 'High';
      reasoningParts.push(`Due within ${Math.round(hoursRemaining / 24)} days and requires significant time (${durationHours} hours).`);
    } else {
      recommendedPriority = 'Medium';
      reasoningParts.push(`Due in ${Math.round(hoursRemaining / 24)} days.`);
    }
  } else if (hoursRemaining <= 168) { // within 7 days
    recommendedPriority = 'Medium';
    reasoningParts.push(`Deadline is moderate (${Math.round(hoursRemaining / 24)} days away).`);
  } else {
    score -= 20;
    recommendedPriority = 'Low';
    reasoningParts.push(`Plenty of time remaining until deadline (${Math.round(hoursRemaining / 24)} days away).`);
  }

  // 2. Effort / Duration Impact
  if (durationHours >= 4 && hoursRemaining > 0 && hoursRemaining < 48) {
    score += 15;
    recommendedPriority = 'High';
    reasoningParts.push(`Requires a substantial ${durationHours} hours block of focused work before the deadline.`);
  }

  // 3. User Assigned Priority Context
  if (task.priority === 'High' && recommendedPriority !== 'High') {
    reasoningParts.push(`User manually marked this as High priority.`);
  }

  // Build clear final explanation
  let finalReason = '';
  if (recommendedPriority === 'High') {
    finalReason = `HIGH PRIORITY RECOMMENDED: ${reasoningParts.join(' ')} Completing this task first will prevent last-minute rush and deadline failure.`;
  } else if (recommendedPriority === 'Medium') {
    finalReason = `MEDIUM PRIORITY RECOMMENDED: ${reasoningParts.join(' ')} Schedule this task after urgent items are completed.`;
  } else {
    finalReason = `LOW PRIORITY RECOMMENDED: ${reasoningParts.join(' ')} This task can be scheduled flexibly or postponed if urgent deadlines arise.`;
  }

  return {
    aiRecommendedPriority: recommendedPriority,
    aiReason: finalReason,
    urgencyScore: Math.min(100, Math.max(0, score)),
    hoursRemaining: Math.round(hoursRemaining * 10) / 10
  };
}

module.exports = { analyzeTaskPriority };
