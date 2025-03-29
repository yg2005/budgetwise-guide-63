
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface FinancialTipCardProps {
  tip: string;
  category: string;
}

export function FinancialTipCard({ tip, category }: FinancialTipCardProps) {
  return (
    <Card className="bg-gradient-card border-t-4 border-t-budget-teal animate-fade-in card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 text-budget-teal mr-2" />
          <span>Daily Financial Tip</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs mb-2">{category}</p>
        <p>{tip}</p>
      </CardContent>
    </Card>
  );
}
