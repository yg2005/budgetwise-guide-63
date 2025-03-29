
import { PageLayout } from "@/components/layout/PageLayout";

const Transactions = () => {
  return (
    <PageLayout title="Transactions">
      <div className="animate-fade-in">
        <div className="budget-card">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground">
            This page will display a comprehensive list of your financial transactions.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Transactions;
