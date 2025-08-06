'use client';

import { ActivityWithCosts } from '@/types/activity';
import { calculateTotalCosts } from '@/utils/calculations';
import { MetricsCards } from './MetricsCards';
import { CostBreakdownChart } from '@/components/Charts/CostBreakdownChart';
import { ROICalculator } from '@/components/Charts/ROICalculator';
import { ActivityTable } from './ActivityTable';

interface RunningTotalsSectionProps {
  activities: ActivityWithCosts[];
  onRemoveActivity: (id: string) => void;
}

export function RunningTotalsSection({ activities, onRemoveActivity }: RunningTotalsSectionProps) {
  const totalCosts = calculateTotalCosts(activities);

  return (
    <div className="border-t pt-8 mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Running Totals Summary
        </h2>
        <p className="text-muted-foreground">
          Accumulated costs and analysis across all manual processes
        </p>
      </div>
      
      <div className="space-y-6">
        <MetricsCards 
          totalCosts={totalCosts} 
          activityCount={activities.length} 
        />
        
        <CostBreakdownChart activities={activities} />
        
        <ROICalculator activities={activities} />
        
        <ActivityTable 
          activities={activities} 
          onRemoveActivity={onRemoveActivity} 
        />
      </div>
    </div>
  );
}