'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CostCalculation } from '@/types/activity';
import { formatCurrency } from '@/utils/calculations';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';

interface MetricsCardsProps {
  totalCosts: CostCalculation;
  activityCount: number;
}

export function MetricsCards({ totalCosts, activityCount }: MetricsCardsProps) {
  const metrics = [
    {
      title: 'Weekly Cost',
      value: formatCurrency(totalCosts.weekly),
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Total weekly expense',
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Cost',
      value: formatCurrency(totalCosts.monthly),
      icon: <Calendar className="h-4 w-4" />,
      description: 'Total monthly expense',
      color: 'bg-green-500',
    },
    {
      title: 'Annual Cost',
      value: formatCurrency(totalCosts.annual),
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Total yearly expense',
      color: 'bg-orange-500',
    },
    {
      title: 'Activities',
      value: activityCount.toString(),
      icon: <Clock className="h-4 w-4" />,
      description: 'Total tracked activities',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${metric.color} text-white`}>
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}