
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, Utensils, Home, Car, Plus, BookOpen, Zap, Briefcase, Dumbbell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Transaction category icons - expanded to include more categories
const categoryIcons: Record<string, React.ElementType> = {
  coffee: Coffee,
  shopping: ShoppingBag,
  dining: Utensils,
  food: Utensils,
  housing: Home,
  transportation: Car,
  entertainment: Zap,
  utilities: Briefcase,
  education: BookOpen,
  healthcare: Heart,
  personal: Dumbbell,
  other: Plus,
};

interface Transaction {
  id: string;
  payee: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
}

export function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="animate-fade-in card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button 
          variant="outline" 
          onClick={() => navigate('/transactions')}
          className="text-sm"
        >
          View all transactions
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent transactions found.</p>
            <p className="text-sm mt-2">Add your first transaction using the form above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              // Convert category to lowercase and find matching icon or fallback to default
              const categoryKey = transaction.category.toLowerCase();
              const IconComponent = categoryIcons[categoryKey] || ShoppingBag;
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
        )}
      </CardContent>
    </Card>
  );
}
