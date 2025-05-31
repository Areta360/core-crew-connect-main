
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from 'lucide-react';

const mockLeaveRequests = [
  {
    id: 1,
    employeeName: "John Doe",
    leaveType: "Annual Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    days: 3,
    status: "Pending",
    reason: "Family vacation"
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    leaveType: "Sick Leave",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    days: 3,
    status: "Approved",
    reason: "Medical treatment"
  }
];

export const Leave = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Manage employee leave requests and balances</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Leave Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-gray-600">Pending Requests</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-gray-600">Approved This Month</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-gray-600">Leave Balance Avg</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Leave Requests</h3>
        <div className="space-y-4">
          {mockLeaveRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-medium">{request.employeeName}</h4>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {request.leaveType} • {request.startDate} to {request.endDate} • {request.days} days
                </p>
                <p className="text-sm text-gray-500 mt-1">{request.reason}</p>
              </div>
              <div className="flex gap-2">
                {request.status === "Pending" && (
                  <>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
