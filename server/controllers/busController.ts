import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { withLegacyId, withLegacyIds } from '../lib/formatters.js';

export const createBus = async (req: Request, res: Response) => {
  try {
    const bus = await prisma.bus.create({ data: req.body });
    res.status(201).json(withLegacyId(bus));
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating bus', error: error.message });
  }
};

export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const buses = await prisma.bus.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(withLegacyIds(buses));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(withLegacyId(bus));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const bus = await prisma.bus.update({
      where: { id: req.params.id },
      data: req.body,
    });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(withLegacyId(bus));
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating bus', error: error.message });
  }
};

export const deleteBus = async (req: Request, res: Response) => {
  try {
    const bus = await prisma.bus.delete({ where: { id: req.params.id } });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
