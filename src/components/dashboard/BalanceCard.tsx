
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface BalanceCardProps {
  currentBalance: number;
  percentageChange: number;
}

export function BalanceCard({ currentBalance, percentageChange }: BalanceCardProps) {
  const isPositive = percentageChange >= 0;
  
  return (
    <Card className="overflow-hidden animate-fade-in card-hover">
      <CardHeader className="bg-gradient-soft text-white">
        <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <div className="text-3xl font-bold">
            ${currentBalance.toLocaleString()}
          </div>
          <div className="flex items-center">
            <div className={`flex items-center ${isPositive ? 'text-budget-mint' : 'text-budget-coral'}`}>
              {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              <span className="font-medium">{Math.abs(percentageChange)}%</span>
            </div>
            <span className="text-muted-foreground text-sm ml-2">from last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
