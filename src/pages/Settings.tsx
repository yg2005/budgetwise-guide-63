
import { PageLayout } from "@/components/layout/PageLayout";

const Settings = () => {
  return (
    <PageLayout title="Settings">
      <div className="animate-fade-in">
        <div className="budget-card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-muted-foreground">
            This page will allow you to manage your account preferences and settings.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
