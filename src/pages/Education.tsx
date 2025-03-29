
import { PageLayout } from "@/components/layout/PageLayout";

const Education = () => {
  return (
    <PageLayout title="Education">
      <div className="animate-fade-in">
        <div className="budget-card">
          <h2 className="text-xl font-semibold mb-4">Financial Education</h2>
          <p className="text-muted-foreground">
            This page will provide educational content to improve your financial literacy.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Education;
