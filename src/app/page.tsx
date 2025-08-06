'use client';

import { Header } from '@/components/Layout/Header';
import { ActivityForm } from '@/components/ActivityForm/ActivityForm';
import { RunningTotalsSection } from '@/components/ResultsDashboard/RunningTotalsSection';
import { useActivities } from '@/hooks/useActivities';

export default function Home() {
  const { activities, addActivity, removeActivity } = useActivities();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Top Section - Current Activity Entry */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Add New Manual Activity
            </h2>
            <p className="text-muted-foreground">
              Enter details for your current manual activity and see live cost calculations
            </p>
          </div>
          
          <ActivityForm onAddActivity={addActivity} />
        </div>
        
        {/* Bottom Section - Running Totals */}
        <RunningTotalsSection 
          activities={activities}
          onRemoveActivity={removeActivity}
        />
      </div>
    </div>
  );
}