import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, PlayCircle, Award, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const lessonsData = [
  {
    id: "lesson_1",
    title: "Budgeting 101",
    description: "Learn the fundamentals of creating and sticking to a budget.",
    duration: "10 min",
    level: "Beginner",
    icon: "BookOpen",
    color: "bg-green-100"
  },
  {
    id: "lesson_2",
    title: "Understanding Credit Scores",
    description: "How credit scores work and ways to improve yours.",
    duration: "15 min",
    level: "Intermediate",
    icon: "CreditCard",
    color: "bg-blue-100"
  },
  {
    id: "lesson_3",
    title: "Investment Basics",
    description: "An introduction to investing for your future.",
    duration: "20 min",
    level: "Intermediate",
    icon: "TrendingUp",
    color: "bg-purple-100"
  },
  {
    id: "lesson_4",
    title: "Understanding APR",
    description: "What APR means for your loans and credit cards.",
    duration: "8 min",
    level: "Beginner",
    icon: "Percent",
    color: "bg-orange-100"
  },
  {
    id: "lesson_5",
    title: "Retirement Planning",
    description: "Planning for a comfortable retirement.",
    duration: "25 min",
    level: "Advanced",
    icon: "Home",
    color: "bg-pink-100"
  }
];

const dailyQuiz = {
  question: "Which of the following is the best definition of APR?",
  options: [
    "The total amount of interest paid over the life of a loan",
    "The annual interest rate of a loan, including fees and costs",
    "The monthly payment required for a loan",
    "The amount of time needed to pay off a loan"
  ],
  correctAnswer: 1
};

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  badge?: string;
}

