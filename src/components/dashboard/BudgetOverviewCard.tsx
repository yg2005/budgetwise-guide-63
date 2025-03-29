
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Category {
  name: string;
  spent: number;
  budgeted: number;
  color: string;
}

interface BudgetOverviewCardProps {
  categories: Category[];
}

export const BudgetOverviewCard = ({ categories }: BudgetOverviewCardProps) => {
  const totalBudgeted = categories.reduce((sum, category) => sum + category.budgeted, 0);
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);
  const percentSpent = categories.length > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <Card className="budget-card">
      <CardHeader className="pb-2">
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Monthly budget breakdown</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No budget data available.</p>
            <p className="text-sm mt-2">Add transactions to see your budget breakdown.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-semibold">${totalBudgeted.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-semibold">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall</span>
                <span>{percentSpent}%</span>
              </div>
              <Progress value={percentSpent} className="h-2" />
              
              {categories.map((category, index) => {
                const percentage = Math.round((category.spent / category.budgeted) * 100);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">
                        ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div 
                        className="h-full transition-all" 
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
