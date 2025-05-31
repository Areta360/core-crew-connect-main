import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Calendar, Building, Briefcase, DollarSign, MapPin, Edit } from 'lucide-react';
import { Employee } from '@/context/EmployeeContext';
import { InstantFeedback } from './feedback/InstantFeedback';
import { FeedbackList } from './feedback/FeedbackList';

interface EmployeeDetailProps {
  employee: Employee;
  onEdit: (id: number) => void;
  onClose: () => void;
}

export const EmployeeDetail = ({ employee, onEdit, onClose }: EmployeeDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      case "Terminated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{employee.name}</h2>
            <p className="text-gray-600">{employee.position}</p>
            <Badge className={getStatusColor(employee.status)}>
              {employee.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <InstantFeedback employeeId={employee.id} employeeName={employee.name} />
          <Button variant="outline" size="sm" onClick={() => onEdit(employee.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{employee.email}</p>
                </div>
              </div>
              
              {employee.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{employee.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p>{employee.joinDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p>{employee.department}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p>{employee.position}</p>
                </div>
              </div>
              
              {employee.employeeId && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p>{employee.employeeId}</p>
                  </div>
                </div>
              )}
              
              {employee.salary && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p>${employee.salary.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {employee.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{employee.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-4">
          <FeedbackList employeeId={employee.id} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Card>
  );
};