
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Info } from "lucide-react";

const Insights = () => {
  return (
    <PageLayout title="Insights">
      <div className="animate-fade-in space-y-6">
        {/* Brief Description */}
        <p className="text-muted-foreground">Stay up to date with economic trends and personalized tips.</p>
        
        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="overflow-hidden border-none shadow-sm">
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-red-800 dark:text-red-300">Egg Prices</h3>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-red-700 dark:text-red-400 mr-1" />
                    <p className="font-bold text-lg text-red-700 dark:text-red-400">+10%</p>
                  </div>
                  <p className="text-xs text-red-700/70 dark:text-red-400/70">Since last month</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full dark:bg-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">Interest Rates</h3>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-700 dark:text-blue-400 mr-1" />
                    <p className="font-bold text-lg text-blue-700 dark:text-blue-400">+0.5%</p>
                  </div>
                  <p className="text-xs text-blue-700/70 dark:text-blue-400/70">Federal Reserve update</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-800">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-sm">
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-green-800 dark:text-green-300">Gas Prices</h3>
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-green-700 dark:text-green-400 mr-1" />
                    <p className="font-bold text-lg text-green-700 dark:text-green-400">-2.3%</p>
                  </div>
                  <p className="text-xs text-green-700/70 dark:text-green-400/70">National average</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full dark:bg-green-800">
                  <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-sm">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300">Inflation</h3>
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-purple-700 dark:text-purple-400 mr-1" />
                    <p className="font-bold text-lg text-purple-700 dark:text-purple-400">3.1%</p>
                  </div>
                  <p className="text-xs text-purple-700/70 dark:text-purple-400/70">Annual rate</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-800">
                  <Info className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Personalized Tip Card */}
        <Card className="budget-card border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">Personalized Insights</CardTitle>
            <CardDescription>Based on your spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Grocery spending:</span> You've spent 15% more on groceries this month. With rising egg prices, consider alternatives or bulk purchases.</p>
            <Button variant="link" className="p-0">See detailed analysis</Button>
          </CardContent>
        </Card>
        
        {/* Detailed Insights Articles */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Economic Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="budget-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Housing Market Trends</CardTitle>
                <CardDescription>Updated 3 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground mb-2">The housing market has shown signs of cooling as mortgage rates continue to impact affordability for potential buyers.</p>
                <Button variant="outline" size="sm">Read more</Button>
              </CardContent>
            </Card>
            
            <Card className="budget-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Retirement Planning</CardTitle>
                <CardDescription>Updated 5 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground mb-2">New changes to 401(k) contribution limits may affect your long-term retirement strategy and planning.</p>
                <Button variant="outline" size="sm">Read more</Button>
              </CardContent>
            </Card>
            
            <Card className="budget-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Analysis</CardTitle>
                <CardDescription>Updated today</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground mb-2">Recent volatility in tech stocks presents both challenges and opportunities for investors looking at long-term growth.</p>
                <Button variant="outline" size="sm">Read more</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Insights;
