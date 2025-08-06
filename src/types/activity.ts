export interface Activity {
  id: string;
  activityNumber: number;
  name: string;
  frequency: number;
  interval: 'hour' | 'day' | 'week' | 'month';
  duration: number; // in hours
  hourlyRate: number;
  category: string;
}

export interface CostCalculation {
  perActivity: number;
  weekly: number;
  monthly: number;
  annual: number;
}

export interface ActivityWithCosts extends Activity {
  costs: CostCalculation;
}

export interface AutomationScenario {
  activityId: string;
  automationCost: number;
  efficiencyReduction: number; // percentage (0-100)
  roi: number;
  paybackPeriodMonths: number;
  annualSavings: number;
}