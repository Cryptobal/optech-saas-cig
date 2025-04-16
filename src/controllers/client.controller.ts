import { Request, Response } from 'express';
import { Client } from '../models/client.model';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el cliente' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
}; 