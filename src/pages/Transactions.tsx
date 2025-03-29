
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, Search } from "lucide-react";

// Mock transaction data
const transactions = [
  {
    id: 1,
    date: "Mar 28, 2023",
    merchant: "Grocery Store",
    category: "Food",
    amount: -82.35,
    categoryColor: "bg-green-100 text-green-800"
  },
  {
    id: 2,
    date: "Mar 27, 2023",
    merchant: "Electric Company",
    category: "Utilities",
    amount: -145.00,
    categoryColor: "bg-blue-100 text-blue-800"
  },
  {
    id: 3,
    date: "Mar 26, 2023",
    merchant: "Coffee Shop",
    category: "Food",
    amount: -4.75,
    categoryColor: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    date: "Mar 25, 2023",
    merchant: "Payroll",
    category: "Income",
    amount: 1450.00,
    categoryColor: "bg-purple-100 text-purple-800"
  },
  {
    id: 5,
    date: "Mar 24, 2023",
    merchant: "Restaurant",
    category: "Food",
    amount: -35.42,
    categoryColor: "bg-green-100 text-green-800"
  },
  {
    id: 6,
    date: "Mar 22, 2023",
    merchant: "Gas Station",
    category: "Transportation",
    amount: -48.65,
    categoryColor: "bg-orange-100 text-orange-800"
  }
];

const Transactions = () => {
  return (
    <PageLayout title="Transactions">
      <div className="animate-fade-in space-y-6">
        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="budget-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-value text-destructive">$316.17</p>
            </CardContent>
          </Card>
          
          <Card className="budget-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-value text-primary">$1,450.00</p>
            </CardContent>
          </Card>
          
          <Card className="budget-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-value">6</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar size={14} />
              This Month
              <ChevronDown size={14} />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              All Categories
              <ChevronDown size={14} />
            </Button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-8 w-full"
              type="search"
            />
          </div>
        </div>
        
        {/* Transaction List */}
        <Card className="budget-card">
          <div className="rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Merchant</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">{transaction.date}</td>
                      <td className="px-4 py-3">{transaction.merchant}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={transaction.categoryColor}>
                          {transaction.category}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3 text-right ${transaction.amount < 0 ? 'text-destructive' : 'text-primary'}`}>
                        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm">Load More</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Transactions;
