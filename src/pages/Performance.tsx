import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Search, Plus, Star, TrendingUp } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Performance = () => {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("reviews");
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Generate performance data when employees change
  useEffect(() => {
    if (employees.length > 0) {
      const data = employees.map(employee => ({
        id: employee.id,
        name: employee.name,
        position: employee.position,
        department: employee.department,
        rating: Math.floor(Math.random() * 5) + 1,
        status: ["Completed", "In Progress", "Scheduled"][Math.floor(Math.random() * 3)],
        reviewDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
          .toISOString().split('T')[0],
        goals: [
          { title: "Improve coding skills", progress: Math.floor(Math.random() * 100) },
          { title: "Complete training", progress: Math.floor(Math.random() * 100) },
          { title: "Project delivery", progress: Math.floor(Math.random() * 100) }
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      }));
      setPerformanceData(data);
    }
  }, [employees]);

  const filteredPerformance = performanceData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setShowReviewDialog(true);
  };

  const [newReviewData, setNewReviewData] = useState({
    employeeId: "",
    reviewDate: new Date().toISOString().split('T')[0],
    rating: "3",
    status: "In Progress",
    comments: ""
  });
  const [showNewReviewDialog, setShowNewReviewDialog] = useState(false);

  const handleNewReview = () => {
    // Reset form data before showing dialog
    setNewReviewData({
      employeeId: "",
      reviewDate: new Date().toISOString().split('T')[0],
      rating: "3",
      status: "In Progress",
      comments: ""
    });
    setShowNewReviewDialog(true);
  };

  const handleNewReviewSubmit = () => {
    try {
      // In a real app, this would save to backend
      if (newReviewData.employeeId) {
        const employee = employees.find(e => e.id === parseInt(newReviewData.employeeId));
        if (employee) {
          const newReview = {
            id: Date.now(), // Use timestamp as unique ID
            name: employee.name,
            position: employee.position,
            department: employee.department,
            rating: parseInt(newReviewData.rating),
            status: newReviewData.status,
            reviewDate: newReviewData.reviewDate,
            goals: [],
            comments: newReviewData.comments
          };
          
          // Close dialog first to avoid React unmounting issues
          setShowNewReviewDialog(false);
          
          // Update data after dialog is closed
          setTimeout(() => {
            setPerformanceData(prev => [...prev, newReview]);
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleAddGoal = (employeeId: number) => {
    alert(`Add goal functionality for employee ${employeeId} will be implemented soon!`);
  };

  const averageRating = performanceData.length > 0 
    ? (performanceData.reduce((sum, item) => sum + item.rating, 0) / performanceData.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600">Track and evaluate employee performance</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleNewReview}>
          <Plus className="h-4 w-4" />
          New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">
                {performanceData.filter(p => p.status === "Completed").length}
              </p>
              <p className="text-sm text-gray-600">Completed Reviews</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{averageRating}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">
                {performanceData.filter(p => p.rating === 5).length}
              </p>
              <p className="text-sm text-gray-600">Top Performers</p>
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
      </div>

      <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              {filteredPerformance.length > 0 ? (
                filteredPerformance.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.position} • {item.department}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex">
                          {renderStars(item.rating)}
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col md:flex-row justify-between">
                      <p className="text-sm text-gray-500">Review Date: {item.reviewDate}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No performance reviews found
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <Card>
            <div className="p-6 space-y-6">
              {filteredPerformance.filter(item => item.goals && item.goals.length > 0).length > 0 ? (
                filteredPerformance.filter(item => item.goals && item.goals.length > 0).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.position} • {item.department}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddGoal(item.id)}
                      >
                        Add Goal
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {item.goals.map((goal: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{goal.title}</p>
                            <span className="text-sm text-gray-500">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No goals found
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Review Details Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Performance Review Details</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-gray-600">{selectedEmployee.position}</p>
                <div className="flex justify-center mt-2">
                  {renderStars(selectedEmployee.rating)}
                </div>
                <Badge className={`${getStatusColor(selectedEmployee.status)} mt-2`}>
                  {selectedEmployee.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Department</span>
                  <span>{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Review Date</span>
                  <span>{selectedEmployee.reviewDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Rating</span>
                  <span>{selectedEmployee.rating}/5</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Status</span>
                  <span>{selectedEmployee.status}</span>
                </div>
              </div>
              
              {selectedEmployee.goals && selectedEmployee.goals.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Goals & Objectives</h3>
                  <div className="space-y-3">
                    {selectedEmployee.goals.map((goal: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between">
                          <p className="text-sm">{goal.title}</p>
                          <span className="text-sm text-gray-500">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setShowReviewDialog(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* New Review Dialog */}
      {showNewReviewDialog && (
        <Dialog open={showNewReviewDialog} onOpenChange={setShowNewReviewDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Performance Review</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
                  Employee
                </label>
                <select 
                  id="employeeId"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newReviewData.employeeId}
                  onChange={(e) => setNewReviewData(prev => ({...prev, employeeId: e.target.value}))}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="reviewDate" className="block text-sm font-medium mb-1">
                  Review Date
                </label>
                <Input 
                  id="reviewDate"
                  type="date"
                  value={newReviewData.reviewDate}
                  onChange={(e) => setNewReviewData(prev => ({...prev, reviewDate: e.target.value}))}
                />
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium mb-1">
                  Rating (1-5)
                </label>
                <select 
                  id="rating"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newReviewData.rating}
                  onChange={(e) => setNewReviewData(prev => ({...prev, rating: e.target.value}))}
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Average</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select 
                  id="status"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newReviewData.status}
                  onChange={(e) => setNewReviewData(prev => ({...prev, status: e.target.value as any}))}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="comments" className="block text-sm font-medium mb-1">
                  Comments
                </label>
                <textarea 
                  id="comments"
                  className="w-full rounded-md border border-gray-300 p-2"
                  rows={3}
                  value={newReviewData.comments}
                  onChange={(e) => setNewReviewData(prev => ({...prev, comments: e.target.value}))}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewReviewDialog(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNewReviewSubmit}
                  type="button"
                >
                  Create Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Performance;