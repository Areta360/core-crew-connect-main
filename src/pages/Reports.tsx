import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, BarChart, PieChart, LineChart, Users } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';

export const Reports = () => {
  const { employees } = useEmployees();
  const [reportType, setReportType] = useState("employee");
  const [timeRange, setTimeRange] = useState("month");

  // Mock data for charts
  const departmentDistribution = [
    { department: "Engineering", count: employees.filter(e => e.department === "Engineering").length || 5 },
    { department: "Marketing", count: employees.filter(e => e.department === "Marketing").length || 3 },
    { department: "Sales", count: employees.filter(e => e.department === "Sales").length || 4 },
    { department: "HR", count: employees.filter(e => e.department === "HR").length || 2 },
    { department: "Finance", count: employees.filter(e => e.department === "Finance").length || 2 }
  ];

  const statusDistribution = [
    { status: "Active", count: employees.filter(e => e.status === "Active").length || 12 },
    { status: "On Leave", count: employees.filter(e => e.status === "On Leave").length || 3 },
    { status: "Terminated", count: employees.filter(e => e.status === "Terminated").length || 1 }
  ];

  const mockReports = [
    { id: 1, name: "Employee Headcount", type: "employee", format: "PDF", lastGenerated: "2024-01-15" },
    { id: 2, name: "Department Distribution", type: "employee", format: "Excel", lastGenerated: "2024-01-10" },
    { id: 3, name: "Leave Analysis", type: "leave", format: "PDF", lastGenerated: "2024-01-05" },
    { id: 4, name: "Payroll Summary", type: "payroll", format: "Excel", lastGenerated: "2024-01-01" },
    { id: 5, name: "Performance Overview", type: "performance", format: "PDF", lastGenerated: "2023-12-20" }
  ];

  const filteredReports = mockReports.filter(report => 
    reportType === "all" || report.type === reportType
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate insights from HR data</p>
        </div>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{mockReports.length}</p>
              <p className="text-sm text-gray-600">Available Reports</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <BarChart className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{departmentDistribution.length}</p>
              <p className="text-sm text-gray-600">Departments</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col space-y-2 w-full">
                  {departmentDistribution.map((dept) => (
                    <div key={dept.department} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{dept.department}</span>
                        <span>{dept.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(dept.count / employees.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Employee Status</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="flex justify-around w-full">
                  {statusDistribution.map((status) => (
                    <div key={status.status} className="text-center">
                      <div className="w-24 h-24 mx-auto mb-2 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `conic-gradient(${
                            status.status === "Active" ? "#22c55e" : 
                            status.status === "On Leave" ? "#eab308" : "#ef4444"
                          } ${(status.count / employees.length) * 360}deg, #e5e7eb 0)` 
                        }}
                      >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                          <span className="text-xl font-bold">{status.count}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{status.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <p className="text-sm text-gray-600">
                      Type: {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • 
                      Format: {report.format} • 
                      Last Generated: {report.lastGenerated}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;