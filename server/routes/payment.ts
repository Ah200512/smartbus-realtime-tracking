import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { withLegacyId, withLegacyIds } from '../lib/formatters.js';
import QRCode from 'qrcode';

const router = Router();

// POST /api/payment/cart - Create order
router.post('/cart', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { plan, price, paymentMethod } = req.body;
    if (!plan || price === undefined) {
      return res.status(400).json({ message: 'Plan and price are required' });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        userId: req.userId,
        plan,
        price: Number(price),
        paymentMethod,
        invoiceNumber,
        status: 'pending',
      },
    });
    res.status(201).json(withLegacyId(order));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/payment/checkout/:orderId - Complete checkout & generate QR
router.post('/checkout/:orderId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, lastFour } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Generate QR code
    const qrData = JSON.stringify({
      userId: req.userId,
      orderId,
      timestamp: new Date().toISOString(),
      type: 'smartbus_subscription',
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#f97316', light: '#1a1a2e' },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'completed',
        qrCode: qrCodeDataUrl,
      },
    });

    // Update user subscription
    const isFreeTrial = order.plan === 'basic' && order.price === 0;
    const subscriptionEnd = new Date();

    if (isFreeTrial) {
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 14); // 14-day trial
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1-month subscription
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user) {
      const paymentMethods = Array.isArray(user.paymentMethods) ? user.paymentMethods : [];
      await prisma.user.update({
        where: { id: req.userId },
        data: {
          plan: updatedOrder.plan,
          subscriptionStart: new Date(),
          subscriptionEnd,
          trialUsed: isFreeTrial,
          paymentMethods: [
            ...paymentMethods,
            {
              id: `${paymentMethod}-${Date.now()}`,
              type: paymentMethod,
              last4: lastFour || '',
              brand: paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Bank',
              isDefault: true,
              createdAt: new Date(),
            },
          ],
        },
      });
    }

    res.json(withLegacyId(updatedOrder));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/payment/generate-qr - Generate standalone QR code
router.post('/generate-qr', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data } = req.body;
    const qrData = JSON.stringify({
      userId: req.userId,
      data: data || {},
      timestamp: new Date().toISOString(),
      type: 'smartbus_pass',
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#f97316', light: '#1a1a2e' },
    });

    res.json({ qrCode: qrCodeDataUrl });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/payment/orders - Get user orders
router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(withLegacyIds(orders));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
