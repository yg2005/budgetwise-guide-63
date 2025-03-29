
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Bell, 
  Moon, 
  Lock, 
  Shield, 
  CreditCard, 
  RefreshCcw, 
  Check 
} from "lucide-react";

const Settings = () => {
  return (
    <PageLayout title="Settings">
      <div className="animate-fade-in space-y-8">
        <p className="text-muted-foreground">Manage your account preferences and settings.</p>
        
        {/* Profile Section */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Profile Information
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input id="name" defaultValue="Jane Smith" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input id="email" type="email" defaultValue="jane.smith@example.com" />
                  </div>
                </div>
                <Button className="mt-2">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Preferences */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notification Preferences
            </CardTitle>
            <CardDescription>Control when and how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Tips</p>
                  <p className="text-sm text-muted-foreground">Receive daily financial tips and insights</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Monthly Reports</p>
                  <p className="text-sm text-muted-foreground">Get a monthly summary of your financial activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Goal Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive reminders about your financial goals</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">Get alerts when you're close to exceeding budget limits</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Appearance */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" /> Appearance
            </CardTitle>
            <CardDescription>Customize how BudgetAI looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Security
            </CardTitle>
            <CardDescription>Manage your account's security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Two-Factor Authentication</p>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Active
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="border-t border-border pt-4">
              <Button variant="outline" className="flex items-center gap-1">
                <Lock className="h-4 w-4" /> Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Connected Accounts */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Connected Accounts
            </CardTitle>
            <CardDescription>Manage your linked financial accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Chase Banking</p>
                  <p className="text-sm text-muted-foreground">Connected on Mar 15, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Disconnect</Button>
            </div>
            <div className="border-t border-border pt-4">
              <Button className="flex items-center gap-1">
                <RefreshCcw className="h-4 w-4" /> Sync Now
              </Button>
              <Button variant="outline" className="ml-2">Connect New Account</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Actions */}
        <Card className="budget-card">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="outline">Download Your Data</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Settings;
