
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TransactionInputProps {
  onTransactionAdded: () => void;
}

interface TransactionFormValues {
  date: string;
  merchant: string;
  category: string;
  amount: string;
  description?: string;
}

// Transaction categories
const categories = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Personal",
  "Income",
  "Other"
];

export function TransactionInputCard({ onTransactionAdded }: TransactionInputProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TransactionFormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Today's date
      merchant: "",
      category: "",
      amount: "",
      description: ""
    }
  });

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Format amount - negative for expenses, positive for income
      const amount = data.category === "Income" 
        ? Math.abs(parseFloat(data.amount)) 
        : -Math.abs(parseFloat(data.amount));
      
      const transaction = {
        user_id: user?.id,
        date: data.date,
        merchant: data.merchant,
        category: data.category,
        amount: amount,
        description: data.description || null
      };
      
      const { error } = await supabase
        .from('transactions')
        .insert(transaction);
      
      if (error) throw error;
      
      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully recorded.",
      });
      
      // Reset form
      form.reset({
        date: new Date().toISOString().split('T')[0],
        merchant: "",
        category: "",
        amount: "",
        description: ""
      });
      
      // Update dashboard data
      onTransactionAdded();
      
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4 items-end">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="merchant"
              rules={{ required: "Merchant name is required" }}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Merchant</FormLabel>
                  <FormControl>
                    <Input placeholder="Merchant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              rules={{ 
                required: "Amount is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Invalid amount format"
                }
              }}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
