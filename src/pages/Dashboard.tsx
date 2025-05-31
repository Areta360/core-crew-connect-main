
import React from 'react';
import { Card } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, description }: {
  title: string;
  value: string;
  icon: any;
  description: string;
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-600" />
    </div>
  </Card>
);

export const Dashboard = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "245",
      icon: Users,
      description: "Active employees"
    },
    {
      title: "Pending Leaves",
      value: "12",
      icon: Calendar,
      description: "Awaiting approval"
    },
    {
      title: "Monthly Payroll",
      value: "$125,000",
      icon: DollarSign,
      description: "Current month"
    },
    {
      title: "Performance Reviews",
      value: "89%",
      icon: TrendingUp,
      description: "Completion rate"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your HR management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">John Doe applied for leave</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sarah Johnson completed performance review</span>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New employee onboarding started</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Team meeting - Marketing</span>
              <span className="text-xs text-gray-500">Tomorrow</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Performance review deadline</span>
              <span className="text-xs text-gray-500">Dec 15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Holiday - Christmas</span>
              <span className="text-xs text-gray-500">Dec 25</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
