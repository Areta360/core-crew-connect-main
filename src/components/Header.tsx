import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from 'lucide-react';
import { useSidebar } from "@/components/ui/sidebar";

export const Header = () => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <header className="h-16 border-b bg-white flex items-center px-4 justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="mr-4"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">HR Portal</h1>
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