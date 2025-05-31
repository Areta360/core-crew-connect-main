import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEmployees } from './EmployeeContext';

export interface PayrollItem {
  id: number;
  employeeId: number;
  name: string;
  position: string;
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Processing';
  paymentDate?: string;
  payPeriod: string;
  taxWithholding: number;
  benefits: number;
  overtime: number;
  notes?: string;
}

interface PayrollContextType {
  payrollData: PayrollItem[];
  addPayrollItem: (item: Omit<PayrollItem, 'id' | 'netPay'>) => void;
  updatePayrollItem: (id: number, item: Partial<PayrollItem>) => void;
  deletePayrollItem: (id: number) => void;
  getPayrollItem: (id: number) => PayrollItem | undefined;
  processPayroll: (ids: number[]) => void;
  generatePayroll: (month: string) => void;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { employees } = useEmployees();
  const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);

  // Load payroll data from localStorage on initial render
  useEffect(() => {
    const storedPayroll = localStorage.getItem('payrollData');
    if (storedPayroll) {
      setPayrollData(JSON.parse(storedPayroll));
    } else {
      // Generate initial payroll data if none exists
      const initialPayroll = generateInitialPayroll();
      setPayrollData(initialPayroll);
      localStorage.setItem('payrollData', JSON.stringify(initialPayroll));
    }
  }, []);

  // Update localStorage whenever payroll data changes
  useEffect(() => {
    localStorage.setItem('payrollData', JSON.stringify(payrollData));
  }, [payrollData]);

  // Generate initial payroll data based on employees
  const generateInitialPayroll = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const payPeriod = `${month} ${year}`;

    return employees.map(employee => ({
      id: employee.id * 100 + Math.floor(Math.random() * 100),
      employeeId: employee.id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      baseSalary: employee.salary || Math.floor(Math.random() * 50000) + 50000,
      bonus: Math.floor(Math.random() * 5000),
      deductions: Math.floor(Math.random() * 2000) + 1000,
      taxWithholding: Math.floor((employee.salary || 60000) * 0.2),
      benefits: Math.floor(Math.random() * 1000) + 500,
      overtime: 0,
      netPay: 0,
      status: Math.random() > 0.3 ? 'Paid' : 'Pending',
      payPeriod,
      paymentDate: Math.random() > 0.3 ? new Date().toISOString().split('T')[0] : undefined
    })).map(item => ({
      ...item,
      netPay: item.baseSalary + item.bonus + item.overtime - item.deductions - item.taxWithholding - item.benefits
    }));
  };

  const addPayrollItem = (item: Omit<PayrollItem, 'id' | 'netPay'>) => {
    const netPay = item.baseSalary + item.bonus + item.overtime - item.deductions - item.taxWithholding - item.benefits;
    
    const newItem = {
      ...item,
      id: payrollData.length > 0 ? Math.max(...payrollData.map(p => p.id)) + 1 : 1,
      netPay
    };
    
    setPayrollData([...payrollData, newItem]);
  };

  const updatePayrollItem = (id: number, updatedItem: Partial<PayrollItem>) => {
    setPayrollData(payrollData.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updatedItem };
        // Recalculate net pay if any financial fields were updated
        if (
          'baseSalary' in updatedItem || 
          'bonus' in updatedItem || 
          'deductions' in updatedItem ||
          'taxWithholding' in updatedItem ||
          'benefits' in updatedItem ||
          'overtime' in updatedItem
        ) {
          updated.netPay = 
            updated.baseSalary + 
            updated.bonus + 
            updated.overtime - 
            updated.deductions - 
            updated.taxWithholding - 
            updated.benefits;
        }
        return updated;
      }
      return item;
    }));
  };

  const deletePayrollItem = (id: number) => {
    setPayrollData(payrollData.filter(item => item.id !== id));
  };

  const getPayrollItem = (id: number) => {
    return payrollData.find(item => item.id === id);
  };

  const processPayroll = (ids: number[]) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    setPayrollData(payrollData.map(item => {
      if (ids.includes(item.id) && item.status === 'Pending') {
        return {
          ...item,
          status: 'Paid',
          paymentDate: currentDate
        };
      }
      return item;
    }));
  };

  const generatePayroll = (month: string) => {
    // In a real app, this would generate payroll for a specific month
    // For demo purposes, we'll just create new entries with the specified month
    const year = new Date().getFullYear();
    const payPeriod = `${month} ${year}`;
    
    const newPayrollItems = employees.map(employee => ({
      id: Date.now() + employee.id,
      employeeId: employee.id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      baseSalary: employee.salary || Math.floor(Math.random() * 50000) + 50000,
      bonus: Math.floor(Math.random() * 5000),
      deductions: Math.floor(Math.random() * 2000) + 1000,
      taxWithholding: Math.floor((employee.salary || 60000) * 0.2),
      benefits: Math.floor(Math.random() * 1000) + 500,
      overtime: Math.floor(Math.random() * 2000),
      netPay: 0,
      status: 'Pending',
      payPeriod,
    })).map(item => ({
      ...item,
      netPay: item.baseSalary + item.bonus + item.overtime - item.deductions - item.taxWithholding - item.benefits
    }));
    
    setPayrollData([...payrollData, ...newPayrollItems]);
  };

  return (
    <PayrollContext.Provider 
      value={{ 
        payrollData, 
        addPayrollItem, 
        updatePayrollItem, 
        deletePayrollItem, 
        getPayrollItem,
        processPayroll,
        generatePayroll
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (context === undefined) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
};