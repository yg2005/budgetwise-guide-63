
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, ArrowRight } from "lucide-react";

// Mock goal data
const goals = [
  {
    id: 1,
    name: "Emergency Fund",
    currentAmount: 2000,
    targetAmount: 5000,
    progress: 40,
    deadline: "Dec 2023",
    color: "from-blue-500 to-blue-400"
  },
  {
    id: 2,
    name: "Vacation to Bali",
    currentAmount: 1200,
    targetAmount: 3500,
    progress: 34,
    deadline: "Jul 2024",
    color: "from-green-500 to-green-400"
  },
  {
    id: 3,
    name: "New Laptop",
    currentAmount: 800,
    targetAmount: 1500,
    progress: 53,
    deadline: "Sep 2023",
    color: "from-purple-500 to-purple-400"
  },
  {
    id: 4,
    name: "Home Down Payment",
    currentAmount: 15000,
    targetAmount: 60000,
    progress: 25,
    deadline: "Jan 2026",
    color: "from-teal-500 to-teal-400"
  }
];

const Goals = () => {
  return (
    <PageLayout title="Goals">
      <div className="animate-fade-in space-y-6">
        {/* Header with Add Goal button */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Track your progress toward financial milestones.</p>
          <Button className="flex items-center gap-1">
            <Plus size={16} /> Create New Goal
          </Button>
        </div>
        
        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="budget-card overflow-hidden hover:shadow-md transition-all cursor-pointer">
              {/* Progress indicator bar at top of card */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${goal.color}`} style={{ width: `${goal.progress}%` }}></div>
              
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span>{goal.name}</span>
                  <span className="text-sm font-normal flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" /> 
                    {goal.deadline}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Amount progress */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                
                {/* Progress bar */}
                <Progress value={goal.progress} className="h-2" />
                
                {/* Percentage and details button */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">{goal.progress}%</span>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                    Details <ArrowRight size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add goal card */}
          <Card className="budget-card border-dashed border-2 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-accent/30 transition-colors">
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
    </PageLayout>
  );
};

export default Goals;
