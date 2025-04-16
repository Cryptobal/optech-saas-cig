"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, LogOut, Settings, HelpCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ThemeSwitch } from '@/components/theme-switch';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth();
  
  // Función para convertir la ruta en una navegación de migas de pan
  const getBreadcrumbs = () => {
    // Eliminar los segmentos de ruta especiales de Next.js
    const cleanPath = pathname.replace(/^\/(dashboard|clients|guards|locations|reports)/, '/$1');
    const segments = cleanPath.split('/').filter(Boolean);
    
    // Convertir cada segmento en un nombre legible
    return segments.map(segment => {
      // Capitalizar primera letra y reemplazar guiones por espacios
      const formatted = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return formatted;
    });
  };
  
  const breadcrumbs = getBreadcrumbs();

  // Simular apertura del teclado Command+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <header className="h-16 border-b border-border glassmorphism px-4 flex items-center justify-between z-10">
      {/* Breadcrumbs - Left Section */}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu size={20} />
        </Button>
        
        <nav className="flex items-center" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <AnimatePresence mode="wait">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb}>
                  {index > 0 && (
                    <li className="text-muted-foreground mx-1">/</li>
                  )}
                  <motion.li
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className={`${index === breadcrumbs.length - 1 ? 'font-medium' : 'text-muted-foreground'}`}>
                      {crumb}
                    </span>
                  </motion.li>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </ol>
        </nav>
      </div>
      
      {/* Search & User Section - Right Section */}
      <div className="flex items-center space-x-4">
        {/* Global Search Button */}
        <Button 
          variant="outline" 
          className="hidden md:flex items-center text-sm text-muted-foreground w-60 justify-between"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span>Buscar...</span>
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        
        {/* Command Palette */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Buscar en todo el sistema..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup heading="Sugerencias">
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Clientes</span>
              </CommandItem>
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Guardias</span>
              </CommandItem>
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Ubicaciones</span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Acciones">
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </CommandItem>
              <CommandItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ayuda</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
        
        {/* Mobile Search */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search size={20} />
        </Button>
        
        {/* Theme Switch */}
        <ThemeSwitch />
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto py-2">
              {[1, 2, 3].map((_, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start py-2 cursor-pointer">
                  <div className="font-medium">Novedad en turno</div>
                  <div className="text-xs text-muted-foreground">Guardia reportó una incidencia en Ubicación A</div>
                  <div className="text-xs text-muted-foreground mt-1">Hace 10 minutos</div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-blue-500 cursor-pointer">
              Ver todas las notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@usuario" />
                <AvatarFallback>GM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Gerente ACME</p>
                <p className="text-xs text-muted-foreground">gerente@acme.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ayuda</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 