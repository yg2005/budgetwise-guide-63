
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetCategory {
  name: string;
  spent: number;
  budgeted: number;
  color: string;
}

interface BudgetOverviewCardProps {
  categories: BudgetCategory[];
}

export function BudgetOverviewCard({ categories }: BudgetOverviewCardProps) {
  return (
    <Card className="animate-fade-in card-hover h-full">
      <CardHeader>
        <CardTitle>Monthly Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            const percentSpent = Math.min(100, (category.spent / category.budgeted) * 100);
            const isOverBudget = category.spent > category.budgeted;
            
            return (
              <div key={category.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="h-3 w-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className={isOverBudget ? "text-budget-coral font-medium" : ""}>
                      ${category.spent.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      {` / $${category.budgeted.toLocaleString()}`}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={percentSpent} 
                  className="h-2" 
                  indicatorClassName={isOverBudget ? "bg-budget-coral" : undefined}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
