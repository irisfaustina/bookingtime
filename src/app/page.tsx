
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {

  const { userId } = await auth()
  if (userId != null) redirect("/events") /* redirect to  application if signed in */

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};
