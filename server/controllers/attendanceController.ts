import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { withLegacyId } from '../lib/formatters.js';

function formatAttendance(record: any) {
  return {
    ...record,
    _id: record.id,
    userId: record.user
      ? {
          id: record.user.id,
          _id: record.user.id,
          username: record.user.username,
          email: record.user.email,
          role: record.user.role,
        }
      : record.userId,
    busId: record.bus
      ? {
          id: record.bus.id,
          _id: record.bus.id,
          busNumber: record.bus.busNumber,
          routeName: record.bus.routeName,
        }
      : record.busId,
    profile: record.profile
      ? {
          ...record.profile,
          _id: record.profile.id,
        }
      : null,
  };
}

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { busId, status } = req.body;

    const bus = await prisma.bus.findUnique({ where: { id: busId } });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        busId,
        status: status || 'Present',
      },
    });

    res.status(201).json(withLegacyId(attendance));
  } catch (error: any) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const records = await prisma.attendance.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        bus: {
          select: {
            id: true,
            busNumber: true,
            routeName: true,
          },
        },
      },
    });

    const userIds = records.map((record) => record.userId);
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds } },
    });
    const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));

    res.json(
      records.map((record) =>
        formatAttendance({
          ...record,
          profile: profileByUserId.get(record.userId) || null,
        })
      )
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
