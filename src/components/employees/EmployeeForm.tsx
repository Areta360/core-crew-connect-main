
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import { Employee } from '@/context/EmployeeContext';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: number;
}

export const EmployeeForm = ({ isOpen, onClose, employeeId }: EmployeeFormProps) => {
  const { addEmployee, updateEmployee, getEmployee } = useEmployees();
  const isEditing = employeeId !== undefined;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    joinDate: '',
    department: '',
    position: '',
    status: 'Active' as Employee['status'],
    salary: '',
    employeeId: '',
    address: ''
  });

  useEffect(() => {
    if (isEditing && employeeId) {
      const employee = getEmployee(employeeId);
      if (employee) {
        // Split name into first and last name (assuming format is "First Last")
        const nameParts = employee.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData({
          firstName,
          lastName,
          email: employee.email || '',
          phone: employee.phone || '',
          joinDate: employee.joinDate || '',
          department: employee.department || '',
          position: employee.position || '',
          status: employee.status || 'Active',
          salary: employee.salary?.toString() || '',
          employeeId: employee.employeeId || '',
          address: employee.address || ''
        });
      }
    }
  }, [isEditing, employeeId, getEmployee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as Employee['status']
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      joinDate: formData.joinDate,
      department: formData.department,
      position: formData.position,
      status: formData.status,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
      employeeId: formData.employeeId,
      address: formData.address
    };

    if (isEditing && employeeId) {
      updateEmployee(employeeId, employeeData);
    } else {
      addEmployee(employeeData as Omit<Employee, 'id'>);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter last name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter email address" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter phone number" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate" 
                  type="date" 
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  placeholder="Enter department" 
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  placeholder="Enter job position" 
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input 
                  id="salary" 
                  type="number" 
                  placeholder="Enter salary" 
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input 
                  id="employeeId" 
                  placeholder="Enter employee ID" 
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="Enter full address" 
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Employee' : 'Add Employee'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
