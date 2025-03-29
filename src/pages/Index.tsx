
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { BudgetOverviewCard } from "@/components/dashboard/BudgetOverviewCard";
import { ExpenseBreakdownCard } from "@/components/dashboard/ExpenseBreakdownCard";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";
import { FinancialTipCard } from "@/components/dashboard/FinancialTipCard";
import { TransactionInputCard } from "@/components/dashboard/TransactionInputCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTotals, groupTransactionsByCategory } from "@/utils/transactionUtils";

// Financial tip data (static for now as mentioned in requirements)
const financialTip = {
  tip: "Consider setting up automatic transfers to your savings account on payday to build savings without having to think about it.",
  category: "Saving Strategies"
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState({
    currentBalance: 0,
    percentageChange: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(5);
      
      if (transactionsError) throw transactionsError;
      
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id);
      
      if (goalsError) throw goalsError;
      
      // Process and transform transaction data for charts and reports
      const { totalIncome, totalExpenses } = calculateTotals(transactionsData);
      const currentBalance = totalIncome - totalExpenses;
      
      // For percentage change, we would normally compare to previous period
      // For now, using a placeholder calculation
      const percentageChange = transactionsData.length > 0 ? 5.2 : 0;
      
      setTransactions(transactionsData);
      setGoals(goalsData);
      setBalanceData({
        currentBalance,
        percentageChange
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const setupRealtimeSubscriptions = () => {
    // Set up real-time subscriptions for transactions
    const transactionsChannel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          console.log('Transactions change received:', payload);
          fetchDashboardData(); // Refresh all data when transactions change
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          console.log('Goals change received:', payload);
          fetchDashboardData(); // Refresh all data when goals change
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(transactionsChannel);
    };
  };

  // Convert transactions to budget categories for the BudgetOverviewCard
  const budgetCategories = loading ? [] : groupTransactionsByCategory(transactions).map(category => ({
    name: category.category,
    spent: Math.abs(category.total), // Ensure positive value for display
    budgeted: Math.abs(category.total) * 1.1, // Placeholder for budget (10% more than spent)
    color: getBudgetCategoryColor(category.category),
  }));

  // Function to get consistent colors for categories
  function getBudgetCategoryColor(category) {
    const colorMap = {
      "Housing": "#4ECDC4",
      "Food": "#86CD82",
      "Transportation": "#FFD166",
      "Entertainment": "#FF6B6B",
      "Utilities": "#5E60CE",
      "Shopping": "#9A8C98",
      "Healthcare": "#7F96FF",
      "Education": "#F8961E",
      "Personal": "#C38D9E",
      "Other": "#293241",
    };
    
    return colorMap[category] || "#" + Math.floor(Math.random()*16777215).toString(16);
  }

  // Transform transactions for the expense breakdown chart
  const expenseData = loading ? [] : budgetCategories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color
  }));

  // Transform transactions for the RecentTransactionsCard
  const recentTransactions = loading ? [] : transactions.map(tx => ({
    id: tx.id,
    payee: tx.merchant,
    category: tx.category.toLowerCase(),
    date: new Date(tx.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    amount: tx.amount,
    type: tx.amount < 0 ? "expense" : "income"
  }));

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Row */}
        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <BalanceCard 
              currentBalance={balanceData.currentBalance} 
              percentageChange={balanceData.percentageChange} 
            />
          )}
        </div>
        <div>
          <FinancialTipCard tip={financialTip.tip} category={financialTip.category} />
        </div>
        
        {/* New Row: Transaction Input */}
        <div className="lg:col-span-3">
          <TransactionInputCard onTransactionAdded={fetchDashboardData} />
        </div>
        
        {/* Middle Row */}
        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <BudgetOverviewCard categories={budgetCategories} />
          )}
        </div>
        <div>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ExpenseBreakdownCard data={expenseData} />
          )}
        </div>
        
        {/* Bottom Row */}
        <div className="lg:col-span-3">
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <RecentTransactionsCard transactions={recentTransactions} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
