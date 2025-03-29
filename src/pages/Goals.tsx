
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, ArrowRight, Target, Trash2, Edit, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Goal {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
}

const Goals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "",
    deadline: ""
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error("Error fetching goals:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      goal_name: "",
      target_amount: "",
      current_amount: "",
      deadline: ""
    });
    setCurrentGoal(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const targetAmount = parseFloat(formData.target_amount);
      const currentAmount = formData.current_amount ? parseFloat(formData.current_amount) : 0;
      
      if (isNaN(targetAmount) || targetAmount <= 0) {
        throw new Error("Please enter a valid target amount");
      }

      if (isNaN(currentAmount) || currentAmount < 0) {
        throw new Error("Please enter a valid current amount");
      }

      const goalData = {
        user_id: user?.id,
        goal_name: formData.goal_name,
        target_amount: targetAmount,
        current_amount: currentAmount,
        deadline: formData.deadline || null
      };

      let error;
      
      if (currentGoal) {
        // Update existing goal
        const { error: updateError } = await supabase
          .from("goals")
          .update(goalData)
          .eq("id", currentGoal.id);
        error = updateError;
        
        if (!updateError) {
          toast({
            title: "Goal updated",
            description: "Your goal has been updated successfully.",
          });
        }
      } else {
        // Create new goal
        const { error: insertError } = await supabase
          .from("goals")
          .insert(goalData);
        error = insertError;
        
        if (!insertError) {
          toast({
            title: "Goal created",
            description: "Your new goal has been created successfully.",
          });
        }
      }

      if (error) throw error;
      
      setIsGoalModalOpen(false);
      resetFormData();
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentGoal) throw new Error("No goal selected");
      
      const amount = parseFloat(contributionAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const newTotal = currentGoal.current_amount + amount;
      const { error } = await supabase
        .from("goals")
        .update({ current_amount: newTotal })
        .eq("id", currentGoal.id);

      if (error) throw error;
      
      toast({
        title: "Contribution added",
        description: `$${amount.toFixed(2)} has been added to your ${currentGoal.goal_name} goal.`,
      });
      
      setIsContributionModalOpen(false);
      setContributionAmount("");
      setCurrentGoal(null);
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (goal: Goal) => {
    setCurrentGoal(goal);
    setFormData({
      goal_name: goal.goal_name,
      target_amount: String(goal.target_amount),
      current_amount: String(goal.current_amount),
      deadline: goal.deadline || ""
    });
    setIsGoalModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Goal deleted",
        description: "The goal has been deleted successfully.",
      });
      
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleContribution = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsContributionModalOpen(true);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "from-red-500 to-red-400";
    if (progress < 70) return "from-yellow-500 to-yellow-400";
    return "from-green-500 to-green-400";
  };

  return (
    <PageLayout title="Goals">
      <div className="animate-fade-in space-y-6">
        {/* Header with Add Goal button */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Track your progress toward financial milestones.</p>
          <Button className="flex items-center gap-1" onClick={() => { resetFormData(); setIsGoalModalOpen(true); }}>
            <Plus size={16} /> Create New Goal
          </Button>
        </div>
        
        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="col-span-full text-center py-8">
              You haven't set any goals yet. Click "Create New Goal" to get started!
            </div>
          ) : (
            goals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
              const colorClass = getProgressColor(progress);
              
              return (
                <Card key={goal.id} className="budget-card overflow-hidden hover:shadow-md transition-all cursor-pointer">
                  {/* Progress indicator bar at top of card */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${colorClass}`} style={{ width: `${progress}%` }}></div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between">
                      <span>{goal.goal_name}</span>
                      <span className="text-sm font-normal flex items-center gap-1">
                        {goal.deadline && (
                          <>
                            <Calendar size={14} className="text-muted-foreground" /> 
                            {goal.deadline}
                          </>
                        )}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Amount progress */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <Progress value={progress} className="h-2" />
                    
                    {/* Percentage and details button */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{progress}%</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs" onClick={() => handleContribution(goal)}>
                          <PlusCircle size={12} /> Add Funds
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs" onClick={() => handleEdit(goal)}>
                          <Edit size={12} /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs" onClick={() => handleDelete(goal.id)}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
          
          {/* Add goal card */}
          <Card 
            className="budget-card border-dashed border-2 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-accent/30 transition-colors"
            onClick={() => { resetFormData(); setIsGoalModalOpen(true); }}
          >
            <div className="rounded-full bg-muted p-3 mb-3">
              <Plus size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Add New Goal</h3>
            <p className="text-sm text-muted-foreground">Create a financial goal to track your progress</p>
          </Card>
        </div>
        
        {/* Tips section */}
        <Card className="budget-card mt-8">
          <CardHeader className="pb-2">
            <CardTitle>Tips For Achieving Your Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">1</div>
              <div>
                <h4 className="font-medium">Set realistic targets</h4>
                <p className="text-sm text-muted-foreground">Break down large goals into smaller milestones that are easier to achieve.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">2</div>
              <div>
                <h4 className="font-medium">Automate your savings</h4>
                <p className="text-sm text-muted-foreground">Set up automatic transfers to your goal accounts on payday.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">3</div>
              <div>
                <h4 className="font-medium">Review and adjust</h4>
                <p className="text-sm text-muted-foreground">Regularly check your progress and adjust your contributions if needed.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Modal */}
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitGoal}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal_name">Goal Name</Label>
                <Input
                  id="goal_name"
                  name="goal_name"
                  value={formData.goal_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Emergency Fund, New Car"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="target_amount">Target Amount ($)</Label>
                <Input
                  id="target_amount"
                  name="target_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="current_amount">Current Amount ($)</Label>
                <Input
                  id="current_amount"
                  name="current_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.current_amount}
                  onChange={handleInputChange}
                  placeholder="0.00 (optional)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline">Target Date (Optional)</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsGoalModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contribution Modal */}
      <Dialog open={isContributionModalOpen} onOpenChange={setIsContributionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contribution to {currentGoal?.goal_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitContribution}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="contribution_amount">Amount ($)</Label>
                <Input
                  id="contribution_amount"
                  name="contribution_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsContributionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Contribution
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Goals;
