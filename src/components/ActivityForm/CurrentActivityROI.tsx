'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CostCalculation } from '@/types/activity';
import { calculateAutomationROI, formatCurrency, formatPercentage } from '@/utils/calculations';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface CurrentActivityROIProps {
  costs: CostCalculation | null;
  onROIChange: (roiData: {
    automationCost: number;
    efficiencyReduction: number;
    roi: number;
    paybackPeriodMonths: number;
    annualSavings: number;
  } | null) => void;
}

export function CurrentActivityROI({ costs, onROIChange }: CurrentActivityROIProps) {
  const [automationCost, setAutomationCost] = useState<number>(2000);
  const [efficiencyReduction, setEfficiencyReduction] = useState<number>(80);

  useEffect(() => {
    if (costs && costs.annual > 0) {
      const roiData = calculateAutomationROI(costs.annual, automationCost, efficiencyReduction);
      onROIChange({
        automationCost,
        efficiencyReduction,
        ...roiData,
      });
    } else {
      onROIChange(null);
    }
  }, [costs, automationCost, efficiencyReduction, onROIChange]);

  if (!costs || costs.annual === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Automation Investment ROI Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter activity details to preview automation investment ROI</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const roiData = calculateAutomationROI(costs.annual, automationCost, efficiencyReduction);

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
          Automation ROI Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentAutomationCost">Automation Investment ($)</Label>
            <Input
              id="currentAutomationCost"
              type="number"
              value={automationCost}
              onChange={(e) => setAutomationCost(Number(e.target.value))}
              min="0"
              step="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentEfficiencyReduction">Efficiency Improvement (%)</Label>
            <Input
              id="currentEfficiencyReduction"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Annual Savings
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(roiData.annualSavings)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              ROI
            </div>
            <div className={`text-lg font-bold ${getROIColor(roiData.roi)}`}>
              {formatPercentage(roiData.roi)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Payback
            </div>
            <div className={`text-lg font-bold ${getPaybackColor(roiData.paybackPeriodMonths)}`}>
              {roiData.paybackPeriodMonths.toFixed(1)}m
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calculator className="h-3 w-3" />
              Annual Cost
            </div>
            <div className="text-lg font-bold text-orange-600">
              {formatCurrency(costs.annual)}
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="flex flex-wrap gap-1">
          {roiData.roi >= 200 && (
            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
              Excellent ROI
            </Badge>
          )}
          {roiData.roi >= 100 && roiData.roi < 200 && (
            <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
              Good ROI
            </Badge>
          )}
          {roiData.roi >= 0 && roiData.roi < 100 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
              Moderate ROI
            </Badge>
          )}
          {roiData.roi < 0 && (
            <Badge variant="destructive" className="text-xs">
              Negative ROI
            </Badge>
          )}
          
          {roiData.paybackPeriodMonths <= 6 && (
            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
              Fast Payback
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}