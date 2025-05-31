import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { useFeedback } from '@/context/FeedbackContext';
import { useToast } from "@/components/ui/use-toast";

interface InstantFeedbackProps {
  employeeId: number;
  employeeName: string;
}

export const InstantFeedback = ({ employeeId, employeeName }: InstantFeedbackProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const { addFeedback } = useFeedback();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting feedback.",
        variant: "destructive"
      });
      return;
    }

    addFeedback({
      employeeId,
      rating,
      message,
      createdBy: "Current User" // In a real app, get from auth context
    });

    toast({
      title: "Feedback sent",
      description: `Your feedback for ${employeeName} has been submitted.`
    });

    // Reset and close
    setRating(0);
    setMessage('');
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="flex items-center gap-1"
      >
        <Star className="h-4 w-4" />
        Quick Feedback
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Instant Feedback for {employeeName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Feedback Message (Optional)
              </label>
              <Textarea
                id="message"
                placeholder="Share your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRating(0);
                  setMessage('');
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Send Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};