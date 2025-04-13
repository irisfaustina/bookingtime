
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BsCalendar3 } from "react-icons/bs";
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full border-b bg-white/95 backdrop-blur-sm z-50 py-4 transition-all duration-300">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <BsCalendar3 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">bookingtime</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 font-large"><SignUpButton /></Button>
          <Button variant="outline" size="lg" asChild className="bg-white/95 hover:transform: scale(1.15)font-large"><SignInButton /></Button>
        </div>
      </div>
    </nav>
  );
};