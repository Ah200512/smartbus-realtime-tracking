import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { withLegacyId, withLegacyIds } from '../lib/formatters.js';
import { getSingleParam } from '../lib/params.js';

const router = Router();

// GET /api/reviews - Get all reviews (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const reviews = await prisma.review.findMany({
      where: role ? { role } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(withLegacyIds(reviews));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/user - Get user's reviews (authenticated)
router.get('/user/my-reviews', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(withLegacyIds(reviews));
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch user reviews' });
  }
});

// POST /api/reviews - Create a new review (authenticated)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, title, comment, role } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!rating || !title || !comment || !role) {
      return res.status(400).json({ message: 'Rating, title, comment, and role are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!['STUDENT', 'DRIVER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        userName: user.username || user.email || 'Anonymous',
        userEmail: user.email,
        rating: Number(rating),
        title,
        comment,
        role,
      },
    });

    res.status(201).json(withLegacyId(review));
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

// PUT /api/reviews/:id - Update a review (authenticated, owner only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);
    const { rating, title, comment } = req.body;
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({ message: 'Review id is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ? Number(rating) : review.rating,
        title: title || review.title,
        comment: comment || review.comment,
      },
    });
    res.json(withLegacyId(updatedReview));
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id - Delete a review (authenticated, owner only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({ message: 'Review id is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

export default router;
