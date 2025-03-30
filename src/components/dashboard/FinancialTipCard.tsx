import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Lightbulb, RefreshCw } from "lucide-react"; 
import { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios'; 

// Placeholder interfaces - replace with actual types if available
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface FinancialTipCardProps {
  userGoals: Goal[];
  userTransactions: Transaction[];
  userBalance: number;
}

export function FinancialTipCard({ 
  userGoals, 
  userTransactions, 
  userBalance 
}: FinancialTipCardProps) {
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiCategory, setAiCategory] = useState<string | null>(null);

  const fetchGeminiAITip = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching AI tip with data:", { userGoals, userTransactions, userBalance });
      // --- Detailed Logging --- 
      console.log("fetchGeminiAITip: Preparing to send data:");
      console.log("- userGoals:", userGoals, "(Type:", typeof userGoals, "IsArray:", Array.isArray(userGoals), ")");
      console.log("- userTransactions:", userTransactions, "(Type:", typeof userTransactions, "IsArray:", Array.isArray(userTransactions), ")");
      console.log("- userBalance:", userBalance, "(Type:", typeof userBalance, ")");
      // --- End Detailed Logging ---
      // Use the full URL of the separate API server
      const response = await axios.post('http://localhost:3001/api/gemini-ai/getTip', {
        goals: userGoals,
        transactions: userTransactions,
        balance: userBalance
      });
      console.log("AI Tip response:", response.data);
      if (response.data.tip && response.data.category) {
        setAiTip(response.data.tip);
        setAiCategory(response.data.category);
      } else {
        setError('Received invalid data from AI tip endpoint.');
        setAiTip(null); 
        setAiCategory(null);
      }
    } catch (err) {
      console.error("Failed to fetch AI tip:", err);
      setError('Failed to fetch AI tip. Please try again later.');
      setAiTip(null); 
      setAiCategory(null);
    } finally {
      setIsLoading(false);
    }
  }, [userGoals, userTransactions, userBalance]); 

  // Fetch the tip once when the component mounts
  useEffect(() => {
    console.log("FinancialTipCard: Mount effect triggered.");
    fetchGeminiAITip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Card className="border-none bg-gradient-to-br from-indigo-400/20 to-purple-400/20 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Lightbulb className="h-5 w-5 text-indigo-500 mr-2" />
          Daily Financial Tip
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchGeminiAITip} 
          disabled={isLoading}
          aria-label="Refresh Tip"
        >
          <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error}</p>
        ) : (
          <>
            <p className="text-muted-foreground text-xs mb-1 font-medium uppercase tracking-wider">{aiCategory}</p>
            <p className="text-sm">{aiTip}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
