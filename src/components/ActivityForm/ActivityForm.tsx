'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Activity } from '@/types/activity';

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  frequency: z.number().min(0.1, 'Frequency must be greater than 0'),
  interval: z.enum(['hour', 'day', 'week', 'month']),
  duration: z.number().min(0.01, 'Duration must be greater than 0'),
  hourlyRate: z.number().min(0.01, 'Hourly rate must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
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
      duration: 0.5,
      hourlyRate: 25,
      category: 'Administrative',
    },
  });

  const onSubmit = (data: ActivityFormData) => {
    onAddActivity(data);
    reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Activity
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
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              step="0.25"
              min="0.01"
              placeholder="e.g., 2.5"
              {...register('duration', { valueAsNumber: true })}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
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

          <Button type="submit" className="w-full" disabled={!isValid}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}