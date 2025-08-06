'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Activity } from '@/types/activity';
import { calculateActivityCosts } from '@/utils/calculations';
import { RealTimeCalculator } from './RealTimeCalculator';
import { CurrentActivityROI } from './CurrentActivityROI';

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  frequency: z.number().min(0.1, 'Frequency must be greater than 0'),
  interval: z.enum(['hour', 'day', 'week', 'month']),
  durationHours: z.number().min(0, 'Hours must be 0 or greater').max(23, 'Hours must be 23 or less'),
  durationMinutes: z.number().min(0, 'Minutes must be 0 or greater').max(59, 'Minutes must be 59 or less'),
  hourlyRate: z.number().min(0.01, 'Hourly rate must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  comments: z.string().optional(),
}).refine((data) => data.durationHours > 0 || data.durationMinutes > 0, {
  message: 'Duration must be greater than 0',
  path: ['durationMinutes'],
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  onAddActivity: (activity: Omit<Activity, 'id' | 'activityNumber'>) => void;
}

const categories = [
  'Administrative',
  'Data Entry',
  'Communication',
  'Reporting',
  'Documentation',
  'Quality Assurance',
  'Customer Service',
  'Other',
];

const intervals = [
  { value: 'hour', label: 'Per Hour' },
  { value: 'day', label: 'Per Day' },
  { value: 'week', label: 'Per Week' },
  { value: 'month', label: 'Per Month' },
];

export function ActivityForm({ onAddActivity }: ActivityFormProps) {
  const [currentROIData, setCurrentROIData] = useState<{
    automationCost: number;
    efficiencyReduction: number;
    roi: number;
    paybackPeriodMonths: number;
    annualSavings: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: '',
      frequency: 1,
      interval: 'day',
      durationHours: 0,
      durationMinutes: 30,
      hourlyRate: 25,
      category: 'Administrative',
      comments: '',
    },
  });

  // Calculate real-time costs for current form data
  const watchedData = watch();
  
  const currentCosts = useMemo(() => {
    if (watchedData.name && watchedData.frequency > 0 && (watchedData.durationHours > 0 || watchedData.durationMinutes > 0) && watchedData.hourlyRate > 0) {
      const duration = watchedData.durationHours + (watchedData.durationMinutes / 60);
      const tempActivity: Activity = {
        id: 'temp',
        activityNumber: 0,
        name: watchedData.name,
        frequency: watchedData.frequency,
        interval: watchedData.interval,
        duration,
        hourlyRate: watchedData.hourlyRate,
        category: watchedData.category,
      };
      return calculateActivityCosts(tempActivity);
    }
    return null;
  }, [watchedData.name, watchedData.frequency, watchedData.durationHours, watchedData.durationMinutes, watchedData.hourlyRate, watchedData.interval, watchedData.category]);

  const onSubmit = useCallback((data: ActivityFormData) => {
    // Convert hours and minutes to decimal hours
    const duration = data.durationHours + (data.durationMinutes / 60);
    const activityData = {
      ...data,
      duration,
      comments: data.comments || undefined,
      roiData: currentROIData || undefined,
      // Remove the separate hour/minute fields
      durationHours: undefined,
      durationMinutes: undefined,
    };
    // Clean up undefined fields
    const { durationHours: _, durationMinutes: __, ...cleanData } = activityData;
    onAddActivity(cleanData);
    reset();
    setCurrentROIData(null);
  }, [currentROIData, onAddActivity, reset]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Current Manual Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              placeholder="e.g., Weekly expense reports"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch('category')}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                type="number"
                step="0.1"
                min="0.1"
                {...register('frequency', { valueAsNumber: true })}
              />
              {errors.frequency && (
                <p className="text-sm text-red-500">{errors.frequency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Interval</Label>
              <Select
                value={watch('interval')}
                onValueChange={(value: 'hour' | 'day' | 'week' | 'month') =>
                  setValue('interval', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intervals.map((interval) => (
                    <SelectItem key={interval.value} value={interval.value}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.interval && (
                <p className="text-sm text-red-500">{errors.interval.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationHours">Hours</Label>
                <Select
                  value={watch('durationHours').toString()}
                  onValueChange={(value) => setValue('durationHours', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} {i === 1 ? 'hour' : 'hours'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.durationHours && (
                  <p className="text-sm text-red-500">{errors.durationHours.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Minutes</Label>
                <Select
                  value={watch('durationMinutes').toString()}
                  onValueChange={(value) => setValue('durationMinutes', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} {i === 1 ? 'minute' : 'minutes'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.durationMinutes && (
                  <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 25.00"
              {...register('hourlyRate', { valueAsNumber: true })}
            />
            {errors.hourlyRate && (
              <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Notes about how you calculated this activity, context, or other relevant details..."
              rows={3}
              {...register('comments')}
            />
            {errors.comments && (
              <p className="text-sm text-red-500">{errors.comments.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            <Plus className="h-4 w-4 mr-2" />
            Add Manual Activity
          </Button>
        </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Right Column - Real-time Calculations */}
      <div className="lg:col-span-3 space-y-6">
        <RealTimeCalculator costs={currentCosts} />
        
        <CurrentActivityROI 
          costs={currentCosts} 
          onROIChange={setCurrentROIData}
        />
      </div>
    </div>
  );
}