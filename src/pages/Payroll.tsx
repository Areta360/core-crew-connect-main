import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, Filter, Plus, Search } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';

export const Payroll = () => {
  const { employees } = useEmployees();
  const [month, setMonth] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock payroll data based on employees
  const payrollData = employees.map(employee => ({
    id: employee.id,
    name: employee.name,
    position: employee.position,
    department: employee.department,
    baseSalary: employee.salary || Math.floor(Math.random() * 50000) + 50000,
    bonus: Math.floor(Math.random() * 5000),
    deductions: Math.floor(Math.random() * 2000) + 1000,
    netPay: 0,
    status: Math.random() > 0.2 ? "Paid" : "Pending"
  })).map(item => ({
    ...item,
    netPay: item.baseSalary + item.bonus - item.deductions
  }));

  const filteredPayroll = payrollData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const totalPayroll = filteredPayroll.reduce((sum, item) => sum + item.netPay, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600">Manage employee compensation and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">${totalPayroll.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Payroll</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{filteredPayroll.filter(p => p.status === "Paid").length}</p>
              <p className="text-sm text-gray-600">Payments Processed</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{filteredPayroll.filter(p => p.status === "Pending").length}</p>
              <p className="text-sm text-gray-600">Pending Payments</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="previous">Previous Month</SelectItem>
              <SelectItem value="jan">January 2024</SelectItem>
              <SelectItem value="feb">February 2024</SelectItem>
              <SelectItem value="mar">March 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayroll.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.position}</p>
                  </div>
                </TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>${item.baseSalary.toLocaleString()}</TableCell>
                <TableCell>${item.bonus.toLocaleString()}</TableCell>
                <TableCell>${item.deductions.toLocaleString()}</TableCell>
                <TableCell className="font-medium">${item.netPay.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Payroll;