import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Feedback {
  id: string;
  employeeId: number;
  rating: number; // 1-5 stars
  message: string;
  createdAt: string;
  createdBy: string;
  isRead: boolean;
}

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  getEmployeeFeedbacks: (employeeId: number) => Feedback[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const storedFeedbacks = localStorage.getItem('feedbacks');
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isRead'>) => {
    const newFeedback = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setFeedbacks([...feedbacks, newFeedback]);
  };

  const markAsRead = (id: string) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { ...f, isRead: true } : f
    ));
  };

  const getEmployeeFeedbacks = (employeeId: number) => {
    return feedbacks.filter(f => f.employeeId === employeeId);
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, markAsRead, getEmployeeFeedbacks }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};