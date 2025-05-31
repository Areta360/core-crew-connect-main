import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, Download, Filter, Plus, Search, 
  FileText, Calendar, CheckCircle, AlertCircle, 
  Edit, Trash2, Eye, ArrowUpDown
} from 'lucide-react';
import { usePayroll, PayrollItem } from '@/context/PayrollContext';
import { useEmployees } from '@/context/EmployeeContext';

export const Payroll = () => {
  const { payrollData, processPayroll, generatePayroll, updatePayrollItem, deletePayrollItem } = usePayroll();
  const { employees } = useEmployees();
  const [month, setMonth] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayrollIds, setSelectedPayrollIds] = useState<number[]>([]);
  const [showPayrollDialog, setShowPayrollDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null);
  const [activeTab, setActiveTab] = useState("current");
  const [sortConfig, setSortConfig] = useState<{key: keyof PayrollItem, direction: 'asc' | 'desc'}>({
    key: 'name',
    direction: 'asc'
  });

  // Filter payroll data based on search term and month
  const filteredPayroll = payrollData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by pay period/month
    const matchesMonth = 
      activeTab === "current" ? 
        item.payPeriod.includes(new Date().toLocaleString('default', { month: 'long' })) :
        activeTab === "previous" ?
          item.payPeriod.includes(new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long' })) :
          activeTab === "all" || item.payPeriod.toLowerCase().includes(activeTab.toLowerCase());
    
    return matchesSearch && matchesMonth;
  });

  // Sort payroll data
  const sortedPayroll = [...filteredPayroll].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof PayrollItem) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalPayroll = filteredPayroll.reduce((sum, item) => sum + item.netPay, 0);
  const pendingPayroll = filteredPayroll.filter(p => p.status === "Pending").reduce((sum, item) => sum + item.netPay, 0);

  const handleSelectPayroll = (id: number) => {
    setSelectedPayrollIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayrollIds(filteredPayroll.filter(p => p.status === "Pending").map(p => p.id));
    } else {
      setSelectedPayrollIds([]);
    }
  };

  const handleProcessPayroll = () => {
    processPayroll(selectedPayrollIds);
    setSelectedPayrollIds([]);
  };

  const handleGeneratePayroll = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    // For demo purposes, use the selected month or current month
    const monthToGenerate = month === "current" ? 
      monthNames[new Date().getMonth()] : 
      month === "previous" ? 
        monthNames[new Date().getMonth() > 0 ? new Date().getMonth() - 1 : 11] :
        month.charAt(0).toUpperCase() + month.slice(1);
    
    generatePayroll(monthToGenerate);
    setShowPayrollDialog(false);
  };

  const handleViewDetails = (item: PayrollItem) => {
    setSelectedPayroll(item);
    setShowDetailsDialog(true);
  };

  const handleExportPayroll = () => {
    // In a real app, this would generate a CSV or PDF
    alert("Payroll data would be exported here");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600">Manage employee compensation and payments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportPayroll}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowPayrollDialog(true)}
          >
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
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{filteredPayroll.filter(p => p.status === "Paid").length}</p>
              <p className="text-sm text-gray-600">Payments Processed</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">${pendingPayroll.toLocaleString()}</p>
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
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="current">Current Month</TabsTrigger>
              <TabsTrigger value="previous">Previous Month</TabsTrigger>
              <TabsTrigger value="all">All Periods</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {selectedPayrollIds.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md flex justify-between items-center mb-4">
          <p className="text-blue-800">
            <span className="font-semibold">{selectedPayrollIds.length}</span> payroll items selected
          </p>
          <Button onClick={handleProcessPayroll}>
            Process Selected Payments
          </Button>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox 
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  checked={
                    filteredPayroll.filter(p => p.status === "Pending").length > 0 && 
                    filteredPayroll.filter(p => p.status === "Pending").every(p => selectedPayrollIds.includes(p.id))
                  }
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Employee
                  {sortConfig.key === 'name' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                <div className="flex items-center">
                  Department
                  {sortConfig.key === 'department' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('baseSalary')}>
                <div className="flex items-center">
                  Base Salary
                  {sortConfig.key === 'baseSalary' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('netPay')}>
                <div className="flex items-center">
                  Net Pay
                  {sortConfig.key === 'netPay' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center">
                  Status
                  {sortConfig.key === 'status' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPayroll.length > 0 ? (
              sortedPayroll.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.status === "Pending" && (
                      <Checkbox 
                        checked={selectedPayrollIds.includes(item.id)}
                        onCheckedChange={() => handleSelectPayroll(item.id)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.position}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>${item.baseSalary.toLocaleString()}</TableCell>
                  <TableCell>${(item.deductions + item.taxWithholding + item.benefits).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">${item.netPay.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No payroll data found for the selected period
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Run Payroll Dialog */}
      <Dialog open={showPayrollDialog} onOpenChange={setShowPayrollDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Pay Period
              </label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="previous">Previous Month</SelectItem>
                  <SelectItem value="jan">January</SelectItem>
                  <SelectItem value="feb">February</SelectItem>
                  <SelectItem value="mar">March</SelectItem>
                  <SelectItem value="apr">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="jun">June</SelectItem>
                  <SelectItem value="jul">July</SelectItem>
                  <SelectItem value="aug">August</SelectItem>
                  <SelectItem value="sep">September</SelectItem>
                  <SelectItem value="oct">October</SelectItem>
                  <SelectItem value="nov">November</SelectItem>
                  <SelectItem value="dec">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">
                This will generate payroll entries for all employees for the selected pay period.
              </p>
              <p className="text-sm text-gray-600">
                New entries will be created with "Pending" status.
              </p>
            </div>
            
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPayrollDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleGeneratePayroll}>
                Generate Payroll
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payroll Details Dialog */}
      {selectedPayroll && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payroll Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedPayroll.name}</h2>
                  <p className="text-gray-600">{selectedPayroll.position} • {selectedPayroll.department}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <Badge className={getStatusColor(selectedPayroll.status)}>
                    {selectedPayroll.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    Pay Period: {selectedPayroll.payPeriod}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>Base Salary</span>
                      <span className="font-medium">${selectedPayroll.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Bonus</span>
                      <span className="font-medium">${selectedPayroll.bonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Overtime</span>
                      <span className="font-medium">${selectedPayroll.overtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total Earnings</span>
                      <span>${(selectedPayroll.baseSalary + selectedPayroll.bonus + selectedPayroll.overtime).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>Tax Withholding</span>
                      <span className="font-medium">${selectedPayroll.taxWithholding.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Benefits</span>
                      <span className="font-medium">${selectedPayroll.benefits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Other Deductions</span>
                      <span className="font-medium">${selectedPayroll.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total Deductions</span>
                      <span>${(selectedPayroll.taxWithholding + selectedPayroll.benefits + selectedPayroll.deductions).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Net Pay</h3>
                  <span className="text-2xl font-bold">${selectedPayroll.netPay.toLocaleString()}</span>
                </div>
                {selectedPayroll.paymentDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    Payment Date: {selectedPayroll.paymentDate}
                  </p>
                )}
                {selectedPayroll.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm">{selectedPayroll.notes}</p>
                  </div>
                )}
              </Card>
              
              <div className="flex justify-end gap-2">
                {selectedPayroll.status === "Pending" && (
                  <Button 
                    onClick={() => {
                      processPayroll([selectedPayroll.id]);
                      setShowDetailsDialog(false);
                    }}
                  >
                    Process Payment
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Payroll;