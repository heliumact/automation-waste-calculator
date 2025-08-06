'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityWithCosts } from '@/types/activity';
import { formatCurrency, formatDuration } from '@/utils/calculations';
import { Trash2, List } from 'lucide-react';

interface ActivityTableProps {
  activities: ActivityWithCosts[];
  onRemoveActivity: (id: string) => void;
}

export function ActivityTable({ activities, onRemoveActivity }: ActivityTableProps) {
  const [sortField, setSortField] = useState<keyof ActivityWithCosts['costs'] | 'activityNumber'>('annual');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedActivities = [...activities].sort((a, b) => {
    let aValue: number;
    let bValue: number;
    
    if (sortField === 'activityNumber') {
      aValue = a.activityNumber;
      bValue = b.activityNumber;
    } else {
      aValue = a.costs[sortField];
      bValue = b.costs[sortField];
    }
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  const handleSort = (field: keyof ActivityWithCosts['costs'] | 'activityNumber') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'activityNumber' ? 'asc' : 'desc');
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Activities Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activities added yet.</p>
            <p className="text-sm">Add your first activity to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Activities Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('activityNumber')}
                >
                  Activity # {sortField === 'activityNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('weekly')}
                >
                  Weekly Cost {sortField === 'weekly' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('monthly')}
                >
                  Monthly Cost {sortField === 'monthly' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('annual')}
                >
                  Annual Cost {sortField === 'annual' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-mono text-center">
                    {activity.activityNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{activity.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${activity.hourlyRate}/hr
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{activity.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {activity.frequency}x per {activity.interval}
                  </TableCell>
                  <TableCell>{formatDuration(activity.duration)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(activity.costs.weekly)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(activity.costs.monthly)}
                  </TableCell>
                  <TableCell className="font-semibold text-orange-600">
                    {formatCurrency(activity.costs.annual)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveActivity(activity.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}