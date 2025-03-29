
import { PageLayout } from "@/components/layout/PageLayout";

const Insights = () => {
  return (
    <PageLayout title="Insights">
      <div className="animate-fade-in">
        <div className="budget-card">
          <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
          <p className="text-muted-foreground">
            This page will provide personalized financial insights and recommendations.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Insights;
