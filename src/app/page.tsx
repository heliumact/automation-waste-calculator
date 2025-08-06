'use client';

import { Header } from '@/components/Layout/Header';
import { ActivityForm } from '@/components/ActivityForm/ActivityForm';
import { MetricsCards } from '@/components/ResultsDashboard/MetricsCards';
import { ActivityTable } from '@/components/ResultsDashboard/ActivityTable';
import { CostBreakdownChart } from '@/components/Charts/CostBreakdownChart';
import { ROICalculator } from '@/components/Charts/ROICalculator';
import { useActivities } from '@/hooks/useActivities';
import { calculateTotalCosts } from '@/utils/calculations';

export default function Home() {
  const { activities, addActivity, removeActivity } = useActivities();
  const totalCosts = calculateTotalCosts(activities);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Activity Form */}
          <div className="lg:col-span-1 space-y-6">
            <ActivityForm onAddActivity={addActivity} />
          </div>
          
          {/* Main Content - Results Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <MetricsCards 
              totalCosts={totalCosts} 
              activityCount={activities.length} 
            />
            
            <CostBreakdownChart activities={activities} />
            
            <ROICalculator activities={activities} />
            
            <ActivityTable 
              activities={activities} 
              onRemoveActivity={removeActivity} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}