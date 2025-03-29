
import { PageLayout } from "@/components/layout/PageLayout";

const Goals = () => {
  return (
    <PageLayout title="Goals">
      <div className="animate-fade-in">
        <div className="budget-card">
          <h2 className="text-xl font-semibold mb-4">Financial Goals</h2>
          <p className="text-muted-foreground">
            This page will help you set and track your financial goals.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Goals;
