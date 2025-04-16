import React from 'react';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | GARD',
  description: 'Panel de control de GARD para gestión de seguridad',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 