import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function formatProfile(profile: Awaited<ReturnType<typeof prisma.profile.findUnique>> & { user?: any } | null) {
  if (!profile) return profile;

  const user = profile.user;
  return {
    ...profile,
    _id: profile.id,
    userId: user
      ? {
          id: user.id,
          _id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          onboardingDone: user.onboardingDone,
        }
      : profile.userId,
    role: user?.role,
    onboardingDone: user?.onboardingDone,
  };
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            onboardingDone: true,
          },
        },
      },
    });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(formatProfile(profile));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const existingProfile = await prisma.profile.findUnique({ where: { userId } });
    
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const { fullName, registerNumber, phone, department, year, gender, address } = req.body;
    
    const profile = await prisma.profile.create({
      data: {
        userId,
        fullName,
        registerNumber,
        phone,
        department,
        year,
        gender,
        address,
      },
    });
    
    res.status(201).json(formatProfile(profile));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { fullName, registerNumber, phone, department, year, gender, address } = req.body;
    
    const profile = await prisma.profile.update({
      where: { userId },
      data: { fullName, registerNumber, phone, department, year, gender, address },
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(formatProfile(profile));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
