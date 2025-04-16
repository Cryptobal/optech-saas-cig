"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Clock, Users, Shield, MapPin, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

// Componente para estadísticas
const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend = null 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean } | null;
}) => (
  <Card className="hover-lift">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="rounded-full p-2 bg-secondary/50">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`flex items-center mt-2 text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          <span className="mr-1">{trend.positive ? '↑' : '↓'}</span>
          <span>{trend.value}% respecto al mes anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Componente para alarmas/alertas
const AlertItem = ({ title, description, severity, time }: { title: string; description: string; severity: 'low' | 'medium' | 'high'; time: string }) => {
  const severityColor = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className={`p-3 rounded-lg border ${severityColor[severity]} mb-2`}>
      <div className="flex justify-between">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs">{time}</span>
      </div>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
};

export default function DashboardPage() {
  // Animación para entrada de componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen operativo y KPIs importantes.</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock size={16} className="mr-1" />
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Estadísticas principales */}
      <motion.div 
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="Guardias activos"
          value="42/45"
          description="93% de guardias en servicio"
          icon={<Shield size={16} />}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Instalaciones"
          value="15"
          description="4 con alertas recientes"
          icon={<MapPin size={16} />}
          trend={{ value: 2, positive: true }}
        />
        <StatCard
          title="Clientes"
          value="8"
          description="Todos los contratos activos"
          icon={<Users size={16} />}
        />
        <StatCard
          title="PPC"
          value="3"
          description="Puestos por cubrir hoy"
          icon={<AlertTriangle size={16} />}
          trend={{ value: 4, positive: false }}
        />
      </motion.div>

      {/* Tabs con vistas de trabajo */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="actual" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="actual">Vista actual</TabsTrigger>
            <TabsTrigger value="mensual">Planificación mensual</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="actual" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Lista de turnos actuales */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    Turnos activos
                  </CardTitle>
                  <CardDescription>Turnos actualmente en servicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Edificio Central', guards: 5, total: 5, complete: true },
                      { name: 'Centro Comercial Norte', guards: 8, total: 10, complete: false },
                      { name: 'Oficinas Ejecutivas', guards: 3, total: 3, complete: true },
                      { name: 'Bodega Principal', guards: 2, total: 3, complete: false }
                    ].map((location, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-medium">{location.name}</span>
                            {location.complete ? (
                              <CheckCircle size={14} className="ml-2 text-green-500" />
                            ) : (
                              <AlertTriangle size={14} className="ml-2 text-yellow-500" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {location.guards}/{location.total} guardias
                          </span>
                        </div>
                        <Progress 
                          value={(location.guards / location.total) * 100} 
                          className={location.complete ? 'bg-green-500/20' : 'bg-yellow-500/20'}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Últimas alertas */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle size={18} className="mr-2" />
                    Últimas novedades
                  </CardTitle>
                  <CardDescription>Alertas y novedades reportadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <AlertItem 
                      title="Ausencia no programada" 
                      description="Guardia Juan Pérez no se presentó en Centro Comercial Norte"
                      severity="high"
                      time="Hace 2h"
                    />
                    <AlertItem 
                      title="Ronda perdida" 
                      description="No se registró ronda en sector 3 de Bodega Principal"
                      severity="medium"
                      time="Hace 3h"
                    />
                    <AlertItem 
                      title="Relevo de turno" 
                      description="Cambio de guardia realizado en Oficinas Ejecutivas"
                      severity="low"
                      time="Hace 6h"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="mensual">
            <Card>
              <CardHeader>
                <CardTitle>Planificación mensual</CardTitle>
                <CardDescription>Visión general de la pauta mensual</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">Vista de calendario mensual con disponibilidad y programación de guardias por instalación</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alertas">
            <Card>
              <CardHeader>
                <CardTitle>Centro de alertas</CardTitle>
                <CardDescription>Todas las alertas y notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">Panel centralizado de monitoreo con filtros por tipo de alerta, instalación y nivel de prioridad</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Sección inferior: Actividad reciente y KPIs */}
      <div className="grid gap-4 md:grid-cols-7">
        <motion.div variants={itemVariants} className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>Últimos eventos del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Marcación de entrada", user: "Carlos Ruiz", time: "09:15", location: "Edificio Central" },
                  { action: "Modificación de turno", user: "Admin", time: "08:30", location: "Centro Comercial Norte" },
                  { action: "Reporte de incidencia", user: "María López", time: "07:45", location: "Bodega Principal" },
                  { action: "Ronda completada", user: "Juan Pérez", time: "06:30", location: "Oficinas Ejecutivas" }
                ].map((event, i) => (
                  <div key={i} className="pb-4 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.action}</h4>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.user}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                    {i < 3 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>KPIs operativos</CardTitle>
              <CardDescription>Métricas clave de rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Cobertura de turnos", value: 93, target: 98, status: "warning" },
                  { label: "Puntualidad de guardias", value: 97, target: 95, status: "success" },
                  { label: "Rondas completadas", value: 89, target: 90, status: "warning" },
                  { label: "Incidencias resueltas", value: 100, target: 95, status: "success" }
                ].map((kpi, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{kpi.label}</span>
                      <div className="flex items-center">
                        <span className={`text-sm ${kpi.status === 'success' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {kpi.value}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          Meta: {kpi.target}%
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={kpi.value} 
                      className={kpi.status === 'success' ? 'bg-green-500/20' : 'bg-yellow-500/20'}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 