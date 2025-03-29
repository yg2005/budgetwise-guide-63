
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, PlayCircle, Award, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

// Mock lesson data
const lessons = [
  {
    id: 1,
    title: "Budgeting 101",
    description: "Learn the fundamentals of creating and sticking to a budget.",
    duration: "10 min",
    level: "Beginner",
    icon: "BookOpen",
    progress: 100,
    color: "bg-green-100"
  },
  {
    id: 2,
    title: "Understanding Credit Scores",
    description: "How credit scores work and ways to improve yours.",
    duration: "15 min",
    level: "Intermediate",
    icon: "CreditCard",
    progress: 60,
    color: "bg-blue-100"
  },
  {
    id: 3,
    title: "Investment Basics",
    description: "An introduction to investing for your future.",
    duration: "20 min",
    level: "Intermediate",
    icon: "TrendingUp",
    progress: 0,
    color: "bg-purple-100"
  },
  {
    id: 4,
    title: "Understanding APR",
    description: "What APR means for your loans and credit cards.",
    duration: "8 min",
    level: "Beginner",
    icon: "Percent",
    progress: 0,
    color: "bg-orange-100"
  },
  {
    id: 5,
    title: "Retirement Planning",
    description: "Planning for a comfortable retirement.",
    duration: "25 min",
    level: "Advanced",
    icon: "Home",
    progress: 0,
    color: "bg-pink-100"
  }
];

const Education = () => {
  return (
    <PageLayout title="Education">
      <div className="animate-fade-in space-y-8">
        <p className="text-muted-foreground">Learn the basics of budgeting and beyond.</p>
        
        {/* Learning Progress */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
            <CardDescription>Continue building your financial knowledge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Course Progress</p>
                <p className="text-xl font-semibold">20%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-xl font-semibold">3 Days 🔥</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-xl font-semibold">2</p>
              </div>
            </div>
            <Progress value={20} />
            <Button variant="outline" className="w-full">View Learning Path</Button>
          </CardContent>
        </Card>
        
        {/* Daily Quiz */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Daily Quiz</h2>
          <Card className="budget-card">
            <CardHeader>
              <CardTitle className="text-lg">Which of the following is the best definition of APR?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="option1" />
                  <label htmlFor="option1" className="text-sm cursor-pointer">
                    The total amount of interest paid over the life of a loan
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="option2" />
                  <label htmlFor="option2" className="text-sm cursor-pointer">
                    The annual interest rate of a loan, including fees and costs
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="option3" />
                  <label htmlFor="option3" className="text-sm cursor-pointer">
                    The monthly payment required for a loan
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="option4" />
                  <label htmlFor="option4" className="text-sm cursor-pointer">
                    The amount of time needed to pay off a loan
                  </label>
                </div>
              </div>
              <Button>Check Answer</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Lesson Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Financial Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <Card 
                key={lesson.id} 
                className={`budget-card hover:shadow-md transition-all cursor-pointer ${lesson.progress === 100 ? 'border-l-4 border-l-green-500' : ''}`}
              >
                <div className="flex items-start p-6">
                  <div className={`flex-shrink-0 rounded-lg p-2 mr-4 ${lesson.color}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{lesson.title}</h3>
                      {lesson.progress === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{lesson.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" /> {lesson.duration}
                      </div>
                      <div className="text-xs font-medium">{lesson.level}</div>
                    </div>
                    {lesson.progress > 0 && lesson.progress < 100 && (
                      <div className="mt-2">
                        <Progress value={lesson.progress} className="h-1" />
                      </div>
                    )}
                    <Button variant={lesson.progress > 0 && lesson.progress < 100 ? "outline" : "default"} size="sm" className="w-full mt-3">
                      {lesson.progress === 0 ? (
                        <> 
                          <PlayCircle className="mr-1 h-4 w-4" /> Start Lesson
                        </>
                      ) : lesson.progress === 100 ? (
                        <>
                          <Award className="mr-1 h-4 w-4" /> Review Lesson
                        </>
                      ) : (
                        <>
                          <Clock className="mr-1 h-4 w-4" /> Continue
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Learning Path */}
        <Button variant="outline" className="flex gap-1 items-center mx-auto mt-2">
          View All Lessons <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </PageLayout>
  );
};

export default Education;
