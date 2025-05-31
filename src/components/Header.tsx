import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from 'lucide-react';
import { useSidebar } from "@/components/ui/sidebar";

export const Header = () => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <header className="h-16 border-b bg-white flex items-center px-4 justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};