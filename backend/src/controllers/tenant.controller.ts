import { Request, Response } from 'express';
import { Tenant } from '../models/tenant.model';
import { sequelize } from '../config/database';

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await Tenant.findAll();
    res.json(tenants);
  } catch (error) {
    console.error('Error al obtener tenants:', error);
    res.status(500).json({ message: 'Error al obtener tenants' });
  }
};

export const getTenantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant no encontrado' });
    }
    res.json(tenant);
  } catch (error) {
    console.error('Error al obtener tenant:', error);
    res.status(500).json({ message: 'Error al obtener tenant' });
  }
};

export const createTenant = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, is_active } = req.body;
    // Generar slug a partir del nombre
    const slug = name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
    const now = new Date();
    const tenant = await Tenant.create({
      name,
      slug,
      description: description || '',
      is_active: is_active !== undefined ? is_active : true,
      created_at: now,
      updated_at: now
    }, { transaction });

    await transaction.commit();
    res.status(201).json(tenant);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear tenant:', error);
    res.status(500).json({ message: 'Error al crear tenant' });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, domain, status, users, guards } = req.body;
    
    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Tenant no encontrado' });
    }

    await tenant.update({
      name,
      is_active: status !== undefined ? status : tenant.is_active,
      updated_at: new Date()
    }, { transaction });

    await transaction.commit();
    res.json(tenant);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar tenant:', error);
    res.status(500).json({ message: 'Error al actualizar tenant' });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Tenant no encontrado' });
    }

    await tenant.destroy({ transaction });
    await transaction.commit();
    res.json({ message: 'Tenant eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar tenant:', error);
    res.status(500).json({ message: 'Error al eliminar tenant' });
  }
}; 