const Education = () => {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<{[key: string]: boolean}>({});
  const [streakCount, setStreakCount] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEducationProgress();
    }
  }, [user]);

  const fetchEducationProgress = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("education_progress")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;

      const progress: {[key: string]: boolean} = {};
      let badges: string[] = [];
      let streak = 0;
      
      data?.forEach(item => {
        progress[item.lesson_id] = item.completed;
        if (item.badge && !badges.includes(item.badge)) {
          badges.push(item.badge);
        }
        streak = Math.max(streak, item.streak_count);
      });
      
      setLessonProgress(progress);
      setBadges(badges);
      setStreakCount(streak);
    } catch (error) {
      console.error("Error fetching education progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLessonProgress = async (lessonId: string, completed: boolean) => {
    try {
      const { data, error: checkError } = await supabase
        .from("education_progress")
        .select("id")
        .eq("user_id", user?.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (data) {
        const { error } = await supabase
          .from("education_progress")
          .update({
            completed,
            updated_at: new Date().toISOString()
          })
          .eq("id", data.id);

        if (error) throw error;
      } 
      else {
        const { error } = await supabase
          .from("education_progress")
          .insert({
            user_id: user?.id,
            lesson_id: lessonId,
            completed,
            streak_count: streakCount
          });

        if (error) throw error;
      }

      if (completed) {
        await checkForBadges();
      }

      setLessonProgress(prev => ({
        ...prev,
        [lessonId]: completed
      }));

      toast({
        title: completed ? "Lesson Completed" : "Progress Updated",
        description: completed ? "Great job! You've completed this lesson." : "Your progress has been updated."
      });
    } catch (error: any) {
      console.error("Error updating lesson progress:", error);
      toast({
        title: "Error",
        description: "Failed to update your progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuizSubmit = async () => {
    if (selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before checking.",
        variant: "destructive"
      });
      return;
    }

    const correct = selectedAnswer === dailyQuiz.correctAnswer;
    setIsAnswerCorrect(correct);
    setShowAnswerResult(true);

    try {
      const { data, error: checkError } = await supabase
        .from("education_progress")
        .select("id, streak_count, updated_at")
        .eq("user_id", user?.id)
        .eq("lesson_id", "daily_quiz")
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const today = new Date().toISOString().split('T')[0];
      let newStreakCount = 1;

      if (data) {
        const lastUpdateDate = new Date(data.updated_at).toISOString().split('T')[0];
        
        if (lastUpdateDate === today) {
          newStreakCount = data.streak_count;
        } else if (wasYesterday(new Date(data.updated_at))) {
          newStreakCount = data.streak_count + 1;
        }

        const { error } = await supabase
          .from("education_progress")
          .update({
            quiz_score: correct ? 100 : 0,
            streak_count: newStreakCount,
            updated_at: new Date().toISOString()
          })
          .eq("id", data.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("education_progress")
          .insert({
            user_id: user?.id,
            lesson_id: "daily_quiz",
            quiz_score: correct ? 100 : 0,
            streak_count: 1,
            completed: true
          });

        if (error) throw error;
      }

      setStreakCount(newStreakCount);
      
      if (newStreakCount >= 3 && !badges.includes("3_day_streak")) {
        await awardBadge("3_day_streak");
        setBadges(prev => [...prev, "3_day_streak"]);
        
        toast({
          title: "New Badge Earned!",
          description: "You've earned the 3-Day Streak badge!"
        });
      }
    } catch (error: any) {
      console.error("Error updating quiz progress:", error);
    }
  };

  const wasYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0] === date.toISOString().split('T')[0];
  };

  const checkForBadges = async () => {
    try {
      const completedLessons = Object.values(lessonProgress).filter(Boolean).length;
      
      if (completedLessons >= 1 && !badges.includes("first_lesson")) {
        await awardBadge("first_lesson");
        setBadges(prev => [...prev, "first_lesson"]);
        
        toast({
          title: "New Badge Earned!",
          description: "You've earned the First Lesson badge!"
        });
      }
      
      if (completedLessons >= 3 && !badges.includes("advanced_learner")) {
        await awardBadge("advanced_learner");
        setBadges(prev => [...prev, "advanced_learner"]);
        
        toast({
          title: "New Badge Earned!",
          description: "You've earned the Advanced Learner badge!"
        });
      }
    } catch (error) {
      console.error("Error checking for badges:", error);
    }
  };

  const awardBadge = async (badgeName: string) => {
    try {
      const { error } = await supabase
        .from("education_progress")
        .insert({
          user_id: user?.id,
          lesson_id: `badge_${badgeName}`,
          badge: badgeName,
          completed: true,
          streak_count: streakCount
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error awarding badge:", error);
    }
  };

  const totalLessons = lessonsData.length;
  const completedLessons = Object.values(lessonProgress).filter(Boolean).length;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100) || 0;

  return (
    <PageLayout title="Education">
      <div className="animate-fade-in space-y-8">
        <p className="text-muted-foreground">Learn the basics of budgeting and beyond.</p>
        
        <Card className="budget-card">
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
            <CardDescription>Continue building your financial knowledge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Course Progress</p>
                <p className="text-xl font-semibold">{overallProgress}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-xl font-semibold">{streakCount} Days {streakCount > 0 && "🔥"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-xl font-semibold">{badges.length}</p>
              </div>
            </div>
            <Progress value={overallProgress} />
            <Button variant="outline" className="w-full">View Learning Path</Button>
          </CardContent>
        </Card>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Daily Quiz</h2>
          <Card className="budget-card">
            <CardHeader>
              <CardTitle className="text-lg">{dailyQuiz.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                <div className="space-y-3">
                  {dailyQuiz.options.map((option, index) => (
                    <div key={index} className={`flex items-center space-x-2 rounded-md border p-3 ${
                      showAnswerResult && index === dailyQuiz.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : showAnswerResult && index === selectedAnswer && index !== dailyQuiz.correctAnswer
                        ? "bg-red-50 border-red-200"
                        : ""
                    }`}>
                      <RadioGroupItem value={index.toString()} id={`option${index}`} disabled={showAnswerResult} />
                      <Label htmlFor={`option${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                      {showAnswerResult && index === dailyQuiz.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              {showAnswerResult ? (
                <div className={`p-4 rounded-md ${isAnswerCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  <p className="font-medium">{isAnswerCorrect ? "Correct!" : "Not quite right."}</p>
                  <p className="text-sm mt-1">
                    {isAnswerCorrect
                      ? "Great job! You understand how APR works."
                      : `The correct answer is: ${dailyQuiz.options[dailyQuiz.correctAnswer]}`}
                  </p>
                </div>
              ) : (
                <Button onClick={handleQuizSubmit} disabled={selectedAnswer === null}>
                  Check Answer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Financial Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading lessons...</div>
            ) : (
              lessonsData.map((lesson) => {
                const isCompleted = lessonProgress[lesson.id] || false;
                
                return (
                  <Card 
                    key={lesson.id} 
                    className={`budget-card hover:shadow-md transition-all cursor-pointer ${isCompleted ? 'border-l-4 border-l-green-500' : ''}`}
                  >
                    <div className="flex items-start p-6">
                      <div className={`flex-shrink-0 rounded-lg p-2 mr-4 ${lesson.color}`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{lesson.title}</h3>
                          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{lesson.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" /> {lesson.duration}
                          </div>
                          <div className="text-xs font-medium">{lesson.level}</div>
                        </div>
                        
                        <Button 
                          variant={isCompleted ? "outline" : "default"} 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => updateLessonProgress(lesson.id, !isCompleted)}
                        >
                          {!isCompleted ? (
                            <> 
                              <PlayCircle className="mr-1 h-4 w-4" /> Start Lesson
                            </>
                          ) : (
                            <>
                              <Award className="mr-1 h-4 w-4" /> Completed
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
        
        <Button variant="outline" className="flex gap-1 items-center mx-auto mt-2">
          View All Lessons <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </PageLayout>
  );
};

export default Education;
