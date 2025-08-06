'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ActivityWithCosts } from '@/types/activity';
import { calculateAutomationROI, formatCurrency, formatPercentage } from '@/utils/calculations';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface ROICalculatorProps {
  activities: ActivityWithCosts[];
}

export function ROICalculator({ activities }: ROICalculatorProps) {
  const [automationCost, setAutomationCost] = useState<number>(2000);
  const [efficiencyReduction, setEfficiencyReduction] = useState<number>(80);
  
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Automation ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add activities to calculate automation ROI</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAnnualCost = activities.reduce((sum, activity) => sum + activity.costs.annual, 0);
  const roiData = calculateAutomationROI(totalAnnualCost, automationCost, efficiencyReduction);

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
          Automation ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="automationCost">Automation Investment ($)</Label>
            <Input
              id="automationCost"
              type="number"
              value={automationCost}
              onChange={(e) => setAutomationCost(Number(e.target.value))}
              min="0"
              step="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="efficiencyReduction">Efficiency Improvement (%)</Label>
            <Input
              id="efficiencyReduction"
              type="number"
              value={efficiencyReduction}
              onChange={(e) => setEfficiencyReduction(Number(e.target.value))}
              min="0"
              max="100"
              step="5"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Efficiency Improvement</span>
            <span>{efficiencyReduction}%</span>
          </div>
          <Progress value={efficiencyReduction} className="h-2" />
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
            With an investment of {formatCurrency(automationCost)} and {efficiencyReduction}% efficiency improvement, 
            you could save {formatCurrency(roiData.annualSavings)} annually. 
            This represents a {formatPercentage(roiData.roi)} ROI with a payback period of {roiData.paybackPeriodMonths.toFixed(1)} months.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}