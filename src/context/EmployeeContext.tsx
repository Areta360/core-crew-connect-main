import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
  phone?: string;
  salary?: number;
  employeeId?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  getEmployee: (id: number) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    joinDate: "2022-08-20"
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    department: "Sales",
    position: "Sales Representative",
    status: "On Leave",
    joinDate: "2023-03-10"
  }
];

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Load employees from localStorage on initial render
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(initialEmployees);
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }
  }, []);

  // Update localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      name: `${employee.firstName} ${employee.lastName}`,
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: number, updatedEmployee: Partial<Employee>) => {
    setEmployees(employees.map(employee => 
      employee.id === id 
        ? { 
            ...employee, 
            ...updatedEmployee,
            name: updatedEmployee.firstName && updatedEmployee.lastName 
              ? `${updatedEmployee.firstName} ${updatedEmployee.lastName}`
              : employee.name
          } 
        : employee
    ));
  };

  const deleteEmployee = (id: number) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  const getEmployee = (id: number) => {
    return employees.find(employee => employee.id === id);
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee, getEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};