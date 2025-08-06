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
import { formatCurrency, formatDuration, formatPercentage } from '@/utils/calculations';
import { Trash2, List, Download } from 'lucide-react';

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

  const exportToCSV = () => {
    const headers = [
      'Activity #',
      'Activity Name',
      'Category',
      'Frequency',
      'Interval',
      'Duration',
      'Hourly Rate',
      'Weekly Cost',
      'Monthly Cost',
      'Annual Cost',
      'Investment Cost',
      'Efficiency Improvement (%)',
      'ROI (%)',
      'Payback Period (months)',
      'Annual Savings'
    ];

    const rows = activities.map(activity => [
      activity.activityNumber,
      activity.name,
      activity.category,
      activity.frequency,
      activity.interval,
      formatDuration(activity.duration),
      `$${activity.hourlyRate}`,
      formatCurrency(activity.costs.weekly),
      formatCurrency(activity.costs.monthly),
      formatCurrency(activity.costs.annual),
      activity.roiData ? formatCurrency(activity.roiData.automationCost) : 'N/A',
      activity.roiData ? `${activity.roiData.efficiencyReduction}%` : 'N/A',
      activity.roiData ? formatPercentage(activity.roiData.roi) : 'N/A',
      activity.roiData ? activity.roiData.paybackPeriodMonths.toFixed(1) : 'N/A',
      activity.roiData ? formatCurrency(activity.roiData.annualSavings) : 'N/A',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `automation-opportunities-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Automation Opportunities Overview
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Automation Opportunities Overview
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
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
                <TableHead>Investment Cost</TableHead>
                <TableHead>Efficiency Improvement</TableHead>
                <TableHead>ROI %</TableHead>
                <TableHead>Payback</TableHead>
                <TableHead>Annual Savings</TableHead>
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
                  <TableCell className="text-center">
                    {activity.roiData ? (
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(activity.roiData.automationCost)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {activity.roiData ? (
                      <span className="font-semibold text-purple-600">
                        {activity.roiData.efficiencyReduction}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {activity.roiData ? (
                      <span className={`font-semibold ${
                        activity.roiData.roi >= 200 ? 'text-green-600' :
                        activity.roiData.roi >= 100 ? 'text-blue-600' :
                        activity.roiData.roi >= 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(activity.roiData.roi)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {activity.roiData ? (
                      <span className={`font-semibold ${
                        activity.roiData.paybackPeriodMonths <= 6 ? 'text-green-600' :
                        activity.roiData.paybackPeriodMonths <= 12 ? 'text-blue-600' :
                        activity.roiData.paybackPeriodMonths <= 24 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {activity.roiData.paybackPeriodMonths.toFixed(1)}m
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {activity.roiData ? (
                      <span className="font-semibold text-green-600">
                        {formatCurrency(activity.roiData.annualSavings)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
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