
import React from 'react';
import Link from 'next/link';
import { BsCalendar3 } from "react-icons/bs";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 py-20">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-12 md:mb-0 max-w-xs">
            <div className="flex items-center space-x-2 mb-4">
              <BsCalendar3 className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">bookingtime</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Scheduling infrastructure for everyone. The fastest way to schedule meetings.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
            <ul className="space-y-3">
            <li><Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
          </div>
        </div>

        <div className="mt-16 pt-8">
          <p className="text-sm text-gray-600 text-center">
            &copy; {currentYear} bookingtime.
          </p>
          <p className="text-sm text-gray-600 text-center">
            Landing page made collaboratively by 👩🏻‍💻 and 🤖.
          </p>
        </div>
    </footer>
  );
};

export default Footer;