'use client';

import { Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Manual Activity Waste Calculator
              </h1>
              <p className="text-sm text-muted-foreground">
                Calculate the cost of manual tasks and potential automation savings
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}