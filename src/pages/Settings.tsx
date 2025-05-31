import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Save, User, Building, Bell, Shield, Globe } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  
  // Company settings
  const [companySettings, setCompanySettings] = useState({
    name: "Core Crew Connect",
    email: "info@corecrew.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Suite 100, San Francisco, CA 94107",
    website: "https://corecrew.com",
    logo: "/placeholder.svg"
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    leaveApprovals: true,
    newEmployees: true,
    performanceReviews: true,
    dailyReports: false
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    sessionTimeout: "30",
    loginAttempts: "5"
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC-8",
    theme: "light"
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCompanySettings(prev => ({ ...prev, [id]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSecuritySettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSystemChange = (key: string, value: string) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings saved",
      description: "Your changes have been successfully saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure system preferences</p>
        </div>
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden md:inline">System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                  <img 
                    src={companySettings.logo} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full"
                  />
                </div>
                <Button variant="outline">Change Logo</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    value={companySettings.name} 
                    onChange={handleCompanyChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={companySettings.email} 
                    onChange={handleCompanyChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={companySettings.phone} 
                    onChange={handleCompanyChange}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={companySettings.website} 
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    value={companySettings.address} 
                    onChange={handleCompanyChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Leave Approvals</p>
                    <p className="text-sm text-gray-500">Get notified when leave requests need approval</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.leaveApprovals}
                    onCheckedChange={(checked) => handleNotificationChange('leaveApprovals', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Employees</p>
                    <p className="text-sm text-gray-500">Get notified when new employees are added</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.newEmployees}
                    onCheckedChange={(checked) => handleNotificationChange('newEmployees', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Performance Reviews</p>
                    <p className="text-sm text-gray-500">Get notified about upcoming performance reviews</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.performanceReviews}
                    onCheckedChange={(checked) => handleNotificationChange('performanceReviews', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Reports</p>
                    <p className="text-sm text-gray-500">Receive daily summary reports</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => handleNotificationChange('dailyReports', checked)}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input 
                    id="passwordExpiry" 
                    type="number" 
                    value={securitySettings.passwordExpiry} 
                    onChange={handleSecurityChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number" 
                    value={securitySettings.sessionTimeout} 
                    onChange={handleSecurityChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input 
                    id="loginAttempts" 
                    type="number" 
                    value={securitySettings.loginAttempts} 
                    onChange={handleSecurityChange}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">System Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Language</Label>
                  <Select 
                    value={systemSettings.language} 
                    onValueChange={(value) => handleSystemChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Date Format</Label>
                  <Select 
                    value={systemSettings.dateFormat} 
                    onValueChange={(value) => handleSystemChange('dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Timezone</Label>
                  <Select 
                    value={systemSettings.timezone} 
                    onValueChange={(value) => handleSystemChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Theme</Label>
                  <Select 
                    value={systemSettings.theme} 
                    onValueChange={(value) => handleSystemChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;