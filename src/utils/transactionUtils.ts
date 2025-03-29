
interface Transaction {
  id: string;
  amount: number;
  category: string;
  [key: string]: any; // For other transaction properties
}

interface CategoryGroup {
  category: string;
  total: number;
  transactions: Transaction[];
}

export function calculateTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += Math.abs(transaction.amount);
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );
}

export function groupTransactionsByCategory(transactions: Transaction[]): CategoryGroup[] {
  // Filter to only include expenses (negative amounts)
  const expenses = transactions.filter(t => t.amount < 0);
  
  // Group by category
  const categoryMap = new Map<string, CategoryGroup>();
  
  expenses.forEach(transaction => {
    const category = transaction.category;
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        category,
        total: 0,
        transactions: []
      });
    }
    
    const group = categoryMap.get(category)!;
    group.total += transaction.amount; // Sum amounts (will be negative)
    group.transactions.push(transaction);
  });
  
  // Convert map to array and sort by total amount
  return Array.from(categoryMap.values())
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
}
