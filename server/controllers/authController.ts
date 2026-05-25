import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { withLegacyUser } from '../lib/formatters.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smartbus_jwt_secret_key_2026_india';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, name, email, password } = req.body;
    const finalUsername = username || name || email;

    if (!finalUsername || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: finalUsername,
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Register successful',
      token,
      user: withLegacyUser(user),
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('Incoming data:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: withLegacyUser(user),
    });
  } catch (error: any) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = loginUser;

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(withLegacyUser(user));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: (req as any).userId },
      data: { role },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(withLegacyUser(user));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
