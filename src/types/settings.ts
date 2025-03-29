
export interface NotificationPreferences {
  dailyTips: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  monthlyReports: boolean;
  [key: string]: boolean; // Adding index signature to make it assignable to Json
}
