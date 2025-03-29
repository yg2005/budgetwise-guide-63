
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, Utensils, Home, Car } from "lucide-react";

// Transaction category icons
const categoryIcons: Record<string, React.ElementType> = {
  coffee: Coffee,
  shopping: ShoppingBag,
  dining: Utensils,
  housing: Home,
  transport: Car,
};

interface Transaction {
  id: string;
  payee: string;
  category: keyof typeof categoryIcons;
  date: string;
  amount: number;
  type: "income" | "expense";
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
}

export function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  return (
    <Card className="animate-fade-in card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <a href="/transactions" className="text-sm text-primary underline underline-offset-4">View all</a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const IconComponent = categoryIcons[transaction.category] || ShoppingBag;
            const isExpense = transaction.type === "expense";
            
            return (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${isExpense ? 'bg-accent' : 'bg-secondary/20'}`}>
                    <IconComponent className={`h-4 w-4 ${isExpense ? 'text-accent-foreground' : 'text-secondary'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.payee}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`font-medium ${isExpense ? 'text-budget-coral' : 'text-budget-mint'}`}>
                    {isExpense ? '- ' : '+ '}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                  {isExpense ? (
                    <ArrowUpRight className="h-4 w-4 ml-2 text-budget-coral" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 ml-2 text-budget-mint" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
