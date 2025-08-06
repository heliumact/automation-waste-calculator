'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ActivityWithCosts } from '@/types/activity';
import { calculateAutomationROI, formatCurrency, formatPercentage } from '@/utils/calculations';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface ROICalculatorProps {
  activities: ActivityWithCosts[];
}

export function ROICalculator({ activities }: ROICalculatorProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Automation Investment ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add activities to calculate automation investment ROI</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAnnualCost = activities.reduce((sum, activity) => sum + activity.costs.annual, 0);
  
  // Calculate total automation investment from all activities that have ROI data
  const totalAutomationCost = activities.reduce((sum, activity) => {
    return sum + (activity.roiData?.automationCost || 0);
  }, 0);
  
  // Calculate weighted average efficiency improvement based on activity costs
  const activitiesWithROI = activities.filter(activity => activity.roiData);
  const weightedEfficiencySum = activitiesWithROI.reduce((sum, activity) => {
    return sum + (activity.roiData!.efficiencyReduction * activity.costs.annual);
  }, 0);
  const averageEfficiencyReduction = activitiesWithROI.length > 0 
    ? weightedEfficiencySum / totalAnnualCost 
    : 80; // fallback to 80% if no ROI data
  
  const roiData = calculateAutomationROI(totalAnnualCost, totalAutomationCost, averageEfficiencyReduction);

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-600';
    if (roi >= 100) return 'text-blue-600';
    if (roi >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPaybackColor = (months: number) => {
    if (months <= 6) return 'text-green-600';
    if (months <= 12) return 'text-blue-600';
    if (months <= 24) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Automation Investment ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Automation Investment</Label>
            <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md">
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(totalAutomationCost)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sum of all individual activity automation costs
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Average Efficiency Improvement</Label>
            <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md">
              <span className="text-lg font-semibold text-purple-600">
                {averageEfficiencyReduction.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted average based on activity costs
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Annual Savings
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(roiData.annualSavings)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              ROI
            </div>
            <div className={`text-2xl font-bold ${getROIColor(roiData.roi)}`}>
              {formatPercentage(roiData.roi)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Payback Period
            </div>
            <div className={`text-2xl font-bold ${getPaybackColor(roiData.paybackPeriodMonths)}`}>
              {roiData.paybackPeriodMonths.toFixed(1)} months
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calculator className="h-4 w-4" />
              Current Annual Cost
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalAnnualCost)}
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {roiData.roi >= 200 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Excellent ROI
              </Badge>
            )}
            {roiData.roi >= 100 && roiData.roi < 200 && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                Good ROI
              </Badge>
            )}
            {roiData.roi >= 0 && roiData.roi < 100 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Moderate ROI
              </Badge>
            )}
            {roiData.roi < 0 && (
              <Badge variant="destructive">
                Negative ROI
              </Badge>
            )}
            
            {roiData.paybackPeriodMonths <= 6 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Fast Payback
              </Badge>
            )}
            {roiData.paybackPeriodMonths <= 12 && roiData.paybackPeriodMonths > 6 && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                Reasonable Payback
              </Badge>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Investment Summary</h4>
          <p className="text-sm text-muted-foreground">
            With a total automation investment of {formatCurrency(totalAutomationCost)} across all activities, 
            you could save {formatCurrency(roiData.annualSavings)} annually. 
            This represents a {formatPercentage(roiData.roi)} ROI with a payback period of {roiData.paybackPeriodMonths.toFixed(1)} months.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}