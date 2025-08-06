import { Activity, CostCalculation, ActivityWithCosts } from '@/types/activity';

/**
 * Calculate cost for a single activity across different time periods
 */
export function calculateActivityCosts(activity: Activity): CostCalculation {
  const costPerActivity = activity.duration * activity.hourlyRate;
  
  // Convert frequency to weekly frequency
  let weeklyFrequency: number;
  switch (activity.interval) {
    case 'hour':
      weeklyFrequency = activity.frequency * 40; // Assuming 40-hour work week
      break;
    case 'day':
      weeklyFrequency = activity.frequency * 5; // Assuming 5-day work week
      break;
    case 'week':
      weeklyFrequency = activity.frequency;
      break;
    case 'month':
      weeklyFrequency = activity.frequency / 4.33; // Average weeks per month
      break;
    default:
      weeklyFrequency = activity.frequency;
  }

  const weeklyCost = weeklyFrequency * costPerActivity;
  const monthlyCost = weeklyCost * 4.33; // Average weeks per month
  const annualCost = weeklyCost * 52; // Weeks per year

  return {
    perActivity: costPerActivity,
    weekly: weeklyCost,
    monthly: monthlyCost,
    annual: annualCost,
  };
}

/**
 * Calculate total costs across all activities
 */
export function calculateTotalCosts(activities: ActivityWithCosts[]): CostCalculation {
  return activities.reduce(
    (total, activity) => ({
      perActivity: total.perActivity + activity.costs.perActivity,
      weekly: total.weekly + activity.costs.weekly,
      monthly: total.monthly + activity.costs.monthly,
      annual: total.annual + activity.costs.annual,
    }),
    { perActivity: 0, weekly: 0, monthly: 0, annual: 0 }
  );
}

/**
 * Calculate automation ROI and payback period
 */
export function calculateAutomationROI(
  annualCost: number,
  automationCost: number,
  efficiencyReduction: number
): {
  annualSavings: number;
  roi: number;
  paybackPeriodMonths: number;
} {
  const annualSavings = annualCost * (efficiencyReduction / 100);
  const roi = ((annualSavings - automationCost) / automationCost) * 100;
  const paybackPeriodMonths = automationCost / (annualSavings / 12);

  return {
    annualSavings,
    roi,
    paybackPeriodMonths,
  };
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format duration in hours to human readable format
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}m`;
}