import React from 'react';
import { Calendar, Clock, Share2, UserCheck } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-calendar" />,
    title: 'Easy Event Creation',
    description: 'Quickly set up different event types with custom details'
  },
  {
    icon: <Clock className="h-8 w-8 text-calendar" />,
    title: 'Smart Availability',
    description: 'Define your working hours and sync across multiple calendars'
  },
  {
    icon: <Share2 className="h-8 w-8 text-calendar" />,
    title: 'Simple Sharing',
    description: 'Generate unique booking links to share with clients and colleagues'
  },
  {
    icon: <UserCheck className="h-8 w-8 text-calendar" />,
    title: 'Instant Booking',
    description: 'Let invitees choose optimal time slots with ease'
  }
];

export default function Features (){
  return (
    <div className="py-24 bg-white">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">How bookingtime works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white hover:bg-blue-50/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="mb-6 text-blue-600 p-4 rounded-full group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

