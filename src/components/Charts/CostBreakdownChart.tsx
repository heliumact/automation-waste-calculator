'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityWithCosts } from '@/types/activity';
import { formatCurrency } from '@/utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface CostBreakdownChartProps {
  activities: ActivityWithCosts[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
];

export function CostBreakdownChart({ activities }: CostBreakdownChartProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Add activities to see cost breakdown
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for bar chart (time periods)
  const timePeriodsData = [
    {
      period: 'Weekly',
      amount: activities.reduce((sum, activity) => sum + activity.costs.weekly, 0),
    },
    {
      period: 'Monthly',
      amount: activities.reduce((sum, activity) => sum + activity.costs.monthly, 0),
    },
    {
      period: 'Annual',
      amount: activities.reduce((sum, activity) => sum + activity.costs.annual, 0),
    },
  ];

  // Prepare data for pie chart (activities breakdown)
  const activitiesData = activities.map((activity, index) => ({
    name: activity.name,
    value: activity.costs.annual,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Cost: </span>
            <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Annual Cost: </span>
            <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Periods Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cost by Time Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timePeriodsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-muted-foreground"
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}K`;
                  }
                  return formatCurrency(value);
                }}
                width={60}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#0088FE"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activities Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cost Distribution by Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activitiesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const percentage = ((percent || 0) * 100).toFixed(0);
                  // Show only percentage for slices > 10%, truncate long names
                  if ((percent || 0) >= 0.1) {
                    const shortName = name.length > 15 ? name.substring(0, 12) + '...' : name;
                    return `${shortName}: ${percentage}%`;
                  }
                  // For small slices, only show percentage
                  return `${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: '11px' }}
              >
                {activitiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}