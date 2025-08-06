'use client';

import { useState, useEffect } from 'react';
import { Activity, ActivityWithCosts } from '@/types/activity';
import { calculateActivityCosts } from '@/utils/calculations';

export function useActivities() {
  const [activities, setActivities] = useState<ActivityWithCosts[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('automation-calculator-activities');
    if (stored) {
      try {
        const parsedActivities: Activity[] = JSON.parse(stored);
        const activitiesWithCosts = parsedActivities.map(activity => ({
          ...activity,
          costs: calculateActivityCosts(activity),
        }));
        setActivities(activitiesWithCosts);
      } catch (error) {
        console.error('Error loading activities from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage when activities change
  useEffect(() => {
    const activitiesToStore = activities.map(({ costs, ...activity }) => activity);
    localStorage.setItem('automation-calculator-activities', JSON.stringify(activitiesToStore));
  }, [activities]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    
    const activityWithCosts: ActivityWithCosts = {
      ...newActivity,
      costs: calculateActivityCosts(newActivity),
    };
    
    setActivities(prev => [...prev, activityWithCosts]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          const updated = { ...activity, ...updates };
          return {
            ...updated,
            costs: calculateActivityCosts(updated),
          };
        }
        return activity;
      })
    );
  };

  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const clearAllActivities = () => {
    setActivities([]);
  };

  return {
    activities,
    addActivity,
    updateActivity,
    removeActivity,
    clearAllActivities,
  };
}