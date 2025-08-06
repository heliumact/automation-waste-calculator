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
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Top Section - Add New Manual Activity */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Add New Manual Activity
            </h2>
            <p className="text-muted-foreground">
              Enter details about your current manual process to calculate its cost and potential automation ROI.
            </p>
          </div>
          <ActivityForm onAddActivity={addActivity} />
        </section>

        {/* Bottom Section - Running Totals Summary */}
        {activities.length > 0 && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Running Totals Summary
              </h2>
              <p className="text-muted-foreground">
                Comprehensive analysis of all your manual activities and automation opportunities.
              </p>
            </div>
            <RunningTotalsSection activities={activities} onRemoveActivity={removeActivity} />
          </section>
        )}
      </div>
    </div>
  );
}
