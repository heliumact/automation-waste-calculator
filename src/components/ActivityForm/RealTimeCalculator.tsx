'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostCalculation } from '@/types/activity';
import { formatCurrency } from '@/utils/calculations';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface RealTimeCalculatorProps {
  costs: CostCalculation | null;
}

export function RealTimeCalculator({ costs }: RealTimeCalculatorProps) {
  if (!costs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Cost Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter activity details to see live cost calculations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Weekly Cost',
      value: formatCurrency(costs.weekly),
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Cost per week',
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Cost',
      value: formatCurrency(costs.monthly),
      icon: <Calendar className="h-4 w-4" />,
      description: 'Cost per month',
      color: 'bg-green-500',
    },
    {
      title: 'Annual Cost',
      value: formatCurrency(costs.annual),
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Cost per year',
      color: 'bg-orange-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Cost Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg border p-4">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </div>
                <div className={`p-2 rounded-full ${metric.color} text-white`}>
                  {metric.icon}
                </div>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-1">Cost per Activity</div>
          <div className="text-lg font-semibold">{formatCurrency(costs.perActivity)}</div>
        </div>
      </CardContent>
    </Card>
  );
}