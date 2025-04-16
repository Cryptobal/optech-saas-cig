"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Building2, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { fetchWithAuth } from '@/lib/fetch';

interface Tenant {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users?: number;
  guards?: number;
}

interface FormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<FormData>({ name: '', description: '', status: 'active' });
  const [editForm, setEditForm] = useState<FormData>({ name: '', description: '', status: 'active' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(api.tenants.list);
      setTenants(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al cargar los tenants');
      } else {
        setError('Error al cargar los tenants');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    try {
      await fetchWithAuth(api.tenants.create, {
        method: 'POST',
        body: JSON.stringify({
          name: createForm.name,
          description: createForm.description,
          is_active: createForm.status === 'active'
        }),
      });
      setIsCreateModalOpen(false);
      fetchTenants();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al crear el tenant');
      } else {
        setError('Error al crear el tenant');
      }
    }
  };

  const handleEditTenant = async () => {
    if (!selectedTenant) return;
    try {
      await fetchWithAuth(`${api.tenants.update}/${selectedTenant.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          is_active: editForm.status === 'active'
        }),
      });
      setIsEditModalOpen(false);
      fetchTenants();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al actualizar el tenant');
      } else {
        setError('Error al actualizar el tenant');
      }
    }
  };

  const handleDeleteTenant = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tenant?')) return;
    try {
      await fetchWithAuth(`${api.tenants.delete}/${id}`, {
        method: 'DELETE',
      });
      fetchTenants();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al eliminar el tenant');
      } else {
        setError('Error al eliminar el tenant');
      }
    }
  };

  useEffect(() => {
    if (selectedTenant) {
      setEditForm({
        name: selectedTenant.name || '',
        description: selectedTenant.description || '',
        status: selectedTenant.is_active ? 'active' : 'inactive',
      });
    }
  }, [selectedTenant]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administración de Tenants</h1>
          <p className="text-muted-foreground">
            Gestiona las empresas y organizaciones que utilizan GARD
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo tenant</DialogTitle>
              <DialogDescription>
                Completa la información para crear un nuevo tenant
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la empresa</Label>
                <Input 
                  id="name" 
                  placeholder="Ej: Empresa XYZ" 
                  value={createForm.name} 
                  onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Input 
                  id="description" 
                  placeholder="Breve descripción" 
                  value={createForm.description} 
                  onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={createForm.status} 
                  onValueChange={(value: 'active' | 'inactive') => setCreateForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTenant}>Crear tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">
              Empresas registradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenants.reduce((acc, tenant) => acc + (tenant.users ?? 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios en todos los tenants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guardias Totales</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenants.reduce((acc, tenant) => acc + (tenant.guards ?? 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Guardias en todos los tenants
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tenants</CardTitle>
          <CardDescription>
            Gestiona y administra todos los tenants del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Guardias</TableHead>
                  <TableHead>Fecha de creación</TableHead>
                  <TableHead>Fecha de actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.description ?? ''}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tenant.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tenant.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>{tenant.users ?? 0}</TableCell>
                    <TableCell>{tenant.guards ?? 0}</TableCell>
                    <TableCell>{tenant.created_at ? format(new Date(tenant.created_at), 'dd/MM/yyyy') : ''}</TableCell>
                    <TableCell>{tenant.updated_at ? format(new Date(tenant.updated_at), 'dd/MM/yyyy') : ''}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteTenant(tenant.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar tenant</DialogTitle>
            <DialogDescription>
              Modifica la información del tenant seleccionado
            </DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre de la empresa</Label>
                <Input 
                  id="edit-name" 
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Empresa XYZ" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Input 
                  id="edit-description" 
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Breve descripción" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(value: "active" | "inactive") => setEditForm(f => ({ ...f, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTenant}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 