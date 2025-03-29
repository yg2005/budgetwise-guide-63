
import { PageLayout } from "@/components/layout/PageLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { BudgetOverviewCard } from "@/components/dashboard/BudgetOverviewCard";
import { ExpenseBreakdownCard } from "@/components/dashboard/ExpenseBreakdownCard";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";
import { FinancialTipCard } from "@/components/dashboard/FinancialTipCard";

// Mock data
const budgetCategories = [
  { name: "Housing", spent: 1200, budgeted: 1400, color: "#4ECDC4" },
  { name: "Food", spent: 450, budgeted: 500, color: "#86CD82" },
  { name: "Transportation", spent: 320, budgeted: 300, color: "#FFD166" },
  { name: "Entertainment", spent: 250, budgeted: 200, color: "#FF6B6B" },
  { name: "Utilities", spent: 180, budgeted: 220, color: "#5E60CE" },
];

const expenseData = [
  { name: "Housing", value: 1200, color: "#4ECDC4" },
  { name: "Food", value: 450, color: "#86CD82" },
  { name: "Transportation", value: 320, color: "#FFD166" },
  { name: "Entertainment", value: 250, color: "#FF6B6B" },
  { name: "Utilities", value: 180, color: "#5E60CE" },
];

const recentTransactions = [
  { 
    id: "tx1", 
    payee: "Grocery Store", 
    category: "shopping", 
    date: "Today, 11:23 AM", 
    amount: 64.53, 
    type: "expense" as const 
  },
  { 
    id: "tx2", 
    payee: "Coffee Shop", 
    category: "coffee", 
    date: "Yesterday, 9:15 AM", 
    amount: 5.25, 
    type: "expense" as const 
  },
  { 
    id: "tx3", 
    payee: "Monthly Salary", 
    category: "housing", 
    date: "May 1, 2023", 
    amount: 3500, 
    type: "income" as const 
  },
  { 
    id: "tx4", 
    payee: "Restaurant", 
    category: "dining", 
    date: "Apr 28, 2023", 
    amount: 42.80, 
    type: "expense" as const 
  },
];

const financialTip = {
  tip: "Consider setting up automatic transfers to your savings account on payday to build savings without having to think about it.",
  category: "Saving Strategies"
};

const Dashboard = () => {
  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Row */}
        <div className="lg:col-span-2">
          <BalanceCard currentBalance={8750.55} percentageChange={5.2} />
        </div>
        <div>
          <FinancialTipCard tip={financialTip.tip} category={financialTip.category} />
        </div>
        
        {/* Middle Row */}
        <div className="lg:col-span-2">
          <BudgetOverviewCard categories={budgetCategories} />
        </div>
        <div>
          <ExpenseBreakdownCard data={expenseData} />
        </div>
        
        {/* Bottom Row */}
        <div className="lg:col-span-3">
          <RecentTransactionsCard transactions={recentTransactions} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
