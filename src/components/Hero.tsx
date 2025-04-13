
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-[72px]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 opacity-50"></div>
      <div className="container px-4 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center relative z-10">
        <div className="flex items-center mb-6 bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-blue-700 font-medium space-x-2 animate-fade-in">
          <Clock className="h-4 w-4" />
          <span>Scheduling made simple</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 max-w-4xl mx-auto leading-[1.1]">
          Effortless Scheduling for <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">Professionals</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl text-gray-600 mb-12 font-normal leading-relaxed">
          Eliminate the back-and-forth emails. bookingtime automates your scheduling, giving you more time to focus on what matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700" style={{height: '50px', width : '150px', fontWeight: '300 500', fontSize: '16px'}}><SignUpButton /></Button>
          <Button size="lg" variant="outline" asChild className="bg-white/95" style={{height: '50px', width : '150px', fontSize: '16px'}}><SignInButton /></Button>
        </div>
      </div>
    </div>
  );
};
