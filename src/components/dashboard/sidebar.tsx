"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  MapPin, 
  Calendar, 
  BarChart, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={collapsed ? 24 : 20} />,
    },
    {
      label: 'Tenants',
      href: '/tenants',
      icon: <Building2 size={collapsed ? 24 : 20} />,
    },
    {
      label: 'Clientes',
      href: '/clients',
      icon: <Users size={collapsed ? 24 : 20} />,
    },
    {
      label: 'Guardias',
      href: '/guards',
      icon: <Shield size={collapsed ? 24 : 20} />,
    },
    {
      label: 'Ubicaciones',
      href: '/locations',
      icon: <MapPin size={collapsed ? 24 : 20} />,
    },
    {
      label: 'Turnos',
      href: '/shifts',
      icon: <Calendar size={collapsed ? 24 : 20} />,
    },
    {
      label: 'Reportes',
      href: '/reports',
      icon: <BarChart size={collapsed ? 24 : 20} />,
    },
  ];

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-card border-r border-border relative"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              G
            </div>
            <span className="font-bold text-lg">GARD</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              G
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 mt-4">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : 'justify-start'
                    } px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                    }`}
                  >
                    <div className={`${collapsed ? '' : 'mr-3'}`}>{item.icon}</div>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 w-full px-2">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'justify-start'
                  } px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-secondary/80 hover:text-foreground`}
                >
                  <div className={`${collapsed ? '' : 'mr-3'}`}>
                    <Settings size={collapsed ? 24 : 20} />
                  </div>
                  {!collapsed && <span>Configuración</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Configuración
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/help"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'justify-start'
                  } px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-secondary/80 hover:text-foreground`}
                >
                  <div className={`${collapsed ? '' : 'mr-3'}`}>
                    <HelpCircle size={collapsed ? 24 : 20} />
                  </div>
                  {!collapsed && <span>Ayuda</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Ayuda
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full mt-4 flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          } text-muted-foreground hover:text-foreground`}
        >
          {!collapsed && <span>Colapsar</span>}
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
    </motion.aside>
  );
} 