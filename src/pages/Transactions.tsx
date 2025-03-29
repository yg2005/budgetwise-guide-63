
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  description?: string;
}

const categories = [
  { value: "Food", color: "bg-green-100 text-green-800" },
  { value: "Transportation", color: "bg-orange-100 text-orange-800" },
  { value: "Housing", color: "bg-blue-100 text-blue-800" },
  { value: "Utilities", color: "bg-purple-100 text-purple-800" },
  { value: "Entertainment", color: "bg-pink-100 text-pink-800" },
  { value: "Shopping", color: "bg-yellow-100 text-yellow-800" },
  { value: "Income", color: "bg-emerald-100 text-emerald-800" },
  { value: "Other", color: "bg-gray-100 text-gray-800" }
];

const getCategoryColor = (category: string): string => {
  const found = categories.find(c => c.value === category);
  return found ? found.color : "bg-gray-100 text-gray-800";
};

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  
  const [formData, setFormData] = useState({
    merchant: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "Food",
    amount: ""
  });

  const resetFormData = () => {
    setFormData({
      merchant: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      category: "Food",
      amount: ""
    });
    setCurrentTransaction(null);
  };

  // Fetch transactions
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error("Error fetching transactions:", error.message);
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const amountValue = parseFloat(formData.amount);
      
      if (isNaN(amountValue)) {
        throw new Error("Please enter a valid amount");
      }

      const transactionData = {
        user_id: user?.id,
        date: formData.date,
        merchant: formData.merchant,
        description: formData.description,
        category: formData.category,
        amount: formData.category === "Income" ? Math.abs(amountValue) : -Math.abs(amountValue)
      };

      let error;
      
      if (currentTransaction) {
        // Update existing transaction
        const { error: updateError } = await supabase
          .from("transactions")
          .update(transactionData)
          .eq("id", currentTransaction.id);
        error = updateError;
        
        if (!updateError) {
          toast({
            title: "Transaction updated",
            description: "The transaction has been updated successfully.",
          });
        }
      } else {
        // Create new transaction
        const { error: insertError } = await supabase
          .from("transactions")
          .insert(transactionData);
        error = insertError;
        
        if (!insertError) {
          toast({
            title: "Transaction added",
            description: "The transaction has been added successfully.",
          });
        }
      }

      if (error) throw error;
      
      setIsModalOpen(false);
      resetFormData();
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setFormData({
      merchant: transaction.merchant,
      date: transaction.date,
      description: transaction.description || "",
      category: transaction.category,
      amount: String(Math.abs(transaction.amount))
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Transaction deleted",
        description: "The transaction has been deleted successfully.",
      });
      
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Error deleting transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredTransactions = searchTerm 
    ? transactions.filter(tx => 
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : transactions;

  // Calculate summaries
  const totalExpenses = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalIncome = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

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
              <p className="stat-value text-destructive">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="budget-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-value text-primary">${totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="budget-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-value">{transactions.length}</p>
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
          <div className="flex gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-8 w-full"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetFormData()}>
                  <Plus size={16} className="mr-1" /> Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{currentTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
                  <DialogDescription>
                    Enter the transaction details below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="merchant" className="text-right">
                        Merchant
                      </Label>
                      <Input
                        id="merchant"
                        name="merchant"
                        value={formData.merchant}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange(value, "category")}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {currentTransaction ? "Update" : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Transaction List */}
        <Card className="budget-card">
          <div className="rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-10 text-center">Loading transactions...</div>
              ) : filteredTransactions.length === 0 ? (
                <div className="py-10 text-center">
                  {searchTerm ? "No matching transactions found" : "No transactions yet. Add your first transaction!"}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Merchant</th>
                      <th className="px-4 py-3 text-left font-medium">Category</th>
                      <th className="px-4 py-3 text-right font-medium">Amount</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr 
                        key={transaction.id} 
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">{transaction.date}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div>{transaction.merchant}</div>
                            {transaction.description && (
                              <div className="text-xs text-muted-foreground">{transaction.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                            {transaction.category}
                          </Badge>
                        </td>
                        <td className={`px-4 py-3 text-right ${transaction.amount < 0 ? 'text-destructive' : 'text-primary'}`}>
                          {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(transaction)}>
                              <Edit size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(transaction.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Transactions;
