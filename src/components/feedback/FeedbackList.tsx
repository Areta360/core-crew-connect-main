import React from 'react';
import { Card } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { useFeedback } from '@/context/FeedbackContext';

interface FeedbackListProps {
  employeeId: number;
}

export const FeedbackList = ({ employeeId }: FeedbackListProps) => {
  const { getEmployeeFeedbacks, markAsRead } = useFeedback();
  const feedbacks = getEmployeeFeedbacks(employeeId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  if (feedbacks.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        No feedback available yet.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card 
          key={feedback.id} 
          className={`p-4 ${!feedback.isRead ? 'border-blue-300 bg-blue-50' : ''}`}
          onClick={() => !feedback.isRead && markAsRead(feedback.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(feedback.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(feedback.createdAt)}
              </span>
            </div>
            {!feedback.isRead && (
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
          {feedback.message && (
            <p className="mt-2 text-gray-700">{feedback.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">From: {feedback.createdBy}</p>
        </Card>
      ))}
    </div>
  );
};