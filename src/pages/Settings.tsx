
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NotificationPreferences {
  dailyTips: boolean;
  goalReminders: boolean;
  monthlyReports: boolean;
  budgetAlerts: boolean;
}

interface UserSettings {
  notification_preferences: NotificationPreferences;
  appearance: string;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    notification_preferences: {
      dailyTips: true,
      goalReminders: true,
      monthlyReports: true,
      budgetAlerts: true,
    },
    appearance: "light",
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) setUsername(data.username || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        // Parse JSON data if needed
        const notificationPreferences = typeof data.notification_preferences === 'string' 
          ? JSON.parse(data.notification_preferences)
          : data.notification_preferences;
          
        setSettings({
          notification_preferences: {
            dailyTips: notificationPreferences.dailyTips ?? true,
            goalReminders: notificationPreferences.goalReminders ?? true,
            monthlyReports: notificationPreferences.monthlyReports ?? true,
            budgetAlerts: notificationPreferences.budgetAlerts ?? true,
          },
          appearance: data.appearance,
        });
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

  const updateUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ username })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          notification_preferences: settings.notification_preferences,
          appearance: settings.appearance,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value,
      },
    }));
  };

  const handleAppearanceChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      appearance: value,
    }));
  };

  return (
    <PageLayout title="Settings">
      <div className="animate-fade-in space-y-6 pb-16">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback>{username ? username.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{username || "Update your username"}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>

                <Button 
                  onClick={updateUserProfile}
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dailyTips">Daily Financial Tips</Label>
                    <Switch
                      id="dailyTips"
                      checked={settings.notification_preferences.dailyTips}
                      onCheckedChange={(checked) => handleNotificationChange("dailyTips", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="goalReminders">Goal Reminders</Label>
                    <Switch
                      id="goalReminders"
                      checked={settings.notification_preferences.goalReminders}
                      onCheckedChange={(checked) => handleNotificationChange("goalReminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthlyReports">Monthly Reports</Label>
                    <Switch
                      id="monthlyReports"
                      checked={settings.notification_preferences.monthlyReports}
                      onCheckedChange={(checked) => handleNotificationChange("monthlyReports", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budgetAlerts">Budget Alerts</Label>
                    <Switch
                      id="budgetAlerts"
                      checked={settings.notification_preferences.budgetAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("budgetAlerts", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Appearance</Label>
                    <div className="flex gap-4">
                      <div
                        className={`border rounded-md p-3 cursor-pointer flex items-center gap-2 ${
                          settings.appearance === "light"
                            ? "border-primary bg-primary/10"
                            : ""
                        }`}
                        onClick={() => handleAppearanceChange("light")}
                      >
                        <div className="h-4 w-4 rounded-full bg-primary" />
                        <span>Light</span>
                      </div>
                      <div
                        className={`border rounded-md p-3 cursor-pointer flex items-center gap-2 ${
                          settings.appearance === "dark"
                            ? "border-primary bg-primary/10"
                            : ""
                        }`}
                        onClick={() => handleAppearanceChange("dark")}
                      >
                        <div className="h-4 w-4 rounded-full bg-gray-800" />
                        <span>Dark</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={updateUserSettings}
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Settings;
